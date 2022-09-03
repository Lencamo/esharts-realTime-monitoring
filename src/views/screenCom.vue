<template>
  <div class="screen-container">
    <!-- 一、头部区域 -->
    <header class="screen-header">
      <div>
        <img src="/static//img/header_border_dark.png" alt="" />
      </div>
      <span class="logo">
        <img src="/static/img/logo_dark.png" alt="" />
      </span>
      <span class="title">电商平台实时监控系统</span>
      <div class="title-right">
        <img src="/static/img/qiehuan_dark.png" class="qiehuan" />
        <span class="datetime">2049-01-01 00:00:00</span>
      </div>
    </header>

    <!-- 二、图表区域 -->
    <div class="screen-body">
      <!-- 1、左侧部分 -->
      <section class="screen-left">
        <!-- <div id="left-top" class="fullscreen"> -->
        <div
          id="left-top"
          :class="[fullScreenStatus.trend ? 'fullscreen' : '']"
        >
          <!-- 销量趋势图表 -->
          <trend-part></trend-part>
          <div class="resizeFont">
            <!-- <span class="iconfont">&#xe826;</span> -->
            <span
              :class="[
                'iconfont',
                fullScreenStatus.trend ? 'icon-compress-alt' : 'icon-expand-alt'
              ]"
            ></span>
          </div>
        </div>
        <div
          id="left-bottom"
          :class="[fullScreenStatus.seller ? 'fullscreen' : '']"
        >
          <!-- 商家销售金额图表 -->
          <seller-part></seller-part>
          <div class="resizeFont">
            <span
              :class="[
                'iconfont',
                fullScreenStatus.seller
                  ? 'icon-compress-alt'
                  : 'icon-expand-alt'
              ]"
            ></span>
          </div>
        </div>
      </section>

      <!-- 2、中间部分 -->
      <section class="screen-middle">
        <div
          id="middle-top"
          :class="[fullScreenStatus.map ? 'fullscreen' : '']"
        >
          <!-- 商家分布图表 -->
          <map-part></map-part>
          <div class="resizeFont">
            <span
              :class="[
                'iconfont',
                fullScreenStatus.map ? 'icon-compress-alt' : 'icon-expand-alt'
              ]"
            ></span>
          </div>
        </div>
        <div
          id="middle-bottom"
          :class="[fullScreenStatus.rank ? 'fullscreen' : '']"
        >
          <!-- 地区销量排行图表 -->
          <rank-part></rank-part>
          <div class="resizeFont">
            <span
              :class="[
                'iconfont',
                fullScreenStatus.rank ? 'icon-compress-alt' : 'icon-expand-alt'
              ]"
            ></span>
          </div>
        </div>
      </section>

      <!-- 3、右侧部分 -->
      <section class="screen-right">
        <div id="right-top" :class="[fullScreenStatus.hot ? 'fullscreen' : '']">
          <!-- 热销商品占比图表 -->
          <hot-part></hot-part>
          <div class="resizeFont">
            <span
              :class="[
                'iconfont',
                fullScreenStatus.hot ? 'icon-compress-alt' : 'icon-expand-alt'
              ]"
            ></span>
          </div>
        </div>
        <div
          id="right-bottom"
          :class="[fullScreenStatus.stock ? 'fullscreen' : '']"
        >
          <!-- 库存销量分析图表 -->
          <stock-part></stock-part>
          <div class="resizeFont">
            <span
              :class="[
                'iconfont',
                fullScreenStatus.stock ? 'icon-compress-alt' : 'icon-expand-alt'
              ]"
            ></span>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import SellerPart from '@/components/sellerPart.vue'
import MapPart from '@/components/mapPart.vue'
import RankPart from '@/components/rankPart.vue'
import HotPart from '@/components/hotPart.vue'
import StockPart from '@/components/stockPart.vue'
import TrendPart from '@/components/trendPart.vue'

export default {
  data() {
    return {
      fullScreenStatus: {
        seller: false,
        map: false,
        rank: false,
        hot: false,
        stock: false,
        trend: false
      }
    }
  },
  components: {
    SellerPart,
    MapPart,
    RankPart,
    HotPart,
    StockPart,
    TrendPart
  }
}
</script>

<style lang="less" scoped>
.screen-container {
  width: 100%;
  height: 100%;
  padding: 0 20px;
  background-color: #161522;
  color: #fff;
  box-sizing: border-box;
}

// 使用class样式🚩实现全屏展示
.fullscreen {
  position: fixed !important;
  top: 0 !important;
  left: 0 !important;
  width: 100% !important;
  height: 100% !important;
  margin: 0 !important;
  z-index: 100;
}

// 头部区域样式
.screen-header {
  width: 100%;
  height: 64px;
  font-size: 20px;
  position: relative;
  > div {
    img {
      width: 100%;
    }
  }
  .title {
    position: absolute;
    left: 50%;
    top: 50%;
    font-size: 20px;
    transform: translate(-50%, -50%);
  }
  .title-right {
    display: flex;
    align-items: center;
    position: absolute;
    right: 0px;
    top: 50%;
    transform: translateY(-80%);
  }
  .qiehuan {
    width: 28px;
    height: 21px;
    cursor: pointer;
  }
  .datetime {
    font-size: 15px;
    margin-left: 10px;
  }
  .logo {
    position: absolute;
    left: 0px;
    top: 50%;
    transform: translateY(-80%);
    img {
      height: 35px;
      width: 128px;
    }
  }
}

// 图表区域样式
.screen-body {
  width: 100%;
  height: 100%;
  display: flex;
  margin-top: 10px;
  .screen-left {
    height: 100%;
    width: 27.6%;
    #left-top {
      height: 53%;
      position: relative;
    }
    #left-bottom {
      height: 31%;
      margin-top: 25px;
      position: relative;
    }
  }
  .screen-middle {
    height: 100%;
    width: 41.5%;
    margin-left: 1.6%;
    margin-right: 1.6%;
    #middle-top {
      width: 100%;
      height: 56%;
      position: relative;
    }
    #middle-bottom {
      margin-top: 25px;
      width: 100%;
      height: 28%;
      position: relative;
    }
  }
  .screen-right {
    height: 100%;
    width: 27.6%;
    #right-top {
      height: 46%;
      position: relative;
    }
    #right-bottom {
      height: 38%;
      margin-top: 25px;
      position: relative;
    }
  }
}

// 组件区域划分线条
// section > div {
//   border: 1px solid skyblue;
// }

// 全屏切换图标
.resizeFont {
  position: absolute;
  right: 20px;
  top: 20px;
  cursor: pointer;
}
</style>
