<template>
  <div class="user-point">
    <div class="point-wrapper">
      <u-image shape="circle" :lazy-load="true" width="100" height="100"
        :src="userInfo.face || '/static/missing-face.png'"></u-image>
      <div class="whether-point">
        <div class="point-label">{{ $t('points.available') }}</div>
        <div class="point-value">
          <span class="point">{{userInfo.point || 0}}</span>
          <text class="point-unit">{{ $t('points.myPoints') }}</text>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { getUserInfo } from "@/api/members";
export default {
  data() {
    return {
      userInfo: {},
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    async init() {
      let res = await getUserInfo();
      if (res.data.success) {
        this.userInfo = res.data.result;
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.user-point {
  padding: 20rpx;
  height: 180rpx;
  background: linear-gradient(135deg, rgba(#667eea, 0.8) 0%, rgba(#764ba2, 0.8) 100%), url("/static/point-bg.png") no-repeat;
  background-size: 100%;
  border-radius: 20rpx;
  margin: 20rpx;
}

.point-wrapper {
  display: flex;
  align-items: center;
  padding-top: 20rpx;
}

.whether-point {
  color: #fff;
  margin-left: 30rpx;
  flex: 1;
  
  .point-label {
    font-size: 26rpx;
    opacity: 0.9;
    margin-bottom: 8rpx;
  }
  
  .point-value {
    display: flex;
    align-items: baseline;
    
    .point {
      font-size: 48rpx;
      font-weight: bold;
      margin-right: 8rpx;
    }
    
    .point-unit {
      font-size: 24rpx;
      opacity: 0.8;
    }
  }
}
</style>