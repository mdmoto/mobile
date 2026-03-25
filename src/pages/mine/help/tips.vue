<template>
  <view class="wrapper">
    <view v-if="loading" class="state-text">{{ $t('common.loading') }}</view>
    <view v-else-if="errorMsg" class="state-text state-error">{{ errorMsg }}</view>
    <u-parse
      v-else-if="res && res.content"
      :show-with-animation="true"
      :lazy-load="true"
      :selectable="true"
      :content="res.content"
    />
    <view v-else class="state-text">{{ $t('common.noData') }}</view>
  </view>
</template>
<script>
import { getArticleDetailByType } from "@/api/article";
import api from "@/config/api.js";
export default {
  data() {
    return {
      res: null,
      loading: false,
      errorMsg: "",
      way: {
        USER_AGREEMENT: {
          title: "服务协议",
          type: "USER_AGREEMENT",
        },
        PRIVACY_POLICY: {
          title: "隐私政策",
          type: "PRIVACY_POLICY",
        },
        LICENSE_INFORMATION: {
          title: "证照信息",
          type: "LICENSE_INFORMATION",
        },
        ABOUT: {
          title: "关于我们",
          type: "ABOUT",
        },
        STORE_REGISTER: {
          title: "店铺入驻协议",
          type: "STORE_REGISTER",
        },
        REFUND_POLICY: {
          title: "退换货政策",
          type: "REFUND_POLICY",
        },
        SHIPPING_POLICY: {
          title: "配送政策",
          type: "SHIPPING_POLICY",
        },
      },
    };
  },
  mounted() {},
  onLoad(option) {
    this.errorMsg = "";
    const typeMap = {
      'USER_AGREEMENT': 'auth.terms',
      'PRIVACY_POLICY': 'auth.privacy',
      'LICENSE_INFORMATION': 'user.licenseInfo',
      'ABOUT': 'user.about',
      'STORE_REGISTER': 'auth.terms',
      'REFUND_POLICY': 'user.refundPolicy',
      'SHIPPING_POLICY': 'user.shippingPolicy'
    };
    
    if (option && option.type && typeMap[option.type]) {
      uni.setNavigationBarTitle({
        title: this.$t(typeMap[option.type]),
      });
    }
    this.init(option);
  },

  methods: {
    async init(option) {
      const type = option && option.type;
      if (!type || !this.way[type]) {
        this.errorMsg = "参数错误：缺少协议类型";
        return;
      }

      this.loading = true;
      this.res = null;
      try {
        // 先走 common-api（默认），如果为空则 fallback 到 buyer-api
        const primary = await getArticleDetailByType(this.way[type].type);
        if (primary && primary.data && primary.data.success && primary.data.result && primary.data.result.content) {
          this.res = primary.data.result;
          return;
        }

        const fallback = await getArticleDetailByType(this.way[type].type, api.buyer);
        if (fallback && fallback.data && fallback.data.success && fallback.data.result && fallback.data.result.content) {
          this.res = fallback.data.result;
          return;
        }

        this.errorMsg = "协议内容为空，请在后台文章管理中配置该类型内容";
      } catch (error) {
        console.error('Failed to load article detail:', error);
        this.errorMsg = "加载失败，请稍后再试";
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.wrapper {
  padding: 16rpx;
}

.state-text {
  padding: 40rpx 20rpx;
  text-align: center;
  color: #999;
  font-size: 28rpx;
  line-height: 44rpx;
}

.state-error {
  color: #ff5e00;
}
</style>
