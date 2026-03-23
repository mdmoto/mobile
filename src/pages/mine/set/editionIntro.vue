
<template>
  <view class="edition-intro">
    <image :src="config.logo" class="logo" />
    <h1> {{config.name}}</h1>
    <view class='version'>
      <!-- #ifdef APP-PLUS -->
      Version {{localVersion.version}}
      <!-- #endif -->
	  <!-- #ifdef MP-WEIXIN -->
	  {{ $t('user.miniVersion') }}: {{localVersion.version}}  {{ localVersion.envVersion}}
	  <!--  #endif -->
    </view>

    <!-- {{localVersion}} -->
    <u-cell-group class="cell" :border="false">
      <!--  #ifdef APP-PLUS -->
      <u-cell v-if="IosWhether" @click="checkStar" :title="$t('user.rateApp')"></u-cell>
      <u-cell :title="$t('user.functionDesc')" @click="navigateTo('/pages/mine/set/versionFunctionList')"></u-cell>
      <u-cell :title="$t('user.checkUpdate')" @click="checkUpdate"></u-cell>
      <!--  #endif -->
	 
      <u-cell :title="$t('user.licenseInfo')" @click="navigateTo('/pages/mine/help/tips?type=LICENSE_INFORMATION')"></u-cell>
      <u-cell :title="$t('user.legalNotice')" @click="navigateTo('/pages/mine/set/legalNotice')"></u-cell>
      <u-cell :title="$t('user.refundPolicy')" @click="navigateTo('/pages/mine/help/tips?type=REFUND_POLICY')"></u-cell>
      <u-cell :title="$t('user.shippingPolicy')" @click="navigateTo('/pages/mine/help/tips?type=SHIPPING_POLICY')"></u-cell>
      <u-cell :title="$t('auth.terms')" @click="navigateTo('/pages/mine/help/tips?type=USER_AGREEMENT')"></u-cell>
      <u-cell :title="$t('auth.privacy')" @click="navigateTo('/pages/mine/help/tips?type=PRIVACY_POLICY')"></u-cell>
      <u-cell :title="$t('user.about')" :border-bottom="false" @click="navigateTo('/pages/mine/help/about2')"></u-cell>

    </u-cell-group>

    <view class="intro" style="text-align: center;">
      <view>猫楽合同会社 (MAO MALL G.K.)</view>
      <view style="margin:10rpx 0;">{{config.customerServiceMobile ? `${$t('user.hotline')}：${config.customerServiceMobile}` :  ``}}</view>
      <view style="margin:10rpx 0;">{{config.customerServiceEmail ? `${$t('user.email')}：${config.customerServiceEmail}` :  ``}}</view>

      <view>
        <view style="margin:20rpx 0; color:#003a8c;" @click="navigateTo('/pages/mine/help/tips?type=PRIVACY_POLICY')">《{{config.name}}{{ $t('auth.privacy') }}》</view>
        <view>CopyRight ©{{config.name}} </view>
      </view>
    </view>
  </view>
</template>

<script>
import APPUpdate from "@/plugins/APPUpdate";
import config from "@/config/config";
import { getAppVersion } from "@/api/message.js";
export default {
  data() {
    return {
      config,
      IosWhether: false, //是否是ios
      editionHistory: [], //版本历史
      versionData: {}, //版本信息
      localVersion: "", //当前版本信息
      params: {
        pageNumber: 1,
        pageSize: 5,
      },
    };
  },
  onLoad() {
    // #ifdef APP-PLUS
    const platform = uni.getSystemInfoSync().platform;
    /**
     * 获取是否是安卓
     */
    if (platform === "android") {
      this.params.type = 0;
    } else {
      this.IosWhether = true;
      this.params.type = 1;
    }
    this.getVersion(platform);

    plus.runtime.getProperty(plus.runtime.appid, (inf) => {
      this.localVersion = {
        versionCode: inf.version.replace(/\./g, ""),
        version: inf.version,
      };
    });
    // #endif
	
	
	// #ifdef MP-WEIXIN
	const accountInfo = wx.getAccountInfoSync();
	console.log("===========accountInfo==============");
	console.log(accountInfo);
	this.version_number = accountInfo.miniProgram.version // 小程序 版本号
	this.localVersion = {
	  versionCode: accountInfo.miniProgram.version.replace(/\./g, ""),
	  version: accountInfo.miniProgram.version ,// 小程序 版本号,
	  envVersion:accountInfo.miniProgram.envVersion, //判断小程序是开发版本还是release版本
	};
	// #endif
  },

  methods: {
    async getVersion(platform) {
      const type = platform === "android" ? "ANDROID" : "IOS";
      try {
        const result = await getAppVersion(type);
        this.versionData = result;
      } catch (err) {
        console.error('Failed to get app version:', err);
      }
    },

    navigateTo(url) {
      if (url === "/pages/mine/help/about2") {
        // #ifdef H5
        window.open('https://about.maollar.com', '_blank');
        // #endif
        // #ifndef H5
        uni.navigateTo({
          url: '/pages/tabbar/home/web-view?url=' + encodeURIComponent('https://about.maollar.com')
        });
        // #endif
        return;
      }
      uni.navigateTo({
        url,
      });
    },

    /**
     * ios点击评分
     */
    checkStar() {
      plus.runtime.launchApplication({
        action: `itms-apps://itunes.apple.com/app/${config.iosAppId}?action=write-review`,
      });
    },

    /**
     * 检查更新
     */
    checkUpdate() {
      if (
        this.versionData.version.replace(/\./g, "") <
        this.localVersion.versionCode
      ) {
        APPUpdate();
      } else {
        uni.showToast({
          title: this.$t('user.latestVersion'),
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
page {
  background: #fff !important;
}
.cell {
  width: 90%;
  margin: 0 auto;
}
.edition-intro {
  min-height: 100vh;
  background: #fff;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  > h1 {
    margin: 20rpx 0 20rpx 0;
    letter-spacing: 2rpx;
  }
  > .version {
    font-size: 30rpx;
    margin-bottom: 100rpx;
  }
}
.intro {
  margin-top: 100rpx;
  font-size: 24rpx;
  letter-spacing: 2rpx;
}
.logo {
  width: 200rpx;
  height: 200rpx;
}
</style>
