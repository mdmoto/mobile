import Vue from 'vue'
import VueI18n from 'vue-i18n'
import zhCN from './zh-CN'
import enUS from './en-US'
import jaJP from './ja-JP'
import koKR from './ko-KR'
import thTH from './th-TH'
import esES from './es-ES'
import frFR from './fr-FR'
import viVN from './vi-VN'

Vue.use(VueI18n)

// 获取当前语言
function getLanguage() {
  // 1. 从本地存储获取用户选择的语言
  const savedLang = uni.getStorageSync('app_language')
  if (savedLang) {
    console.log('[i18n] 使用保存的语言:', savedLang)
    return savedLang
  }
  
  // 2. 从系统语言获取
  try {
    const systemInfo = uni.getSystemInfoSync()
    const systemLang = systemInfo.language || systemInfo.locale || 'zh-CN'
    console.log('[i18n] 系统语言:', systemLang)
    
    // 匹配语言
    if (systemLang.toLowerCase().includes('zh')) {
      if (systemLang.includes('TW') || systemLang.includes('HK')) {
        return 'zh-TW' // 繁体（暂未实现，回退到简体）
      }
      return 'zh-CN'
    }
    if (systemLang.toLowerCase().includes('en')) {
      return 'en-US'
    }
  } catch (e) {
    console.warn('[i18n] 获取系统语言失败:', e)
  }
  
  // 3. 默认中文
  console.log('[i18n] 使用默认语言: zh-CN')
  return 'zh-CN'
}

const i18n = new VueI18n({
  locale: getLanguage(),
  fallbackLocale: 'zh-CN', // 回退语言
  messages: {
    'zh-CN': zhCN,
    'en-US': enUS,
    'ja-JP': jaJP,
    'ko-KR': koKR,
    'th-TH': thTH,
    'es-ES': esES,
    'fr-FR': frFR,
    'vi-VN': viVN
  },
  silentTranslationWarn: true // 关闭翻译警告
})

// 切换语言的方法
export function setLanguage(lang) {
  i18n.locale = lang
  uni.setStorageSync('app_language', lang)
  console.log('[i18n] 语言已切换为:', lang)
}

// 获取当前语言
export function getCurrentLanguage() {
  return i18n.locale
}

// 获取语言列表
export function getLanguageList() {
  return [
    { code: 'zh-CN', name: '简体中文', flag: '🇨🇳' },
    { code: 'en-US', name: 'English', flag: '🇺🇸' },
    { code: 'ja-JP', name: '日本語', flag: '🇯🇵' },
    { code: 'ko-KR', name: '한국어', flag: '🇰🇷' },
    { code: 'th-TH', name: 'ภาษาไทย', flag: '🇹🇭' },
    { code: 'es-ES', name: 'Español', flag: '🇪🇸' },
    { code: 'fr-FR', name: 'Français', flag: '🇫🇷' },
    { code: 'vi-VN', name: 'Tiếng Việt', flag: '🇻🇳' }
  ]
}

export default i18n

