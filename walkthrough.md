## H5 回归问题 Walkthrough（根因修复版）

### 现象（线上）
- H5 出现 `TypeError: e.forEach is not a function`，导致页面渲染中断：图标排列错乱、语言/汇率切换不可点、无法进入登录页、Banner/部分点击无响应。

### 根因（关键）
1. **uview-plus（Vue3）组件 API 与旧 uView（Vue2）用法混用**
   - `u-picker` 在 uview-plus 中：`modelValue` 必须是 `Array`（内部会 `join()` / `forEach()`）。
   - 旧写法把 `v-model="showXxx"`（布尔）绑定到了 `modelValue`，触发运行时崩溃。

2. **全局标题回退**
   - `src/pages.json` 的 `globalStyle.navigationBarTitleText` 决定了部分页面（尤其 `navigationStyle: custom`）在 H5 下的标题兜底。

3. **全局配置缺失导致资源路径拼接 undefined**
   - 部分装修/轮播逻辑依赖全局 `$config`，未注入时会出现 `undefined` 拼接。

### 已实施修复（最小侵入 + 根因）
#### 1) 修复 u-picker / datetime picker 的 Vue3 正确用法
- `src/pages/mine/set/setUp.vue`
  - `u-picker` 改为 `:show` + `@update:show` + `:columns`（不再用 `v-model` 绑布尔）。
- `src/pages/mine/set/personMsg.vue`
  - 生日选择从错误的 `u-picker mode="time"` 改为 `u-datetime-picker`。
- `src/components/language-selector/index.vue`
  - 同步修正 `u-picker` 用法（避免未来被引用时再次触发同类崩溃）。

#### 2) 注入全局 $config（修复资源拼接 undefined）
- `src/main.js`
  - `app.config.globalProperties.$config = config;`

#### 3) 修复 “我的”工具区 4 列布局（避免 gap 造成 3 列换行）
- `src/pages/tabbar/user/utils/tool.vue`
  - 明确 `gap: 0`、`width: 25%`、`box-sizing: border-box`。

#### 4) 商品点击跳转对齐装修跳转逻辑
- `src/pages/tabbar/home/template/tpl_goods.vue`
  - `handleClick` 统一走 `modelNavigateTo(item)`，避免装修数据结构不一致时跳转哑火。

#### 5) 标题回退修正
- `src/pages.json`
  - `globalStyle.navigationBarTitleText` 确认为 `MaoMall`（移除 `Lili商城` 残留）。

### 构建/部署
- 构建命令：`cd /Users/adam/0.9/lilishop-uniapp && npm run build:h5`
- 产物目录：`/Users/adam/0.9/lilishop-uniapp/dist/build/web`

### 验收清单（建议）
1. 打开首页：无 `e.forEach` 报错，Banner 可见。
2. 进入“我的”：图标为 4 列正常换行，点击可跳转。
3. 进入“设置”：语言/货币弹窗可打开、可切换、可关闭。
4. 进入“个人信息”：生日选择器可打开并写入生日。
5. 首页商品点击：可进入详情页。

### 回滚建议
- 若线上出现不可控风险：优先回滚前端静态资源（`dist/build/web`），后端无需回滚。

