<template>
  <div class="sellerPart-container">
    <div class="chart-container" ref="seller_ref"></div>
  </div>
</template>
<script>
export default {
  mounted() {
    this.initChart()
    this.getBarData()
  },
  data() {
    return {
      chartInstance: null, // 空对象
      barData: []
    }
  },
  methods: {
    // 初始化ECharts对象
    initChart() {
      this.chartInstance = this.$echarts.init(this.$refs.seller_ref)
    },
    // 获取图表数据
    async getBarData() {
      const { data: res } = await this.$http.get('/api/seller')
      // console.log(res)

      this.barData = res
      this.updateBarGenerate()
    },
    // 更新图表（option配置）
    updateBarGenerate() {
      // 数据处理✨
      const sellerNames = this.barData.map((item) => item.name)
      const sellerValues = this.barData.map((item) => item.value)

      // option配置
      const option = {
        xAxis: {
          type: 'value'
        },
        yAxis: {
          type: 'category',
          data: sellerNames
        },
        series: [
          {
            type: 'bar',
            data: sellerValues
          }
        ]
      }
      // 生成图表
      this.chartInstance.setOption(option)
    }
  }
}
</script>
<style lang=""></style>
