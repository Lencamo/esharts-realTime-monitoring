<template>
  <div class="stockPart-container">
    <div class="chart-container" ref="stock_ref"></div>
  </div>
</template>
<script>
export default {
  mounted() {
    this.initChart()
    this.getpieData()

    window.addEventListener('resize', this.screenAdapter)
    // 屏幕适配
    this.screenAdapter()
  },
  destroyed() {
    window.removeEventListener('resize', this.screenAdapter)
  },
  data() {
    return {
      chartInstance: null, // 空对象
      pieData: null
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
          top: 20,
          textStyle: {
            fontSize: 38
          }
        }
      }
      // 生成图表
      this.chartInstance.setOption(initOption)
    },

    // 获取图表数据
    async getpieData() {
      const { data: res } = await this.$http.get('/api/stock')
      console.log(res)

      this.pieData = res
      this.updatePieGenerate()

      // 数据处理✨
    },

    // 更新图表（option配置）
    updatePieGenerate() {
      // 数据处理✨
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
      const showData = this.pieData.slice(0, 5)

      const seriesArr = showData.map((item, index) => {
        return {
          type: 'pie',
          radius: [110, 100],
          center: centerArr[index],
          hoverAnimation: false, // 关闭鼠标移动到饼图时的动画效果
          labelLine: {
            show: false // 隐藏指示线
          },
          label: {
            position: 'center', // data下name值的位置
            color: colorArr[index][0],
            textStyle: {
              fontSize: 26
            }
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
      // const standFontSize = (this.$refs.stock_ref.offsetWidth / 100) * 3.6

      const adapterOption = {}
      // 生成图表
      this.chartInstance.setOption(adapterOption)

      // 手动的调用图表对象的resize 才能产生效果
      this.chartInstance.resize()
    }
  }
}
</script>
<style lang="less" scoped></style>
