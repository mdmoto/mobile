<template>
  <div class="wrapper">
    <div v-if="res && res.content" v-html="res.content" class="article-content"></div>
    <u-parse :show-with-animation="true" :lazy-load="true" :selectable="true" :content="res.content" v-else-if="res && res.content"></u-parse>
  </div>
</template>
<script>
import { getArticleDetailByType } from "@/api/article";
export default {
  data() {
    return {
      res: "",
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
    const typeMap = {
      'USER_AGREEMENT': 'auth.terms',
      'PRIVACY_POLICY': 'auth.privacy',
      'LICENSE_INFORMATION': 'user.licenseInfo',
      'ABOUT': 'user.about',
      'STORE_REGISTER': 'deposit.userAgreement', // or similar
      'REFUND_POLICY': 'user.refundPolicy',
      'SHIPPING_POLICY': 'user.shippingPolicy'
    };
    
    if (typeMap[option.type]) {
      uni.setNavigationBarTitle({
        title: this.$t(typeMap[option.type]),
      });
    }
    this.init(option);
  },

  methods: {
    async init(option) {
      try {
        const result = await getArticleDetailByType(this.way[option.type].type);
        if (result.data.success) {
          this.res = result.data.result;
        }
      } catch (error) {
        console.error('Failed to load article detail:', error);
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.wrapper {
  padding: 16rpx;
}
</style>