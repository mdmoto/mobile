# 🌍 移动端多语言配置指南

**项目**: maollar-uniapp  
**框架**: uni-app  
**当前状态**: ❌ 未实现多语言

---

## 📋 需要准备的内容

### 1️⃣ **确定支持的语言**

**推荐配置**：
- 🇨🇳 **中文**（简体）- zh-CN（默认）
- 🇺🇸 **英文** - en-US
- 🇭🇰 **繁体中文** - zh-TW（可选）
- 🇯🇵 **日语** - ja-JP（可选）
- 🇰🇷 **韩语** - ko-KR（可选）
- 🇹🇭 **泰语** - th-TH（可选）
- 🇻🇳 **越南语** - vi-VN（可选）

**建议**：先实现**中文+英文**，其他语言后续添加

---

### 2️⃣ **翻译的文本内容**

需要翻译的内容包括：

#### A. **导航和标题**（约50条）
```javascript
首页、分类、购物车、我的
商品详情、订单列表、个人中心
搜索、消息、设置...
```

#### B. **按钮和操作**（约100条）
```javascript
确认、取消、保存、删除、编辑
立即购买、加入购物车、去支付
登录、注册、退出...
```

#### C. **提示和说明**（约200条）
```javascript
请输入手机号、密码不能为空
加载中、操作成功、操作失败
确认删除吗？、暂无数据...
```

#### D. **商品相关**（约150条）
```javascript
价格、库存、销量、评价
规格、颜色、尺码、数量
商品名称、商品描述、商品详情...
```

#### E. **订单相关**（约150条）
```javascript
待付款、待发货、待收货、已完成
订单号、收货地址、支付方式
物流信息、退换货、售后服务...
```

**总计约**: 600-800条文本需要翻译

---

### 3️⃣ **翻译工具推荐**

#### 自动翻译（初稿）：
- Google Translate API
- DeepL API
- Azure Translator
- 阿里云机器翻译

#### 人工校对（必须）：
- 专业翻译人员
- 本地化专家
- 母语审校

**建议流程**：
1. 提取所有中文文本
2. 机器翻译生成初稿
3. 人工校对和本地化
4. 测试验证

---

## 🛠️ 技术实现方案

### 方案1: vue-i18n（推荐）⭐

**优点**：
- ✅ Vue官方i18n解决方案
- ✅ uni-app完美支持
- ✅ 功能完善，文档齐全

**实现步骤**：

#### 步骤1: 安装依赖

```bash
cd /Users/adam/0.9/maollar-uniapp
npm install vue-i18n@8.28.2
```

注意：uni-app使用Vue2，需要vue-i18n 8.x版本

---

#### 步骤2: 创建语言文件结构

```
maollar-uniapp/
  ├── lang/                    # 新建
  │   ├── index.js            # i18n配置
  │   ├── zh-CN.js            # 中文
  │   ├── en-US.js            # 英文
  │   └── ...                 # 其他语言
```

---

#### 步骤3: 创建语言文件

**lang/zh-CN.js** (中文):
```javascript
export default {
  common: {
    confirm: '确认',
    cancel: '取消',
    save: '保存',
    delete: '删除',
    loading: '加载中...',
    success: '操作成功',
    failed: '操作失败',
    noData: '暂无数据'
  },
  tabbar: {
    home: '首页',
    category: '分类',
    cart: '购物车',
    mine: '我的'
  },
  goods: {
    detail: '商品详情',
    price: '价格',
    stock: '库存',
    sales: '销量',
    addToCart: '加入购物车',
    buyNow: '立即购买'
  },
  order: {
    myOrder: '我的订单',
    waitPay: '待付款',
    waitDeliver: '待发货',
    waitReceive: '待收货',
    completed: '已完成'
  },
  user: {
    login: '登录',
    register: '注册',
    logout: '退出登录',
    profile: '个人信息',
    settings: '设置'
  }
  // ... 更多分类
}
```

**lang/en-US.js** (英文):
```javascript
export default {
  common: {
    confirm: 'Confirm',
    cancel: 'Cancel',
    save: 'Save',
    delete: 'Delete',
    loading: 'Loading...',
    success: 'Success',
    failed: 'Failed',
    noData: 'No Data'
  },
  tabbar: {
    home: 'Home',
    category: 'Category',
    cart: 'Cart',
    mine: 'Mine'
  },
  goods: {
    detail: 'Product Detail',
    price: 'Price',
    stock: 'Stock',
    sales: 'Sales',
    addToCart: 'Add to Cart',
    buyNow: 'Buy Now'
  },
  order: {
    myOrder: 'My Orders',
    waitPay: 'Pending Payment',
    waitDeliver: 'Pending Delivery',
    waitReceive: 'Pending Receipt',
    completed: 'Completed'
  },
  user: {
    login: 'Login',
    register: 'Register',
    logout: 'Logout',
    profile: 'Profile',
    settings: 'Settings'
  }
  // ... more categories
}
```

---

#### 步骤4: 配置i18n

**lang/index.js**:
```javascript
import Vue from 'vue'
import VueI18n from 'vue-i18n'
import zhCN from './zh-CN'
import enUS from './en-US'

Vue.use(VueI18n)

// 获取当前语言
function getLanguage() {
  // 1. 从本地存储获取
  const savedLang = uni.getStorageSync('language')
  if (savedLang) return savedLang
  
  // 2. 从系统语言获取
  const systemInfo = uni.getSystemInfoSync()
  const systemLang = systemInfo.language
  
  if (systemLang.includes('zh')) return 'zh-CN'
  if (systemLang.includes('en')) return 'en-US'
  
  // 3. 默认中文
  return 'zh-CN'
}

const i18n = new VueI18n({
  locale: getLanguage(),
  fallbackLocale: 'zh-CN', // 回退语言
  messages: {
    'zh-CN': zhCN,
    'en-US': enUS
  }
})

export default i18n
```

---

#### 步骤5: 在main.js中引入

```javascript
import Vue from 'vue'
import App from './App'
import i18n from './lang' // 引入i18n

Vue.config.productionTip = false
App.mpType = 'app'

const app = new Vue({
  i18n, // 注入i18n
  ...App
})
app.$mount()
```

---

#### 步骤6: 在页面中使用

**方式1: 模板中使用**
```vue
<template>
  <view>
    <text>{{ $t('common.confirm') }}</text>
    <button>{{ $t('goods.addToCart') }}</button>
  </view>
</template>
```

**方式2: JavaScript中使用**
```javascript
export default {
  methods: {
    showMessage() {
      uni.showToast({
        title: this.$t('common.success'),
        icon: 'success'
      })
    }
  }
}
```

---

### 方案2: 自定义多语言（简单）

如果不想用vue-i18n，可以自己实现：

#### 步骤1: 创建语言文件

**utils/lang.js**:
```javascript
const messages = {
  'zh-CN': {
    home: '首页',
    cart: '购物车',
    // ...
  },
  'en-US': {
    home: 'Home',
    cart: 'Cart',
    // ...
  }
}

let currentLang = uni.getStorageSync('language') || 'zh-CN'

export function t(key) {
  return messages[currentLang][key] || key
}

export function setLanguage(lang) {
  currentLang = lang
  uni.setStorageSync('language', lang)
}

export function getCurrentLanguage() {
  return currentLang
}
```

#### 步骤2: 使用

```vue
<template>
  <view>
    <text>{{ t('home') }}</text>
  </view>
</template>

<script>
import { t } from '@/utils/lang'

export default {
  methods: {
    t
  }
}
</script>
```

---

## 📝 需要准备的文件清单

### 1. **翻译文件**

| 文件 | 语言 | 说明 |
|------|------|------|
| lang/zh-CN.js | 中文 | 默认语言 |
| lang/en-US.js | 英文 | 第二语言 |
| lang/zh-TW.js | 繁体 | 可选 |
| lang/ja-JP.js | 日语 | 可选 |

---

### 2. **语言切换界面**

在"个人中心 → 设置"中添加语言切换：

```vue
<!-- pages/mine/set/setUp.vue -->
<u-cell-group>
  <u-cell-item title="语言设置" :arrow="true" @click="showLanguageSelector">
    <text slot="right">{{ currentLanguageName }}</text>
  </u-cell-item>
</u-cell-group>

<!-- 语言选择弹窗 -->
<u-picker 
  v-model="showLangPicker" 
  :default-selector="[languageIndex]"
  :range="languages" 
  range-key="name"
  @confirm="changeLanguage"
></u-picker>
```

---

### 3. **页面标题多语言**

**pages.json**:
```json
{
  "pages": [
    {
      "path": "pages/tabbar/home/index",
      "style": {
        "navigationBarTitleText": "%home.title%"
      }
    }
  ]
}
```

需要配合uni-app的locale系统

---

## 🎯 实施步骤建议

### **阶段1：准备工作**（1-2天）

1. **提取所有文本**
   - 扫描所有.vue文件
   - 提取硬编码的中文文本
   - 整理成Excel或JSON

2. **分类整理**
   - 通用文本（按钮、提示等）
   - 业务文本（商品、订单等）
   - 页面特定文本

3. **翻译**
   - 使用机器翻译生成初稿
   - 人工校对关键文本
   - 本地化适配

---

### **阶段2：技术实现**（2-3天）

1. **安装vue-i18n**
2. **创建语言文件结构**
3. **配置i18n**
4. **修改main.js**
5. **实现语言切换组件**

---

### **阶段3：替换文本**（5-7天）

1. **批量替换硬编码文本**
   ```vue
   <!-- 之前 -->
   <text>首页</text>
   
   <!-- 之后 -->
   <text>{{ $t('tabbar.home') }}</text>
   ```

2. **测试每个页面**
3. **修复格式问题**
4. **调整样式适配**

---

### **阶段4：测试和优化**（2-3天）

1. **功能测试**
2. **翻译准确性检查**
3. **UI适配（文本长度）**
4. **性能优化**

---

## 📊 工作量估算

| 阶段 | 工作量 | 人力 |
|------|--------|------|
| 文本提取和翻译 | 3-5天 | 1人 |
| 技术实现 | 2-3天 | 1个开发 |
| 页面替换 | 5-7天 | 1-2个开发 |
| 测试优化 | 2-3天 | 1人 |
| **总计** | **12-18天** | **1-2人** |

---

## 📁 需要创建的文件

### 必需文件

```
maollar-uniapp/
  ├── lang/
  │   ├── index.js              # i18n配置入口
  │   ├── zh-CN.js              # 中文语言包
  │   └── en-US.js              # 英文语言包
  │
  ├── components/
  │   └── language-selector/    # 语言切换组件
  │       └── index.vue
  │
  └── static/
      └── lang/                 # 语言图标
          ├── zh-CN.png
          └── en-US.png
```

---

## 💡 快速启动方案

### **最小化实现**（2-3天）

如果只想快速支持英文，可以：

1. **只翻译关键文本**（约200条）：
   - Tabbar导航
   - 主要按钮
   - 常用提示

2. **不用vue-i18n**，用简单的方法：
   ```javascript
   // config/lang.js
   const LANG = {
     'zh': {
       home: '首页',
       cart: '购物车'
     },
     'en': {
       home: 'Home',
       cart: 'Cart'
     }
   }
   
   export function t(key, lang = 'zh') {
     return LANG[lang][key] || key
   }
   ```

3. **只修改主要页面**：
   - 首页、分类、购物车、我的
   - 商品详情、订单页
   - 登录注册

---

## 🎯 我的建议

### **方案A：完整多语言**（推荐）

**适合**：
- 计划国际化市场
- 有充足开发时间
- 需要支持3+种语言

**投入**：12-18天开发 + 翻译成本

---

### **方案B：轻量级多语言**

**适合**：
- 快速上线测试
- 只支持中英文
- 预算有限

**投入**：3-5天开发 + 简单翻译

---

### **方案C：暂不实现**

**适合**：
- 当前只面向中文市场
- 未来再考虑国际化

**投入**：0（保持现状）

---

## 📦 我可以帮你做的

### **选项1：完整实现**

我可以帮你：
1. ✅ 搭建vue-i18n架构
2. ✅ 创建语言文件结构
3. ✅ 提取所有需要翻译的文本
4. ✅ 实现语言切换组件
5. ✅ 修改主要页面使用i18n
6. ⏳ 翻译需要你提供（或使用机器翻译）

---

### **选项2：最小化实现**

我可以帮你：
1. ✅ 创建简单的多语言工具
2. ✅ 翻译关键文本（200条）
3. ✅ 修改主要页面
4. ✅ 实现语言切换

时间：2-3天

---

### **选项3：准备方案**

我可以帮你：
1. ✅ 设计多语言架构
2. ✅ 提供实施指南
3. ✅ 准备示例代码
4. ⏳ 你们自己实施

---

## ❓ 请告诉我

1. **打算支持哪些语言？**
   - 只要中英文？
   - 还是多语言？

2. **什么时候需要？**
   - 立即开始？
   - 未来规划？

3. **希望哪种方案？**
   - 完整实现（12-18天）
   - 快速实现（3-5天）
   - 只要方案文档

4. **翻译由谁负责？**
   - 你们提供翻译
   - 使用机器翻译
   - 需要我帮忙翻译

---

**告诉我你的需求，我会提供详细的实施方案！** 🌍

