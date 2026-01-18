<template>
  <view class="container">
    <view class="person" @click="checkUserInfo()">
      <u-image width=140 height="140" shape="circle" :src="userInfo.face || userImage" mode="">
      </u-image>
      <view class="user-name">
        {{ userInfo.id ? userInfo.nickName || '' : '暂未登录'  }}
      </view>
      <u-icon color="#ccc" name="arrow-right"></u-icon>
    </view>
    <!-- #ifdef MP-WEIXIN -->
    <view style="height: 20rpx; width: 100%"></view>
    <!-- #endif -->
    <u-cell-group :border="false">
      <!-- 语言设置 -->
      <u-cell-item 
        :title="$t('user.language')" 
        :arrow="true" 
        @click="showLanguagePicker = true"
      >
        <view slot="right" class="current-lang">
          <text class="lang-flag">{{ currentLangFlag }}</text>
          <text class="lang-name">{{ currentLangName }}</text>
        </view>
      </u-cell-item>
      
      <!-- #ifdef APP-PLUS -->
      <u-cell-item title="清除缓存" :value="fileSizeString" @click="clearCache"></u-cell-item>
      <!-- #endif -->
      <!-- #ifndef MP-WEIXIN -->
      <u-cell-item title="安全中心" @click="navigateTo('/pages/mine/set/securityCenter/securityCenter')"></u-cell-item>
      <!-- #endif -->
	  <u-cell-item title="用户注销" v-if="userInfo.id" @click="logoff"></u-cell-item>
      <u-cell-item title="意见反馈" @click="navigateTo('/pages/mine/set/feedBack')"></u-cell-item>
      <!-- #ifndef H5 -->
      <!-- #endif -->
      <u-cell-item :title="`关于${config.name}`" @click="navigateTo('/pages/mine/set/editionIntro')"></u-cell-item>
    </u-cell-group>
    
    <!-- 语言选择器 -->
    <u-picker
      v-model="showLanguagePicker"
      mode="selector"
      :range="languageList"
      range-key="name"
      :default-selector="[currentLangIndex]"
      @confirm="changeLanguage"
    ></u-picker>
    <view class="submit" v-if="userInfo.id" @click="quiteLoginOut">退出登录</view>
  </view>
</template>

<script>
import config from "@/config/config";
import { setLanguage, getCurrentLanguage, getLanguageList } from '@/lang';

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
      languageList: getLanguageList()
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
    }
  },

  methods: {
    // 切换语言
    changeLanguage(index) {
      const selectedLang = this.languageList[index[0]];
      
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
      this.$options.filters.quiteLoginOut();
	  },
  
	/**
	 * 用户注销
	 */
	logoff(){
		this.$options.filters.logoff();
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
      if (this.$options.filters.isLogin("auth")) {
        this.navigateTo("/pages/mine/set/personMsg");
      } else {
        this.$options.filters.tipsToLogin();
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
                      title: "缓存清理完成",
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
                title: "文件路径读取失败",
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
            title: "缓存清理完成",
            duration: 2000,
            icon: "none",
          });
          that.getCacheSize();
        });
      }
    },
  },
  onShow() {
    this.userInfo = this.$options.filters.isLogin();
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
