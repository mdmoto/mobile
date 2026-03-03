import Vue from 'vue'
import VueI18n from 'vue-i18n'
import zhCN from './zh-CN'
import enUS from './en-US'
import jaJP from './ja-JP'
import koKR from './ko-KR'
import thTH from './th-TH'
import esES from './es-ES'
import frFR from './fr-FR'
import deDE from './de-DE'
import arSA from './ar-SA'

Vue.use(VueI18n)

// 获取当前语言
function getLanguage() {
  // 1. 从本地存储获取用户选择的语言
  const savedLang = uni.getStorageSync('app_language')
  if (savedLang) {
    return savedLang
  }

  // 2. 从系统语言获取
  try {
    const systemInfo = uni.getSystemInfoSync()
    const systemLang = systemInfo.language || systemInfo.locale || 'en-US'
    console.log('[i18n] 系统语言:', systemLang)

    const langMap = {
      'zh': 'zh-CN',
      'en': 'en-US',
      'ja': 'ja-JP',
      'ko': 'ko-KR',
      'ar': 'ar-SA',
      'es': 'es-ES',
      'fr': 'fr-FR',
      'th': 'th-TH',
      'de': 'de-DE'
    }

    for (const key in langMap) {
      if (systemLang.toLowerCase().includes(key)) {
        return langMap[key]
      }
    }
  } catch (e) {
    console.warn('[i18n] 获取系统语言失败:', e)
  }

  return 'en-US'
}

const i18n = new VueI18n({
  locale: getLanguage(),
  fallbackLocale: 'en-US',
  messages: {
    'zh-CN': zhCN,
    'en-US': enUS,
    'ja-JP': jaJP,
    'ko-KR': koKR,
    'th-TH': thTH,
    'es-ES': esES,
    'fr-FR': frFR,
    'de-DE': deDE,
    'ar-SA': arSA
  },
  silentTranslationWarn: true
})

// 切换语言的方法
export function setLanguage(lang) {
  i18n.locale = lang
  uni.setStorageSync('app_language', lang)
  // 如果是阿拉伯语，执行一些全局状态变更或页面刷新逻辑
  console.log('[i18n] 语言已切换为:', lang)
}

export function getCurrentLanguage() {
  return i18n.locale
}

export function getLanguageList() {
  return [
    { code: 'zh-CN', name: '简体中文', flag: '🇨🇳' },
    { code: 'en-US', name: 'English', flag: '🇺🇸' },
    { code: 'ja-JP', name: '日本語', flag: '🇯🇵' },
    { code: 'ko-KR', name: '한국어', flag: '🇰🇷' },
    { code: 'ar-SA', name: 'العربية (RTL)', flag: '🇸🇦' },
    { code: 'es-ES', name: 'Español', flag: '🇪🇸' },
    { code: 'fr-FR', name: 'Français', flag: '🇫🇷' },
    { code: 'de-DE', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'th-TH', name: 'ภาษาไทย', flag: '🇹🇭' }
  ]
}

export default i18n
