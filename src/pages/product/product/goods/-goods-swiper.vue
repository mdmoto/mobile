<template>
  <!-- 轮播图 -->
  <view class="carousel" dir="ltr">

    <swiper :circular="true" :indicator-dots="false" duration="400" @change="swiperChange" v-if="res && res.length > 0"
      style="touch-action: pan-y;">
      <swiper-item v-if='video'>
        <view class="video-container" style="width:100%; height:100%;">
          <!-- #ifndef APP-PLUS -->
          <video class="video" show-mute-btn style="width:100%; height:100%;" muted autoplay :src='video' loop
            object-fit="cover"></video>
          <!-- #endif -->
          <!-- #ifdef APP-PLUS -->
          <view v-html="html" style="width:100%; height:100%;"></view>
          <!-- #endif -->
        </view>

      </swiper-item>
      <swiper-item class="swiper-item" v-for="(item, index) in res" :key="index">

        <view class="image-wrapper">
          <u-image :src="item" mode="aspectFit" class="loaded" width="100%" height="100%" :lazy-load="true">
            <template #loading><u-loading-icon></u-loading-icon></template>
          </u-image>
        </view>
      </swiper-item>
    </swiper>
    <view class="swiper-dots" v-if="res && res.length > 0">{{ current }}/{{ video ? res.length + 1 : res.length }}</view>
  </view>
</template>
<script>
export default {
  data() {
    return {
      current: 1,
      html: ""
    };
  },
  props: ["res", 'video'],
  watch: {
    video(val) {
      this.html = '<video muted="muted"   ref="videoPlay" style="width:100%; height:100%;" src=' + val + '  page-gesture show-mute-btn   autoplay  webkit-playsinline="" playsinline="" ></video>'
    }
  },
  methods: {
    // 轮播图对应的dot
    swiperChange(e) {
      this.current = e.detail.current + 1;
    },
  },
  mounted() {
  }
};
</script>
<style lang="scss" scoped>
.carousel {
  // #ifdef MP-WEIXIN
  margin-top: 44px;
  // #endif
  width: 750rpx;
  height: 750rpx;
  position: relative;

  swiper {
    height: 100%;
  }

  .image-wrapper {
    width: 100%;
    height: 100%;
  }

  .swiper-item {
    display: flex;
    justify-content: center;
    align-content: center;
    height: 750rpx;
    overflow: hidden;

    image {
      width: 100%;
      height: 100%;
    }
  }

  position: relative;

  .swiper-dots {
    position: absolute;
    right: 0rpx;
    bottom: 40rpx;
    font-size: 32rpx;
    width: 107rpx;
    height: 44rpx;
    line-height: 44rpx;
    text-align: center;
    border-radius: 30rpx 0rpx 0rpx 30rpx;
    background: #333333;
    opacity: 0.4;
    font-weight: 400;
    color: #fff;
  }
}

::v-deep  .image-wrapper image {
  opacity: 1 !important;
}

.video {
  width: 100%;
  height: 100%;
}
</style>
