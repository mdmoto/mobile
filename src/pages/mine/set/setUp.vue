<template>
  <view class="container">
    <view class="person" @click="checkUserInfo()">
      <u-image width=140 height="140" shape="circle" :src="userInfo.face || userImage" mode="">
      </u-image>
      <view class="user-name">
        {{ userInfo.id ? userInfo.nickName || '' : $t('user.notLoggedIn')  }}
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
        <view slot="right" class="current-lang">
          <text class="lang-flag">{{ currentLangFlag }}</text>
          <text class="lang-name">{{ currentLangName }}</text>
        </view>
      </u-cell>
      
      <!-- 货币设置 -->
      <u-cell 
        :title="$t('user.currency') || '币种设置'" 
        :arrow="true" 
        @click="showCurrencyPicker = true"
      >
        <view slot="right" class="current-lang">
          <text class="lang-name">{{ currentCurrency }}</text>
        </view>
      </u-cell>
      
      <!-- #ifdef APP-PLUS -->
      <u-cell :title="$t('user.clearCache')" :value="fileSizeString" @click="clearCache"></u-cell>
      <!-- #endif -->
      <!-- #ifndef MP-WEIXIN -->
      <u-cell :title="$t('user.securityCenter')" @click="navigateTo('/pages/mine/set/securityCenter/securityCenter')"></u-cell>
      <!-- #endif -->
	  <u-cell :title="$t('user.userLogoff')" v-if="userInfo.id" @click="logoff"></u-cell>
      <u-cell :title="$t('user.feedback')" @click="navigateTo('/pages/mine/set/feedBack')"></u-cell>
      <!-- #ifndef H5 -->
      <!-- #endif -->
      <u-cell :title="$t('user.aboutApp', {name: config.name})" @click="navigateTo('/pages/mine/set/editionIntro')"></u-cell>
    </u-cell-group>
    
    <!-- 语言选择器 -->
    <u-picker
      :show="showLanguagePicker"
      :columns="[languageList]"
      key-name="name"
      value-name="code"
      :defaultIndex="[Math.max(currentLangIndex, 0)]"
      closeOnClickOverlay
      @confirm="changeLanguage"
      @cancel="showLanguagePicker = false"
      @close="showLanguagePicker = false"
      @update:show="showLanguagePicker = $event"
    ></u-picker>

    <!-- 货币选择器 -->
    <u-picker
      :show="showCurrencyPicker"
      :columns="[currencyList]"
      key-name="name"
      value-name="code"
      :defaultIndex="[Math.max(currentCurrencyIndex, 0)]"
      closeOnClickOverlay
      @confirm="changeCurrency"
      @cancel="showCurrencyPicker = false"
      @close="showCurrencyPicker = false"
      @update:show="showCurrencyPicker = $event"
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
      userImage:config.defaultUserPhoto,
      isCertificate: false,
      userInfo: {},
      fileSizeString: "0B",
      // 多语言相关
      showLanguagePicker: false,
      languageList: getLanguageList(),
      // 货币相关
      showCurrencyPicker: false,
      currencyList: [
        { name: this.$t("currency.CNY"), code: "CNY" },
        { name: this.$t("currency.USD"), code: "USD" },
        { name: this.$t("currency.JPY"), code: "JPY" },
        { name: this.$t("currency.EUR"), code: "EUR" },
        { name: this.$t("currency.GBP"), code: "GBP" },
        { name: this.$t("currency.KRW"), code: "KRW" },
        { name: this.$t("currency.HKD"), code: "HKD" },
        { name: this.$t("currency.TWD"), code: "TWD" },
        { name: this.$t("currency.SGD"), code: "SGD" }
      ]
    };
  },
  
  computed: {
    currentLang() {
      return getCurrentLanguage();
    },
    
    currentLangIndex() {
      return this.languageList.findIndex(lang => lang.code === this.currentLang);
    },
    
    currentLangName() {
      const lang = this.languageList.find(lang => lang.code === this.currentLang);
      return lang ? lang.name : '简体中文';
    },
    
    currentLangFlag() {
      const lang = this.languageList.find(lang => lang.code === this.currentLang);
      return lang ? lang.flag : '🇨🇳';
    },

    currentCurrency() {
      return storage.getCurrency();
    },

    currentCurrencyIndex() {
      return this.currencyList.findIndex(item => item.code === this.currentCurrency);
    }
  },

  methods: {
    // 切换语言
    changeLanguage(payload) {
      this.showLanguagePicker = false;
      const selectedLang = payload && payload.value && payload.value[0];
      if (!selectedLang) return;
      
      if (selectedLang.code !== this.currentLang) {
        setLanguage(selectedLang.code);
        
        uni.showToast({
          title: this.$t('message.operationSuccess'),
          icon: 'success'
        });
        
        // 1秒后重新加载页面使语言生效
        setTimeout(() => {
          uni.reLaunch({
            url: '/pages/mine/set/setUp'
          });
        }, 1000);
      }
    },

    // 切换货币
    changeCurrency(payload) {
      this.showCurrencyPicker = false;
      const selected = payload && payload.value && payload.value[0];
      if (!selected) return;
      if (selected.code !== this.currentCurrency) {
        storage.setCurrency(selected.code);
        uni.showToast({
          title: this.$t('message.operationSuccess'),
          icon: 'success'
        });
        // 货币切换通常不需要全量重启，但为了确保所有过滤器更新，重新进入页面
        setTimeout(() => {
          uni.reLaunch({
            url: '/pages/mine/set/setUp'
          });
        }, 1000);
      }
    },
    navigateTo(url) {
      if (url == "/pages/set/securityCenter/securityCenter") {
        url += `?mobile=${this.userInfo.mobile}`;
      }
      uni.navigateTo({
        url: url,
      });
    },
     /**
	   * 退出登录
	   */
    quiteLoginOut() {
      storage.removeUserInfo();
      storage.removeAccessToken();
      uni.reLaunch({
        url: "/pages/tabbar/user/my",
      });
    },
  
	/**
	 * 用户注销
	 */
    logoff() {
      uni.showActionSheet({
        itemList: [this.$t("user.confirmLogoff")],
        success: (res) => {
          if (res.tapIndex == 0) {
            // 这里应调用后端注销接口，暂先执行退出登录逻辑
            this.quiteLoginOut();
          }
        },
      });
    },

    /**
     * 读取当前缓存
     */
    getCacheSize() {
      //获取缓存数据
      let that = this;
      plus.cache.calculate(function (size) {
        let sizeCache = parseInt(size);
        if (sizeCache == 0) {
          that.fileSizeString = "0B";
        } else if (sizeCache < 1024) {
          that.fileSizeString = sizeCache + "B";
        } else if (sizeCache < 1048576) {
          that.fileSizeString = (sizeCache / 1024).toFixed(2) + "KB";
        } else if (sizeCache < 1073741824) {
          that.fileSizeString = (sizeCache / 1048576).toFixed(2) + "MB";
        } else {
          that.fileSizeString = (sizeCache / 1073741824).toFixed(2) + "GB";
        }
      });
    },

    /**
     * 点击用户详情
     * 判断当前是否进入用户中心
     */
    checkUserInfo() {
      if (this.isLogin("auth")) {
        this.navigateTo("/pages/mine/set/personMsg");
      } else {
        this.tipsToLogin();
      }
    },

    /**
     * 清除当前设备缓存
     */
    clearCache() {
      //清理缓存
      let that = this;
      let os = plus.os.name;
      if (os == "Android") {
        let main = plus.android.runtimeMainActivity();
        let sdRoot = main.getCacheDir();
        let files = plus.android.invoke(sdRoot, "listFiles");
        let len = files.length;
        for (let i = 0; i < len; i++) {
          let filePath = "" + files[i]; // 没有找到合适的方法获取路径，这样写可以转成文件路径
          plus.io.resolveLocalFileSystemURL(
            filePath,
            function (entry) {
              if (entry.isDirectory) {
                entry.removeRecursively(
                  function (entry) {
                    //递归删除其下的所有文件及子目录
                    uni.showToast({
                      title: this.$t('user.cacheCleared'),
                      duration: 2000,
                      icon: "none",
                    });
                    that.getCacheSize(); // 重新计算缓存
                  },
                  function (e) {}
                );
              } else {
                entry.remove();
              }
            },
            function (e) {
              uni.showToast({
                title: this.$t('user.pathReadFailed'),
                duration: 2000,
                icon: "none",
              });
            }
          );
        }
      } else {
        // ios
        plus.cache.clear(function () {
          uni.showToast({
            title: this.$t('user.cacheCleared'),
            duration: 2000,
            icon: "none",
          });
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

<style lang='scss' scoped>
.current-lang {
  display: flex;
  align-items: center;
  gap: 8rpx;
  
  .lang-flag {
    font-size: 36rpx;
  }
  
  .lang-name {
    font-size: 28rpx;
    color: #666;
  }
}

.submit {
  height: 90rpx;
  line-height: 90rpx;
  text-align: center;
  margin-top: 90rpx;
  background: #fff;
  width: 100%;
  margin: 0 auto;
  color: $main-color;
}
.person {
  height: 208rpx;
  display: flex;
  padding: 0 20rpx;
  font-size: $font-base;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
  .user-name {
    width: 500rpx;
    overflow: hidden;

    text-overflow: ellipsis;

    white-space: nowrap;
    margin-left: 30rpx;
    line-height: 2em;
    font-size: 34rpx;
  }
}
.u-cell {
  height: 110rpx;
  /* line-height: 110rpx; */
  padding: 0 20rpx;
  align-items: center;
  color: #333333;
}

::v-deep  .u-cell__value {
  color: #cccccc !important;
}

::v-deep  .u-cell__right-icon-wrap {
  color: #cccccc !important;
}
</style>
