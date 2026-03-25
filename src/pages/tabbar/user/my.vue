<template>
  <view class="user">
    <!-- ✅ 移除独立 status_bar view，改由 header 内 padding-top 统一处理，消除白色遮挡 -->
    <view class="header" @click="userDetail">
      <view class="head-1">
        <image :src="userInfo.face || userImage"></image>
      </view>
      <view class="head-2" v-if="userInfo.id">
        <view class="user-name">{{ userInfo.nickName }}</view>
      </view>
      <view class="head-2" v-else>
        <view class="user-name">{{ $t('user.login') }}/{{ $t('user.register') }}</view>
      </view>
      <!-- ✅ 修正箭头对齐：align-items: center 统一对齐，移除 align-items: flex-start -->
      <u-icon class="header-arrow" name="arrow-right"></u-icon>
    </view>

    <!-- 猫币，预存款，优惠券 -->
    <div class="pointBox box">
      <u-row text-align="center" gutter="16" class="point">
        <u-col text-align="center" span="3" @click="navigateTo('/pages/mine/point/myPoint')">
          <view>{{ $t('user.points') }}</view>
          <view class="value-text">{{ userInfo.point || 0 }}</view>
        </u-col>

        <u-col text-align="center" span="3" @click="navigateTo('/pages/mine/deposit/operation')">
          <view>{{ $t('user.wallet') }}</view>
          <view class="money">
            {{ unitPrice(walletNum, undefined, 'before') }}.<span class="price-decimal">{{ unitPrice(walletNum, undefined, 'after') }}</span>
          </view>
        </u-col>

        <u-col text-align="center" span="3" @click="navigateTo('/pages/cart/coupon/myCoupon')">
          <view>{{ $t('user.coupon') }}</view>
          <view class="value-text">{{ couponNum || 0 }}</view>
        </u-col>

        <u-col text-align="center" span="3" @click="navigateTo('/pages/mine/myTracks')">
          <view>{{ $t('user.footprint') }}</view>
          <view class="value-text">{{ footNum || 0 }}</view>
        </u-col>
      </u-row>
      <!-- 我的订单 -->
      <view class="order">
        <view class="order-item" @click="navigateTo('/pages/order/myOrder?status=1')">
          <div class="bag bag2">
            <u-icon name="bag-fill" size="35" color="#fff"></u-icon>
          </div>
          <view>{{ $t('order.waitPay') }}</view>
        </view>
        <view class="order-item" @click="navigateTo('/pages/order/myOrder?status=3')">
          <div class="bag bag3">
            <u-icon name="car-fill" size="35" color="#fff"></u-icon>
          </div>
          <view>{{ $t('order.waitReceive') }}</view>
        </view>
        <view class="order-item" @click="navigateTo('/pages/order/evaluate/myEvaluate')">
          <div class="bag bag4">
            <u-icon name="star-fill" size="35" color="#fff"></u-icon>
          </div>
          <view>{{ $t('order.waitComment') }}</view>
        </view>
        <view class="order-item" @click="navigateTo('/pages/order/afterSales/afterSales')">
          <div class="bag bag5">
            <u-icon name="server-fill" size="35" color="#fff"></u-icon>
          </div>
          <view>{{ $t('order.afterSale') }}</view>
        </view>
        <view class="order-item" @click="navigateTo('/pages/order/myOrder?status=0')">
          <div class="bag bag1">
            <u-icon name="order" size="35" color="#fff"></u-icon>
          </div>
          <view>{{ $t('order.myOrder') }}</view>
        </view>
      </view>
    </div>
    <!-- 常用工具 -->
    <tool />
  </view>
</template>

<script>
import tool from "@/pages/tabbar/user/utils/tool.vue";
import { getCouponsNum, getFootprintNum } from "@/api/members.js";
import { getUserWallet } from "@/api/members";
import configs from '@/config/config'
import storage from "@/utils/storage.js";

export default {
  components: { tool },
  data() {
    return {
      configs,
      userImage: configs.defaultUserPhoto,
      userInfo: {},
      couponNum: "",
      footNum: "",
      walletNum: "",
    };
  },
  onLoad() {},
  onShow() {
    this.userInfo = this.$filters.isLogin() || {};
    if (this.$filters.isLogin("auth")) {
      this.getUserOrderNum();
    } else {
      this.walletNum = 0;
      this.couponNum = 0;
      this.footNum = 0;
    }
  },
  onPullDownRefresh() {
    this.getUserOrderNum();
    this.userInfo = this.$filters.isLogin();
  },
  // #ifndef MP
  onNavigationBarButtonTap(e) {
    if (e.index === 0) {
      this.navigateTo("/pages/mine/set/setUp");
    }
  },
  // #endif
  mounted() {},
  methods: {
    navigateTo(url) {
      uni.navigateTo({ url });
    },
    userDetail() {
      this.userInfo.id
        ? this.navigateTo("/pages/mine/set/personMsg")
        : this.navigateToLogin();
    },
    async getUserOrderNum() {
      uni.stopPullDownRefresh();
      Promise.all([
        getCouponsNum(),
        getFootprintNum(),
        getUserWallet(),
      ]).then((res) => {
        this.couponNum = res[0].data.result;
        this.footNum = res[1].data.result;
        this.walletNum = res[2].data.result.memberWallet;
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.money {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* ✅ 统一价格小数位字号 */
.price-decimal {
  font-size: $font-sm;
}

.user {
  .header {
    /*
     * ✅ 关键修复：
     * 1. 移除独立 status_bar view，改用 padding-top 内嵌状态栏高度
     *    原来 status_bar + header padding-top 双重叠加导致顶部出现白色间隙
     * 2. align-items: center 让头像、文字、箭头三者垂直居中对齐
     */
    padding: var(--status-bar-height) 30rpx 40rpx 30rpx;
    padding-top: calc(var(--status-bar-height) + 40rpx);
    min-height: 320rpx;
    background-size: cover;
    border-bottom-left-radius: 30rpx;
    border-bottom-right-radius: 30rpx;
    background-image: url("/static/img/main-bg.png");
    background-position: center;
    background-repeat: no-repeat;
    color: #ffffff;
    display: flex;
    align-items: center;        /* ✅ 垂直居中对齐 */
    justify-content: flex-start;
    gap: 24rpx;

    .head-1 {
      flex-shrink: 0;
      width: 120rpx;
      height: 120rpx;

      image {
        width: 120rpx;         /* ✅ 缩小头像，与图二设置页保持一致视觉比例 */
        height: 120rpx;
        border-radius: 50%;
        border: 3px solid rgba(255,255,255,0.9);
        display: block;
      }
    }

    .head-2 {
      flex: 1;
      min-width: 0;           /* flex 子项允许收缩 */
    }

    /* ✅ 箭头垂直居中，不再 flex-start */
    .header-arrow {
      flex-shrink: 0;
    }
  }

  .pointBox {
    width: 94%;
    margin: 0 3%;
    background: #fff;
    border-radius: 20rpx;
    box-shadow: 0 4rpx 24rpx 0 rgba(#f6f6f6, 1);
  }

  .point {
    text-align: center;
    height: 160rpx;
    font-size: $font-sm;
    padding: 24rpx;

    .u-col {
      view {
        color: #333;
        font-size: 26rpx;
      }
      view:last-child {
        margin-top: 10rpx;
        color: #ff3c2a;
        font-size: 32rpx;
        font-weight: bold;
      }
      .value-text {
        margin-top: 10rpx;
        color: #ff3c2a;
        font-size: 32rpx;
        font-weight: bold;
      }
    }
  }

  .order {
    min-height: 140rpx;
    padding: 30rpx 3% 30rpx 3%;
    text-align: center;
    font-size: $font-sm;
    display: flex;
    justify-content: space-around;
    align-items: flex-start;
    color: #999;

    .order-item {
      position: relative;
      line-height: 1.2;
      width: 20%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: flex-start;
      word-break: break-word;

      :first-child {
        font-size: 48rpx;
        margin-bottom: 10rpx;
      }
      view:last-child {
        margin-top: 8rpx;
        padding: 0 4rpx;
      }
    }
  }
}

/* ✅ 卡片上移，与头像区重叠，保持视觉连续感 */
.box {
  transform: translateY(-20rpx);
}

.user-name {
  font-size: 34rpx;
  font-weight: 500;
}

.bag {
  width: 56rpx;
  height: 56rpx;
  border-radius: 50%;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
}
.bag1 { background: #ff4a48; }
.bag2 { background: #ff992f; }
.bag3 { background: #009ee0; }
.bag4 { background: #00d5d5; }
.bag5 { background: #28ccb0; }
</style>
