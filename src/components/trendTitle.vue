<template>
  <div>
    <div class="trendTitle" ref="trendTitle_ref" :style="fontSize">
      <!-- <span>▎销量趋势</span> -->
      <span>▎{{ showTitle }}</span>
      <span
        class="iconfont menu-icon"
        :style="fontSize"
        @click="$emit('change-status', !showStatus)"
        >&#xe665;</span
      >
      <div class="select" v-show="showStatus" :style="marginLeft">
        <div
          class="select-item"
          v-for="item in selectTypes"
          :key="item.key"
          @click="handleTypeSelet(item.key)"
        >
          {{ item.text }}
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'trendTitle',
  model: {
    prop: 'showStatus',
    event: 'change-status'
  },
  props: ['showStatus', 'standFontSize'],
  mounted() {
    this.getLineData()
  },
  data() {
    return {
      lineData: null,
      // isShow: this.$props.showStatus, // 下拉菜单显示和隐藏🚩标志
      choiceType: 'map' // 显示的哪种销售趋势图表（有map、seller、commodity三种销量趋势）
    }
  },
  computed: {
    // ✨根据选择展示数据
    selectTypes() {
      if (!this.lineData) {
        return []
      } else {
        // return this.lineData.type
        // 筛选优化
        return this.lineData.type.filter((item) => {
          return item.key !== this.choiceType
        })
      }
    },
    // ✨根据选择显示标题
    showTitle() {
      if (!this.lineData) {
        return []
      } else {
        return this.lineData[this.choiceType].title
      }
    },

    // 分辨率适配
    fontSize() {
      return {
        fontSize: this.standFontSize + 'px'
      }
    },
    marginLeft() {
      return {
        marginLeft: this.standFontSize / 2 + 'px'
      }
    }
  },
  methods: {
    // 获取图表数据
    async getLineData() {
      const { data: res } = await this.$http.get('/api/trend')
      // console.log(res) // 结果有map、seller、commodity三个销量趋势

      this.lineData = res
    },

    // 数据选择（下拉选择操作）
    handleTypeSelet(currentType) {
      this.choiceType = currentType

      // 子向父🎈传值
      this.$emit('showType', this.choiceType)
    }
  }
}
</script>
<style lang="less" scoped>
.trendTitle {
  background-color: #222733;
  position: absolute;
  left: 20px;
  top: 20px;
  font-size: 38px;
  color: white;
  z-index: 10;

  .menu-icon {
    margin-left: 10px;
    cursor: pointer;
    vertical-align: middle;
  }

  // 不采用固定的px大小
  // .select {
  //   margin-left: 20px;
  // }
}
</style>
