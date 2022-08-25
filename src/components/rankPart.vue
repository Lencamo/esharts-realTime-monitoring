<template>
  <div class="rankPart-container">
    <div class="chart-container" ref="rank_ref"></div>
  </div>
</template>
<script>
export default {
  mounted() {
    this.initChart()
    this.getBarData()

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
      barData: []
    }
  },
  methods: {
    // 初始化ECharts对象
    initChart() {
      this.chartInstance = this.$echarts.init(this.$refs.rank_ref, 'chalk')

      const initOption = {
        // 标题配置
        title: {
          text: '▎地区销售排行',
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
          trigger: 'item'
        },

        xAxis: {
          type: 'category'
        },
        yAxis: {
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
    },

    // 获取图表数据
    async getBarData() {
      const { data: res } = await this.$http.get('/api/rank')
      // console.log(res)

      this.barData = res

      // 数据处理✨
      // 排序
      this.barData.sort((a, b) => {
        return b.value - a.value
      })

      this.updateBarGenerate()
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
        series: [
          {
            data: yValueArr,

            // 圆角和颜色渐变
            itemStyle: {
              barBorderRadius: [33, 33, 0, 0], // 官方文档找不到 😢
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
      // const standFontSize = (this.$refs.rank_ref.offsetWidth / 100) * 3.6

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
