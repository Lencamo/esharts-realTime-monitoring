<template>
  <div class="hotPart-container">
    <div class="chart-container" ref="hot_ref"></div>
    <!-- 后面两个字体图标必须放到后面🤔 -->
    <span class="iconfont left-arrow" @click="toLeft" :style="iconStyle"
      >&#xe61e;</span
    >
    <span class="iconfont right-arrow" @click="toRight" :style="iconStyle"
      >&#xe61f;</span
    >
    <span class="pieData-name" :style="iconStyle">{{ pieName }}</span>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import { getThemeValue } from '@/utils/theme_utils'

export default {
  computed: {
    // 使用vuex数据
    ...mapState(['theme']),

    pieName() {
      if (!this.pieData) {
        return ''
      } else {
        // bug 🚩 解决：前面我们把 pieData: []这样会导致报错，如下：
        //  Cannot read properties of undefined (reading 'getAttribute')
        //  Cannot read properties of undefined (reading 'name')
        return this.pieData[this.currentIndex].name
      }
    },
    // 字体图标大小控制
    iconStyle() {
      return {
        fontSize: this.standFontSize + 'px',

        // 主题切换时的样式变化（左右箭头）
        color: getThemeValue(this.theme).titleColor
      }
    }
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
    this.$socket.regCallback('hotData', this.getPieData)
  },
  mounted() {
    this.initChart()
    // this.getPieData()
    // 获取数据的地方改为发送数据（websocket的🚩方式获取数据）
    this.$socket.sendFn({
      action: 'getData',
      socketType: 'hotData',
      chartName: 'hotproduct',
      value: ''
    })

    window.addEventListener('resize', this.screenAdapter)
    // 屏幕适配
    this.screenAdapter()
  },
  destroyed() {
    window.removeEventListener('resize', this.screenAdapter)

    // 销毁回调函数
    this.$socket.unregCallback('hotData')
  },
  data() {
    return {
      chartInstance: null, // 空对象
      pieData: null,
      currentIndex: 0, // 要显示的哪部分的饼图数据
      standFontSize: 0
    }
  },
  methods: {
    // 初始化ECharts对象
    initChart() {
      this.chartInstance = this.$echarts.init(this.$refs.hot_ref, this.theme)

      const initOption = {
        // 标题配置
        title: {
          text: '▎热销商品销售金额占比统计',
          left: 20,
          top: 20
        },

        // 图例配置
        legend: {
          top: '20%',
          icon: 'circle'
        },

        // 提示框配置
        tooltip: {
          show: true,
          formatter: (arg) => {
            // console.log(arg)
            // return 'hh'

            const secondCategory = arg.data.childrenValue
            let total = 0
            secondCategory.forEach((item) => {
              total += item.value
            })
            let retStr = ''
            secondCategory.forEach((item) => {
              retStr += `
              ${item.name}&ensp;${parseInt((item.value / total) * 100) + '%'}
              <br/>
              `
            })
            return retStr
          }
        },

        series: [
          {
            type: 'pie',
            label: {
              show: false
            },
            emphasis: {
              label: {
                show: true
              },
              labelLine: {
                show: false
              }
            }
          }
        ]
      }
      // 生成图表
      this.chartInstance.setOption(initOption)
    },

    // 获取图表数据
    // async getPieData() {
    getPieData(ret) {
      // const { data: res } = await this.$http.get('/api/hotproduct')
      // console.log(res)

      this.pieData = ret
      this.updateBarGenerate()

      // 数据处理✨
    },

    // 更新图表（option配置）
    updateBarGenerate() {
      // 数据处理✨
      // 1、饼图第一层数据
      const firstSeriesData = this.pieData[this.currentIndex].children.map(
        (item) => {
          return {
            name: item.name,
            value: item.value,
            childrenValue: item.children
          }
        }
      )
      // 2、图例数据
      const legendData = this.pieData[this.currentIndex].children.map(
        (item) => {
          return item.name
        }
      )

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
      this.standFontSize = (this.$refs.hot_ref.offsetWidth / 100) * 3.6

      const adapterOption = {
        title: {
          textStyle: {
            fontSize: this.standFontSize
          }
        },
        legend: {
          itemWidth: this.standFontSize,
          itemHeight: this.standFontSize,
          itemGap: this.standFontSize
        },
        series: [
          {
            radius: this.standFontSize * 4.5,
            center: ['50%', '60%']
          }
        ]
      }
      // 生成图表
      this.chartInstance.setOption(adapterOption)

      // 手动的调用图表对象的resize 才能产生效果
      this.chartInstance.resize()
    },

    toLeft() {
      this.currentIndex--
      if (this.currentIndex < 0) {
        this.currentIndex = this.pieData.length - 1
      }
      this.updateBarGenerate()
    },

    toRight() {
      this.currentIndex++
      if (this.currentIndex > this.pieData.length - 1) {
        this.currentIndex = 0
      }
      this.updateBarGenerate()
    }
  }
}
</script>
<style lang="less" scoped>
.left-arrow,
.right-arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  color: white;
}

.left-arrow {
  left: 10%;
}

.right-arrow {
  right: 10%;
}

.pieData-name {
  position: absolute;
  left: 70%;
  bottom: 20px;
  color: white;
}
</style>
