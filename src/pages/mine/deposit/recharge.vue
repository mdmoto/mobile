
<template>
  <view>
    <u-navbar :title="$t('deposit.recharge')" :is-back="true"></u-navbar>
    
    <view class="-list">
      <view class="title">{{ $t('deposit.rechargeAmount') }}</view>
      <view class="content">
        <view class="price">
          <span> ￥</span>
          <u-input v-model="price" :placeholder="$t('deposit.rechargeAmount')" type="number" />
					
        </view>

      </view>
    </view>

    <view class="submit" :class="{'light':flag}" @click="handlerRecharge">{{ $t('deposit.confirmRecharge') }}</view>
  </view>
</template>
<script>
import { recharge } from "@/api/members";
export default {
  data() {
    return {
      price: 0,
      flag: true,
    };
  },
  watch: {
    price(val) {
      val <= 0 ? (this.flag = true) : (this.flag = false);
    },
  },
  mounted() {},
  methods: {
    // 充值
    async handlerRecharge() {
      if (this.price > 0) {
       
        let res = await recharge({ price: this.price });
        if (res.data.success) {
          uni.navigateTo({
            url: `/pages/cart/payment/payOrder?orderType=RECHARGE&recharge_sn=${res.data.result.rechargeSn}`,
          });
        }
      }
    },
  },
};
</script>
<style lang="scss" scoped>
@import './style.scss';
</style>