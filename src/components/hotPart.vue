<template>
  <div class="hotPart-container">
    <div class="chart-container" ref="hot_ref"></div>
  </div>
</template>
<script>
export default {
  mounted() {
    this.initChart()
    this.getPieData()

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
      pieData: []
    }
  },
  methods: {
    // 初始化ECharts对象
    initChart() {
      this.chartInstance = this.$echarts.init(this.$refs.hot_ref, 'chalk')

      const initOption = {
        // 标题配置
        title: {
          text: '▎热销商品销售金额占比统计',
          left: 20,
          top: 20,
          textStyle: {
            fontSize: 38
          }
        },

        series: [
          {
            type: 'pie'
          }
        ]
      }
      // 生成图表
      this.chartInstance.setOption(initOption)
    },

    // 获取图表数据
    async getPieData() {
      const { data: res } = await this.$http.get('/api/hotproduct')
      // console.log(res)

      this.pieData = res
      this.updateBarGenerate()

      // 数据处理✨
    },

    // 更新图表（option配置）
    updateBarGenerate() {
      // 数据处理✨
      // 1、饼图第一层数据
      const firstSeriesData = this.pieData[0].children.map((item) => {
        return {
          name: item.name,
          value: item.value
        }
      })
      // 2、图例数据
      const legendData = this.pieData[0].children.map((item) => {
        return item.name
      })

      // option配置
      const dataOption = {
        legend: {
          data: legendData
        },
        series: [
          {
            data: firstSeriesData
          }
        ]
      }
      // 生成图表
      this.chartInstance.setOption(dataOption)
    },

    // 监听window窗口大小变化
    screenAdapter() {
      // const standFontSize = (this.$refs.hot_ref.offsetWidth / 100) * 3.6

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
