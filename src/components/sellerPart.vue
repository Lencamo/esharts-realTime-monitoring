<template>
  <div class="sellerPart-container">
    <div class="chart-container" ref="seller_ref"></div>
  </div>
</template>
<script>
import { mapState } from 'vuex'

export default {
  computed: {
    // 使用vuex数据
    ...mapState(['theme'])
  },
  watch: {
    // 监听vuex的theme值变化
    theme() {
      // console.log('主题发生变化')

      // 销毁图表（使用ECharts的API）
      this.chartInstance.dispose()
      // 重新生成图表
      this.initChart()
      this.screenAdapter()
      this.updateBarGenerate()
    }
  },
  created() {
    // 注册回调函数
    this.$socket.regCallback('sellerData', this.getBarData)
  },
  mounted() {
    this.initChart()
    // this.getBarData()
    // 获取数据的地方改为发送数据（websocket的🚩方式获取数据）
    this.$socket.sendFn({
      action: 'getData',
      socketType: 'sellerData',
      chartName: 'seller',
      value: ''
    })

    window.addEventListener('resize', this.screenAdapter)
    // 屏幕适配
    this.screenAdapter()
  },
  destroyed() {
    // 取消定时器 —— ① 组件销毁时
    clearInterval(this.timerId)

    window.removeEventListener('resize', this.screenAdapter)

    // 销毁回调函数
    this.$socket.unregCallback('sellerData')
  },
  data() {
    return {
      chartInstance: null, // 空对象
      barData: [],
      totalPage: 1, // 页数
      currentPage: 1, // 当前页
      timerId: null // 定时器标识
    }
  },
  methods: {
    // 初始化ECharts对象
    initChart() {
      this.chartInstance = this.$echarts.init(this.$refs.seller_ref, this.theme)

      const initOption = {
        // 标题配置
        title: {
          text: '▎商家销售统计',
          left: 20,
          top: 20
          // textStyle: {
          //   fontSize: 38
          // }
        },
        // 坐标系配置
        grid: {
          top: '25%',
          left: '3%',
          right: '6%',
          bottom: '3%',
          containLabel: true // 包含坐标轴上的文字 🤔
        },
        // 提示框配置
        tooltip: {
          trigger: 'axis',
          // 触发阴影✨
          axisPointer: {
            type: 'line',
            z: 0,
            lineStyle: {
              width: 66,
              color: '#2D3443'
            }
          }
        },

        xAxis: {
          type: 'value'
        },
        yAxis: {
          type: 'category'
        },
        series: [
          {
            type: 'bar',

            // 对每个bar进行配置
            // 宽度
            barWidth: 66,
            // 文字
            label: {
              show: true,
              position: 'right',
              color: 'white'
            },
            // 圆角和颜色渐变
            itemStyle: {
              barBorderRadius: [0, 33, 33, 0], // 官方文档找不到 😢
              // 颜色渐变
              color: new this.$echarts.graphic.LinearGradient(0, 0, 1, 0, [
                // 百分之0状态之下的颜色值
                {
                  offset: 0,
                  color: '#5052EE'
                },
                // 百分之100状态之下的颜色值
                {
                  offset: 1,
                  color: '#AB6EE5'
                }
              ])
            }
          }
        ]
      }
      // 生成图表
      this.chartInstance.setOption(initOption)

      // 定时器 —— ② 鼠标监听事件
      this.chartInstance.on('mouseover', () => {
        clearInterval(this.timerId)
      })
      this.chartInstance.on('mouseout', () => {
        this.showChangeFn()
      })
    },

    // 获取图表数据
    // async getBarData() {
    getBarData(ret) {
      // const { data: res } = await this.$http.get('/api/seller')
      // console.log(res)

      this.barData = ret
      this.updateBarGenerate()

      // 数据处理✨
      // 1、先排序
      this.barData.sort((a, b) => {
        return a.value - b.value // 从小到大排序
      })
      // 2、再分组
      this.totalPage =
        this.barData.length % 5 === 0
          ? this.barData.length / 5
          : this.barData.length / 5 + 1

      // 启动定时器
      this.showChangeFn()
    },

    // 更新图表（option配置）
    updateBarGenerate() {
      // 数据处理✨
      // 3、动态数据生成
      const start = (this.currentPage - 1) * 5
      const end = this.currentPage * 5
      const dynamicData = this.barData.slice(start, end)

      const sellerNames = dynamicData.map((item) => item.name)
      const sellerValues = dynamicData.map((item) => item.value)

      // option配置
      const dataOption = {
        yAxis: {
          data: sellerNames
        },
        series: [
          {
            data: sellerValues
          }
        ]
      }
      // 生成图表
      this.chartInstance.setOption(dataOption)
    },

    // 利用定时器实现数据的动态刷新
    showChangeFn() {
      if (this.timerId) {
        clearInterval(this.timerId)
      }
      this.timerId = setInterval(() => {
        // console.log(this.currentPage)
        this.currentPage++

        // console.log(this.totalPage)
        if (this.currentPage > this.totalPage) {
          this.currentPage = 1
        }

        this.updateBarGenerate()
      }, 3000)
    },

    // 监听window窗口大小变化
    screenAdapter() {
      const standFontSize = (this.$refs.seller_ref.offsetWidth / 100) * 3.6

      const adapterOption = {
        title: {
          textStyle: {
            fontSize: standFontSize
          }
        },
        tooltip: {
          axisPointer: {
            lineStyle: {
              width: standFontSize
            }
          }
        },
        series: [
          {
            barWidth: standFontSize,
            itemStyle: {
              barBorderRadius: [0, standFontSize / 2, standFontSize / 2, 0]
            }
          }
        ]
      }
      // 生成图表
      this.chartInstance.setOption(adapterOption)

      // 手动的调用图表对象的resize 才能产生效果
      this.chartInstance.resize()
    }
  }
}
</script>
<style lang="less" scoped></style>
