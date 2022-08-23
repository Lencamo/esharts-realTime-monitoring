<template>
  <div class="trendPart-container">
    <div class="chart-container" ref="trend_ref"></div>
  </div>
</template>
<script>
export default {
  mounted() {
    this.initChart()
    this.getLineData()

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
      lineData: null // object
    }
  },
  methods: {
    // 初始化ECharts对象
    initChart() {
      this.chartInstance = this.$echarts.init(this.$refs.trend_ref, 'chalk')

      const initOption = {
        // 标题配置
        title: {
          text: '▎销量趋势',
          left: 20,
          top: 20,
          textStyle: {
            fontSize: 38
          }
        },
        // 坐标系配置
        grid: {
          top: '20%',
          left: '3%',
          right: '6%',
          bottom: '3%',
          containLabel: true // 包含坐标轴上的文字 🤔
        },
        // 提示框配置
        tooltip: {
          trigger: 'axis'
        },

        xAxis: {
          type: 'category'
        },
        yAxis: {
          type: 'value'
        }
      }
      // 生成图表
      this.chartInstance.setOption(initOption)
    },

    // 获取图表数据
    async getLineData() {
      const { data: res } = await this.$http.get('/api/trend')
      // console.log(res) // 结果有map、seller、commodity三个销量趋势

      this.lineData = res
      this.updateLineGenerate()

      // 数据处理✨
    },

    // 更新图表（option配置）
    updateLineGenerate() {
      // 数据处理✨
      // 1、x轴数据
      const xMonthArr = this.lineData.common.month
      // 2、y轴数据（以地区销量趋势为例）
      const mapDataArr = this.lineData.map.data
      const yLineSeriesArr = mapDataArr.map((item) => {
        return {
          // 返回折线图的series相关配置
          type: 'line',
          data: item.data
        }
      })

      // option配置
      const dataOption = {
        xAxis: {
          data: xMonthArr
        },
        series: yLineSeriesArr
      }
      // 生成图表
      this.chartInstance.setOption(dataOption)
    },

    // 监听window窗口大小变化
    screenAdapter() {
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
