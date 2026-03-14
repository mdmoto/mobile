<template>
  <view>
	
    <view class="nav-list">
      <view class="total">{{ $t('distribution.canWithdrawAmount') }}</view>
      <view class="price">{{ unitPrice(distributionData.canRebate, undefined, 'before') }}.<span style="font-size: 24rpx">{{ unitPrice(distributionData.canRebate, undefined, 'after') }}</span></view>
      <view class="frozen"
        >{{ $t('distribution.frozenAmount') }}{{ unitPrice(distributionData.commissionFrozen, undefined, 'before') }}.<span style="font-size: 24rpx">{{ unitPrice(distributionData.commissionFrozen, undefined, 'after') }}</span></view
      >
    </view>
    <view class="nav">
      <view class="nav-item">
        <u-icon
          size="50"
          @click="handleClick('/pages/mine/distribution/list?id='+distributionData.id+'&name='+distributionData.memberName)"
          color="#ff6b35"
          name="bag-fill"
        ></u-icon>
        <view>{{ $t('distribution.distributionGoods') }}</view>
      </view>
      <view
        class="nav-item"
        @click="handleClick(`/pages/mine/distribution/history?type=0&id=${distributionData.id}&name=${distributionData.memberName}`)"
      >
        <u-icon size="50" color="#ff6b35" name="order"></u-icon>
        <view>{{ $t('distribution.distributionPerformance') }}</view>
      </view>
      <view
        class="nav-item"
        @click="handleClick('/pages/mine/distribution/history?type=1')"
      >
        <u-icon size="50" color="#ff6b35" name="red-packet-fill"></u-icon>
        <view>{{ $t('distribution.withdrawalHistory') }}</view>
      </view>
      <view
        class="nav-item"
        @click="handleClick('/pages/mine/distribution/withdrawal')"
      >
        <u-icon size="50" color="#ffc71c" name="rmb-circle-fill"></u-icon>
        <view>{{ $t('distribution.withdraw') }}</view>
      </view>
  
     
    </view>

  </view>
</template>

<script>

import { distribution } from "@/api/goods";
export default {

  data() {
    return {
      distributionData: "",
    };
  },
  methods: {
    handleClick(url) {
      uni.navigateTo({
        url,
      });
    },
    queryGoods(src) {
      uni.navigateTo({
        url: `/pages/mine/distribution/${src}`,
      });
    },
    /**
     * 初始化推广商品
     */
    init() {
      uni.showLoading({
        title: this.$t("common.loading"),
      });
      distribution().then((res) => {
        if (res.data.result) {
          this.distributionData = res.data.result;
        }
         if (this.$store.state.isShowToast){ uni.hideLoading() };
      });
    },
  },
  onShow() {
    this.init();
  },
};
</script>

<style lang="scss" scoped>
.nav {
  background: #fff;
  align-items: center;
  display: flex;
  flex-wrap: wrap;
}
.nav-list {
  color: #fff;
  padding: 40rpx 0;
  background: linear-gradient(91deg, $light-color 1%, $aider-light-color 99%);
}
.total {
  padding: 10rpx 0;
  text-align: center;
  font-size: 28rpx;
  opacity: 0.8;
}
.frozen {
  text-align: center;
  font-size: 24rpx;
  opacity: 0.8;
}
.price {
  text-align: center;
  color: #fff;
  font-size: 50rpx;
}
.nav-item {
  height: 240rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  > * {
    margin: 10rpx 0;
  }
  width: 33%;
  //   color: #fff;
}
</style>
