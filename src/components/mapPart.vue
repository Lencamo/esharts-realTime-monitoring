<template>
  <div class="mapPart-container">
    <div class="chart-container" ref="map_ref"></div>
  </div>
</template>
<script>
export default {
  mounted() {
    this.initChart()
    this.getMapData()

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
      mapData: []
    }
  },
  methods: {
    // 初始化ECharts对象
    initChart() {
      this.chartInstance = this.$echarts.init(this.$refs.map_ref, 'chalk')

      const initOption = {
        // 标题配置
        title: {
          text: '▎商家分布模块',
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
        }
      }
      // 生成图表
      this.chartInstance.setOption(initOption)
    },

    // 获取图表数据
    async getMapData() {
      const { data: res } = await this.$http.get('/api/seller')
      // console.log(res)

      this.mapData = res
      this.updateBarGenerate()

      // 数据处理✨
    },

    // 更新图表（option配置）
    updateBarGenerate() {
      // 数据处理✨

      // option配置
      const dataOption = {}
      // 生成图表
      this.chartInstance.setOption(dataOption)
    },

    // 监听window窗口大小变化
    screenAdapter() {
      // const standFontSize = (this.$refs.map_ref.offsetWidth / 100) * 3.6

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
