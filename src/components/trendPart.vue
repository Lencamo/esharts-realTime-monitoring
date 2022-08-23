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
          top: '25%',
          left: '3%',
          right: '6%',
          bottom: '3%',
          containLabel: true // 包含坐标轴上的文字 🤔
        },
        // 提示框配置
        tooltip: {
          trigger: 'axis'
        },

        // 图例配置
        legend: {
          top: '15%',
          left: 20,
          icon: 'circle',
          textStyle: {
            fontSize: 20
          }
        },

        xAxis: {
          type: 'category',
          boundaryGap: false
        },
        yAxis: {
          type: 'value',
          scale: true
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
      // 渐变颜色准备
      const colorArr1 = [
        'rgba(11, 168, 44, 0.5)',
        'rgba(44, 110, 255, 0.5)',
        'rgba(22, 242, 217, 0.5)',
        'rgba(254, 33, 30, 0.5)',
        'rgba(250, 105, 0, 0.5)'
      ]
      // 全透明的颜色值
      const colorArr2 = [
        'rgba(11, 168, 44, 0)',
        'rgba(44, 110, 255, 0)',
        'rgba(22, 242, 217, 0)',
        'rgba(254, 33, 30, 0)',
        'rgba(250, 105, 0, 0)'
      ]

      // 数据处理✨
      // 1、x轴数据
      const xMonthArr = this.lineData.common.month
      // 2、y轴数据（以地区销量趋势为例）
      const mapDataArr = this.lineData.map.data
      const yLineSeriesArr = mapDataArr.map((item, index) => {
        return {
          // 返回折线图的series相关配置
          type: 'line',
          data: item.data,
          stack: 'mapLine', // 使用堆叠图显示
          name: item.name,
          areaStyle: {
            // 颜色渐变(根据透明度)
            color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
              // 百分之0状态之下的颜色值
              {
                offset: 0,
                color: colorArr1[index]
              },
              // 百分之100状态之下的颜色值
              {
                offset: 1,
                color: colorArr2[index]
              }
            ])
          } // 颜色填充
        }
      })
      // 3、图例数据
      const legendArr = mapDataArr.map((item) => item.name)
      console.log(legendArr)

      // option配置
      const dataOption = {
        // 图例配置
        legend: {
          data: legendArr
        },

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
