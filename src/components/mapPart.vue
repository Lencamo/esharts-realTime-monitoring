<template>
  <div class="mapPart-container">
    <div class="chart-container" ref="map_ref"></div>
  </div>
</template>
<script>
import axios from 'axios'

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
    async initChart() {
      this.chartInstance = this.$echarts.init(this.$refs.map_ref, 'chalk')

      // 获取本地地图数据
      const ret = await axios.get('http://127.0.0.1:8080/static/map/china.json')
      // console.log(ret)
      // 注册地图
      this.$echarts.registerMap('chinaMap', ret.data)

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

        // 图例配置
        legend: {
          bottom: '5%',
          left: '5%',
          icon: 'circle',
          textStyle: {
            fontSize: 20
          },
          orient: 'vertical' // 竖直展示
        },

        // 地理坐标系配置
        geo: {
          type: 'map',
          map: 'chinaMap',
          top: '5%',
          bottom: '5%',
          itemStyle: {
            areaColor: '#2E72BF',
            borderColor: '#333'
          }
        }
      }
      // 生成图表
      this.chartInstance.setOption(initOption)
    },

    // 获取散点图数据
    async getMapData() {
      const { data: res } = await this.$http.get('/api/map')
      // console.log(res)

      this.mapData = res
      this.updateBarGenerate()

      // 数据处理✨
    },

    // 更新图表（option配置）
    updateBarGenerate() {
      // 数据处理✨
      // 1、散点图涟漪点数据
      const seriseArr = this.mapData.map((item) => {
        return {
          type: 'effectScatter',
          data: item.children,
          coordinateSystem: 'geo', // 与地图图表关联
          name: item.name, // 图例的各项名称
          rippleEffect: {
            scale: 5, // 设置涟漪动画的缩放比例
            brushType: 'stroke' // 空心涟漪效果
          }
        }
      })

      // 2、图例数据
      const legendArr = this.mapData.map((item) => {
        return item.name
      })

      // option配置
      const dataOption = {
        series: seriseArr,
        legend: {
          data: legendArr
        }
      }
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
