<template>
  <view class="language-selector">
    <u-cell-group>
      <u-cell 
        :title="$t('user.language')" 
        :arrow="true" 
        @click="showPicker = true"
      >
        <view slot="right" class="current-lang">
          <text class="lang-flag">{{ currentLangFlag }}</text>
          <text class="lang-name">{{ currentLangName }}</text>
        </view>
      </u-cell>
    </u-cell-group>
    
    <!-- 语言选择器 -->
    <u-picker
      v-model="showPicker"
      mode="selector"
      :range="languageList"
      range-key="name"
      :default-selector="[currentLangIndex]"
      @confirm="handleLanguageChange"
    ></u-picker>
  </view>
</template>

<script>
import { setLanguage, getCurrentLanguage, getLanguageList } from '@/lang'

export default {
  name: 'LanguageSelector',
  
  data() {
    return {
      showPicker: false,
      languageList: getLanguageList()
    }
  },
  
  computed: {
    currentLang() {
      return getCurrentLanguage()
    },
    
    currentLangIndex() {
      return this.languageList.findIndex(lang => lang.code === this.currentLang)
    },
    
    currentLangName() {
      const lang = this.languageList.find(lang => lang.code === this.currentLang)
      return lang ? lang.name : '简体中文'
    },
    
    currentLangFlag() {
      const lang = this.languageList.find(lang => lang.code === this.currentLang)
      return lang ? lang.flag : '🇨🇳'
    }
  },
  
  methods: {
    handleLanguageChange(index) {
      const selectedLang = this.languageList[index[0]]
      
      if (selectedLang.code !== this.currentLang) {
        // 切换语言
        setLanguage(selectedLang.code)
        
        // 提示用户
        uni.showToast({
          title: this.$t('message.operationSuccess'),
          icon: 'success'
        })
        
        // 1秒后刷新页面
        setTimeout(() => {
          // 重新加载当前页面
          const pages = getCurrentPages()
          const currentPage = pages[pages.length - 1]
          const url = `/${currentPage.route}`
          
          uni.reLaunch({
            url: url
          })
        }, 1000)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.language-selector {
  .current-lang {
    display: flex;
    align-items: center;
    gap: 8px;
    
    .lang-flag {
      font-size: 20px;
    }
    
    .lang-name {
      font-size: 14px;
      color: #666;
    }
  }
}
</style>

