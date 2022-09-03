<template>
  <div class="rankPart-container">
    <div class="chart-container" ref="rank_ref"></div>
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
    this.$socket.regCallback('rankData', this.getBarData)
  },
  mounted() {
    this.initChart()
    // this.getBarData()
    // 获取数据的地方改为发送数据（websocket的🚩方式获取数据）
    this.$socket.sendFn({
      action: 'getData',
      socketType: 'rankData',
      chartName: 'rank',
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
    this.$socket.unregCallback('rankData')
  },
  data() {
    return {
      chartInstance: null, // 空对象
      barData: [],
      startValue: 0, // 区域缩放的起点
      endValue: 9, // 区域缩放的终点
      timerId: null
    }
  },
  methods: {
    // 初始化ECharts对象
    initChart() {
      this.chartInstance = this.$echarts.init(this.$refs.rank_ref, this.theme)

      const initOption = {
        // 标题配置
        title: {
          text: '▎地区销售排行',
          left: 20,
          top: 20
          // textStyle: {
          //   fontSize: 38
          // }
        },
        // 坐标系配置
        grid: {
          top: '40%',
          left: '3%',
          right: '6%',
          bottom: '3%',
          containLabel: true // 包含坐标轴上的文字 🤔
        },

        // 提示框配置
        tooltip: {
          trigger: 'item'
        },

        xAxis: {
          type: 'category'
        },
        yAxis: {
          name: '销售金额（万）',
          type: 'value'
        },
        series: [
          {
            type: 'bar'
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
      // const { data: res } = await this.$http.get('/api/rank')
      // console.log(res)

      this.barData = ret

      // 数据处理✨
      // 排序
      this.barData.sort((a, b) => {
        return b.value - a.value
      })

      this.updateBarGenerate()

      // 启动定时器
      this.showChangeFn()
    },

    // 更新图表（option配置）
    updateBarGenerate() {
      const colorArr = [
        ['#0BA82C', '#4FF778'],
        ['#2E72BF', '#23E5E5'],
        ['#5052EE', '#AB6EE5']
      ]

      // 数据处理✨
      const xProvinceArr = this.barData.map((item) => {
        return item.name
      })
      const yValueArr = this.barData.map((item) => {
        return item.value
      })

      // option配置
      const dataOption = {
        xAxis: {
          data: xProvinceArr
        },

        // 区域缩放配置
        dataZoom: {
          show: false,
          startValue: this.startValue,
          endValue: this.endValue
        },

        series: [
          {
            data: yValueArr,

            // 圆角和颜色渐变
            itemStyle: {
              // barBorderRadius: [33, 33, 0, 0], // 官方文档找不到 😢
              // 颜色渐变
              color: (arg) => {
                let selectColorArr = null
                if (arg.value > 300) {
                  selectColorArr = colorArr[0]
                } else if (arg.value > 200) {
                  selectColorArr = colorArr[1]
                } else {
                  selectColorArr = colorArr[2]
                }
                return new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  // 百分之0状态之下的颜色值
                  {
                    offset: 0,
                    color: selectColorArr[0]
                  },
                  // 百分之100状态之下的颜色值
                  {
                    offset: 1,
                    color: selectColorArr[1]
                  }
                ])
              }
            }
          }
        ]
      }
      // 生成图表
      this.chartInstance.setOption(dataOption)
    },

    // 监听window窗口大小变化
    screenAdapter() {
      const standFontSize = (this.$refs.rank_ref.offsetWidth / 100) * 3.6

      const adapterOption = {
        title: {
          textStyle: {
            fontSize: standFontSize
          }
        },
        series: [
          {
            barWidth: standFontSize,
            itemStyle: {
              barBorderRadius: [standFontSize / 2, standFontSize / 2, 0, 0]
            }
          }
        ]
      }
      // 生成图表
      this.chartInstance.setOption(adapterOption)

      // 手动的调用图表对象的resize 才能产生效果
      this.chartInstance.resize()
    },

    // 利用定时器实现数据的动态刷新
    showChangeFn() {
      if (this.timerId) {
        clearInterval(this.timerId)
      }
      this.timerId = setInterval(() => {
        this.startValue++
        this.endValue++

        // console.log(this.totalPage)
        if (this.endValue > this.barData.length - 1) {
          this.startValue = 0
          this.endValue = 9
        }

        this.updateBarGenerate()
      }, 3000)
    }
  }
}
</script>
<style lang="less" scoped></style>
