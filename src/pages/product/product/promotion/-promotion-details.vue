<template>
  <view class="wrapper" v-if="res">
    <view v-for="(prom, index) in Object.keys(res)" :key="index">
      <view>
        <view v-if="prom.split('-')[0] == 'FULL_DISCOUNT'">
          <div class="res_prom_item" v-if="res[prom].fullMinus">
            <u-tag :text="$t('promotion.fullMinus')" type="error"></u-tag>
            <!-- TODO 后续将优化为可点击的商品以及优惠券显示明细 -->
            <span class="pro-text"
              >{{ $t('promotion.buyNowWithDirectDiscount', {money: unitPrice(res[prom].fullMoney)}) }}
              <span class="price">{{ unitPrice(res[prom].fullMinus) }}</span>
              <span v-if="res[prom].couponFlag"> {{ $t('promotion.give') }}<span>{{ $t('promotion.coupon') }}</span></span>
              <span v-if="res[prom].pointFlag"> {{ $t('promotion.give') }}{{ res[prom].point }}{{ $t('points.points') }}</span>
              <span v-if="res[prom].giftFlag"> {{ $t('promotion.give') }}{{ $t('promotion.gift') }}</span>
              <span v-if="res[prom].freeFreightFlag">{{ $t('promotion.give') }}{{ $t('promotion.freeFreight') }}</span>
            </span>
          </div>
          <div class="res_prom_item" v-if="res[prom].fullRate && res[prom].fullRateFlag">
            <u-tag :text="$t('promotion.discount')" type="error"></u-tag>
            <span class="pro-text"
              >满{{ unitPrice(res[prom].fullMoney) }}，{{ $t('promotion.getDiscount') }}<span class="price"
                >{{ res[prom].fullRate }}折</span
              >优惠</span
            >
          </div>
        </view>

        <view v-if="prom.split('-')[0] == 'PINTUAN'">
          <div class="res_prom_item" v-if="res[prom].requiredNum">
            <u-tag :text="$t('promotion.joinGroup')" type="error"></u-tag>
            <span class="pro-text"
              >{{ $t('promotion.pintuanPeople', {num: res[prom].requiredNum}) }} {{ $t('promotion.limitBuy', {num: res[prom].limitNum}) }}</span
            >
          </div>
        </view>

        <view v-if="prom.split('-')[0] == 'SECKILL'">
          <div class="res_prom_item">
            <u-tag :text="$t('promotion.seckill')" type="error"></u-tag>
            <span class="pro-text">{{ $t('promotion.seckill') }}</span>
          </div>
        </view>

        <view v-if="prom.split('-')[0] == 'POINTS_GOODS'">
          <div class="res_prom_item">
            <u-tag :text="$t('points.pointsActivities')" type="error"></u-tag>
            <span class="pro-text">{{ $t('promotion.participatingInPointsActivities') }}<span @click="handClickToJoinPromotion(prom)" class="href">{{ $t('promotion.clickToJoin') }}</span></span>
          </div>
        </view>

         <view v-if="prom.split('-')[0] == 'KANJIA'">
          <div class="res_prom_item">
            <u-tag :text="$t('promotion.bargainActivities')" type="error"></u-tag>
            <span class="pro-text">{{ $t('promotion.participatingInBargainActivities') }}<span @click="handClickToJoinPromotion(prom)" class="href">{{ $t('promotion.clickToJoin') }}</span></span>
          </div>
        </view>
      </view>
    </view>
    <view v-if="!res">{{ $t('promotion.noPromotion') }}</view>
  </view>
</template>
<script>
export default {
  data() {
    return {};
  },
  watch: {
    res: {
      handler() {
        if (this.res && this.res.length != 0) {
          Object.keys(this.res).forEach((item) => {
            if (item != "COUPON") {
              let key = item.split("-")[0];
              this.res[item]._key = key;
            }
          });
        }
      },

      immediate: true,
    },
  },

  props: {
    // 父组件传递回来的数据
    res: {
      type: null,
      default: "",
    },
  },
  mounted() {},
  methods: {
    // 跳转到参与商品活动的详情列表中
    handClickToJoinPromotion(val){
    
      const promotion = {
        "POINTS_GOODS": `/pages/promotion/point/detail?id=${this.res[val].id}`,
        "KANJIA": `/pages/promotion/bargain/detail?id=${this.res[val].id}`,
      }

      uni.navigateTo({
        url:promotion[val.split('-')[0]]
      })

    }
  },
};
</script>
<style lang="scss" scoped>
.pro-text {
  font-size: 26rpx;
  font-family: PingFang SC, PingFang SC-Regular;
  font-weight: 400;
  text-align: left;
  color: #333333;
  margin-left: 20rpx;
  > span {
    margin-right: 15rpx;
  }
}

.wrapper {
  display: block;
}

::v-deep  .u-mode-light-error {
  border: none;
}

.res_prom_item {
  margin: 20rpx 0;
}

.price_image {
  display: block;
}
.href{
  color: $main-color;
}
</style>
