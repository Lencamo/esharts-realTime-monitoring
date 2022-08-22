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
  destroyed() {
    // 取消定时器 —— ① 组件销毁时
    clearInterval(this.timerId)
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
      this.chartInstance = this.$echarts.init(this.$refs.seller_ref)

      // 定时器 —— ② 鼠标监听事件
      this.chartInstance.on('mouseover', () => {
        clearInterval(this.timerId)
      })
      this.chartInstance.on('mouseout', () => {
        this.showChangeFn()
      })
    },

    // 获取图表数据
    async getBarData() {
      const { data: res } = await this.$http.get('/api/seller')
      // console.log(res)

      this.barData = res
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
    }
  }
}
</script>
<style lang=""></style>
