<template>
  <view class="container">
    <!-- ✅ 头像缩小：原来 width=140 height="140" 渲染约 140px，在 H5 下偏大 -->
    <!-- 改为 width="100rpx" height="100rpx"，与 my.vue 头像视觉一致 -->
    <view class="person" @click="checkUserInfo()">
      <u-image width="100rpx" height="100rpx" shape="circle" :src="userInfo.face || userImage" mode="aspectFill">
      </u-image>
      <view class="user-name">
        {{ userInfo.id ? userInfo.nickName || '' : $t('user.notLoggedIn') }}
      </view>
      <u-icon color="#ccc" name="arrow-right"></u-icon>
    </view>

    <!-- #ifdef MP-WEIXIN -->
    <view style="height: 20rpx; width: 100%"></view>
    <!-- #endif -->

    <u-cell-group :border="false">
      <!-- 语言设置 -->
      <u-cell
        :title="$t('user.language')"
        :arrow="true"
        @click="showLanguagePicker = true"
      >
        <template #value>
          <view class="current-lang">
            <text class="lang-flag">{{ currentLangFlag }}</text>
            <text class="lang-name">{{ currentLangName }}</text>
          </view>
        </template>
      </u-cell>

      <!-- 货币设置 -->
      <u-cell
        :title="$t('user.currencyCurrency') || '币种设置'"
        :arrow="true"
        @click="showCurrencyPicker = true"
      >
        <template #value>
          <view class="current-lang">
            <text class="lang-name">{{ currentCurrency }}</text>
          </view>
        </template>
      </u-cell>

      <!-- #ifdef APP-PLUS -->
      <u-cell :title="$t('user.clearCache')" :value="fileSizeString" @click="clearCache"></u-cell>
      <!-- #endif -->
      <!-- #ifndef MP-WEIXIN -->
      <u-cell :title="$t('user.securityCenter')" @click="navigateTo('/pages/mine/set/securityCenter/securityCenter')"></u-cell>
      <!-- #endif -->
      <u-cell :title="$t('user.userLogoff')" v-if="userInfo.id" @click="logoff"></u-cell>
      <u-cell :title="$t('user.feedback')" @click="navigateTo('/pages/mine/set/feedBack')"></u-cell>
      <u-cell :title="$t('user.aboutApp', {name: config.name})" @click="navigateTo('/pages/mine/set/editionIntro')"></u-cell>
    </u-cell-group>

    <!-- 语言选择器 -->
    <u-picker
      :show="showLanguagePicker"
      :columns="[languageList]"
      keyName="name"
      :defaultIndex="[currentLangIndex >= 0 ? currentLangIndex : 0]"
      @confirm="changeLanguage"
      @cancel="showLanguagePicker = false"
      @close="showLanguagePicker = false"
    ></u-picker>

    <!-- 货币选择器 -->
    <u-picker
      :show="showCurrencyPicker"
      :columns="[currencyList]"
      keyName="name"
      :defaultIndex="[currentCurrencyIndex >= 0 ? currentCurrencyIndex : 0]"
      @confirm="changeCurrency"
      @cancel="showCurrencyPicker = false"
      @close="showCurrencyPicker = false"
    ></u-picker>

    <view class="submit" v-if="userInfo.id" @click="quiteLoginOut">{{ $t('user.logout') }}</view>
  </view>
</template>

<script>
import config from "@/config/config";
import { setLanguage, getCurrentLanguage, getLanguageList } from '@/lang';
import storage from "@/utils/storage";

export default {
  data() {
    return {
      config,
      userImage: config.defaultUserPhoto,
      isCertificate: false,
      userInfo: {},
      fileSizeString: "0B",
      showLanguagePicker: false,
      languageList: getLanguageList(),
      showCurrencyPicker: false,
      currencyList: this.$filters.getCurrencyList().map(item => ({
        name: item.name,
        code: item.code
      }))
    };
  },

  computed: {
    currentLang() { return getCurrentLanguage(); },
    currentLangIndex() { return this.languageList.findIndex(lang => lang.code === this.currentLang); },
    currentLangName() {
      const lang = this.languageList.find(lang => lang.code === this.currentLang);
      return lang ? lang.name : '简体中文';
    },
    currentLangFlag() {
      const lang = this.languageList.find(lang => lang.code === this.currentLang);
      return lang ? lang.flag : '🇨🇳';
    },
    currentCurrency() { return storage.getCurrency(); },
    currentCurrencyIndex() { return this.currencyList.findIndex(item => item.code === this.currentCurrency); }
  },

  methods: {
    changeLanguage(e) {
      this.showLanguagePicker = false;
      const selectedLang = this.languageList[e.indexs[0]];
      if (!selectedLang || selectedLang.code === this.currentLang) return;
      setLanguage(selectedLang.code);
      uni.showToast({ title: this.$t('message.operationSuccess'), icon: 'success' });
      setTimeout(() => { uni.reLaunch({ url: '/pages/mine/set/setUp' }); }, 1000);
    },
    changeCurrency(e) {
      this.showCurrencyPicker = false;
      const selected = this.currencyList[e.indexs[0]];
      if (!selected || selected.code === this.currentCurrency) return;
      storage.setCurrency(selected.code);
      uni.showToast({ title: this.$t('message.operationSuccess'), icon: 'success' });
      setTimeout(() => { uni.reLaunch({ url: '/pages/mine/set/setUp' }); }, 1000);
    },
    navigateTo(url) {
      uni.navigateTo({ url });
    },
    quiteLoginOut() { this.$filters.quiteLoginOut(); },
    logoff() { this.$filters.logoff(); },
    checkUserInfo() {
      if (this.isLogin("auth")) {
        this.navigateTo("/pages/mine/set/personMsg");
      } else {
        this.tipsToLogin();
      }
    },
    getCacheSize() {
      let that = this;
      plus.cache.calculate(function (size) {
        let sizeCache = parseInt(size);
        if (sizeCache === 0) that.fileSizeString = "0B";
        else if (sizeCache < 1024) that.fileSizeString = sizeCache + "B";
        else if (sizeCache < 1048576) that.fileSizeString = (sizeCache / 1024).toFixed(2) + "KB";
        else if (sizeCache < 1073741824) that.fileSizeString = (sizeCache / 1048576).toFixed(2) + "MB";
        else that.fileSizeString = (sizeCache / 1073741824).toFixed(2) + "GB";
      });
    },
    clearCache() {
      let that = this;
      let os = plus.os.name;
      if (os === "Android") {
        let main = plus.android.runtimeMainActivity();
        let sdRoot = main.getCacheDir();
        let files = plus.android.invoke(sdRoot, "listFiles");
        for (let i = 0; i < files.length; i++) {
          let filePath = "" + files[i];
          plus.io.resolveLocalFileSystemURL(filePath, function (entry) {
            if (entry.isDirectory) {
              entry.removeRecursively(function () {
                uni.showToast({ title: '缓存已清理', duration: 2000, icon: "none" });
                that.getCacheSize();
              }, function () {});
            } else { entry.remove(); }
          }, function () {
            uni.showToast({ title: '路径读取失败', duration: 2000, icon: "none" });
          });
        }
      } else {
        plus.cache.clear(function () {
          uni.showToast({ title: '缓存已清理', duration: 2000, icon: "none" });
          that.getCacheSize();
        });
      }
    },
  },
  onShow() {
    this.userInfo = this.isLogin();
    // #ifdef APP-PLUS
    this.getCacheSize();
    // #endif
  },
};
</script>

<style lang="scss" scoped>
.current-lang {
  display: flex;
  align-items: center;
  gap: 8rpx;
  .lang-flag { font-size: 36rpx; }
  .lang-name { font-size: 28rpx; color: #666; }
}

.submit {
  height: 90rpx;
  line-height: 90rpx;
  text-align: center;
  margin-top: 90rpx;
  background: #fff;
  width: 100%;
  color: $main-color;
}

.person {
  height: 160rpx;          /* ✅ 收窄行高，头像小了之后不需要那么高 */
  display: flex;
  padding: 0 30rpx;
  font-size: $font-base;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
  background: #fff;

  .user-name {
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    margin-left: 30rpx;
    font-size: 34rpx;
  }
}

.u-cell {
  height: 110rpx;
  padding: 0 20rpx;
  align-items: center;
  color: #333333;
}

::v-deep .u-cell__value { color: #cccccc !important; }
::v-deep .u-cell__right-icon-wrap { color: #cccccc !important; }
</style>
