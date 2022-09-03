<template>
  <div class="stockPart-container">
    <div class="chart-container" ref="stock_ref"></div>
  </div>
</template>
<script>
export default {
  created() {
    // 注册回调函数
    this.$socket.regCallback('stockData', this.getpieData)
  },
  mounted() {
    this.initChart()
    // this.getpieData()
    // 获取数据的地方改为发送数据（websocket的🚩方式获取数据）
    this.$socket.sendFn({
      action: 'getData',
      socketType: 'stockData',
      chartName: 'stock',
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
    this.$socket.unregCallback('stockData')
  },
  data() {
    return {
      chartInstance: null, // 空对象
      pieData: null,
      currentPage: 0, // 当前显示的数据
      timerId: null // 定时器的标识
    }
  },
  methods: {
    // 初始化ECharts对象
    initChart() {
      this.chartInstance = this.$echarts.init(this.$refs.stock_ref, 'chalk')

      const initOption = {
        // 标题配置
        title: {
          text: '▎库存和销量分析',
          left: 20,
          top: 20
          // textStyle: {
          //   fontSize: 38
          // }
        }
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
    // async getpieData() {
    getpieData(ret) {
      // const { data: res } = await this.$http.get('/api/stock')
      console.log(ret)

      this.pieData = ret
      this.updatePieGenerate()

      // 数据处理✨

      // 启动定时器
      this.showChangeFn()
    },

    // 更新图表（option配置）
    updatePieGenerate() {
      // 每个饼图的位置坐标
      const centerArr = [
        ['18%', '40%'],
        ['50%', '40%'],
        ['82%', '40%'],
        ['34%', '75%'],
        ['66%', '75%']
      ]

      // 饼图环的颜色
      const colorArr = [
        ['#4FF778', '#0BA82C'],
        ['#E5DD45', '#E8B11C'],
        ['#E8821C', '#E55445'],
        ['#5052EE', '#AB6EE5'],
        ['#23E5E5', '#2E72BF']
      ]

      // 数据处理✨
      const start = this.currentPage * 5
      const end = (this.currentPage + 1) * 5
      const showData = this.pieData.slice(start, end)

      const seriesArr = showData.map((item, index) => {
        return {
          type: 'pie',
          // radius: [110, 100],
          center: centerArr[index],
          hoverAnimation: false, // 关闭鼠标移动到饼图时的动画效果
          labelLine: {
            show: false // 隐藏指示线
          },
          label: {
            position: 'center', // data下name值的位置
            color: colorArr[index][0]
            // textStyle: {
            //   fontSize: 26
            // }
          },

          data: [
            {
              name: item.name + '\n' + item.sales,
              value: item.sales, // 销量值
              itemStyle: {
                color: new this.$echarts.graphic.LinearGradient(0, 1, 0, 0, [
                  {
                    offset: 0,
                    color: colorArr[index][0]
                  },
                  {
                    offset: 1,
                    color: colorArr[index][1]
                  }
                ])
              }
            },
            {
              value: item.stock, // 库存值
              itemStyle: {
                color: '#333843'
              }
            }
          ]
        }
      })

      // option配置
      const dataOption = {
        series: seriesArr
      }
      // 生成图表
      this.chartInstance.setOption(dataOption)
    },

    // 监听window窗口大小变化
    screenAdapter() {
      const standFontSize = (this.$refs.stock_ref.offsetWidth / 100) * 3.6

      // 圆环的半径
      const innerRadius = standFontSize * 2
      const outterRadius = innerRadius * 1.125

      const adapterOption = {
        title: {
          textStyle: {
            fontSize: standFontSize
          }
        },
        series: [
          {
            type: 'pie',
            radius: [outterRadius, innerRadius],
            label: {
              fontSize: standFontSize / 2
            }
          },
          {
            type: 'pie',
            radius: [outterRadius, innerRadius],
            label: {
              fontSize: standFontSize / 2
            }
          },
          {
            type: 'pie',
            radius: [outterRadius, innerRadius],
            label: {
              fontSize: standFontSize / 2
            }
          },
          {
            type: 'pie',
            radius: [outterRadius, innerRadius],
            label: {
              fontSize: standFontSize / 2
            }
          },
          {
            type: 'pie',
            radius: [outterRadius, innerRadius],
            label: {
              fontSize: standFontSize / 2
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
        // console.log(this.currentPage)
        this.currentPage++

        if (this.currentPage > 1) {
          this.currentPage = 0
        }

        this.updatePieGenerate()
      }, 5000)
    }
  }
}
</script>
<style lang="less" scoped></style>
