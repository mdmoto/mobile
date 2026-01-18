# 🔐 注册功能关闭变更日志

**文档名称**: login-change  
**创建日期**: 2025-10-31  
**变更类型**: 临时关闭注册功能（内测阶段）  
**影响范围**: 买家端前端 + 移动端  
**提交记录**: 
- PC端: `f640ba3d` - "feat: 暂时关闭注册功能，显示内测提示信息"
- 移动端: `34e24ed` - "feat: 移动端关闭自动注册，仅允许已有账号登录"

---

## 📋 变更概述

为了内测阶段管理，暂时关闭了用户注册功能。

### PC端
所有注册入口都改为显示提示信息：
> **提示内容**：  
> 标题：注册暂未开放  
> 内容：目前内测阶段，暂不支持注册，账户定向开放。如有需求请联系：ss@maollar.com  
> 按钮：知道了

### 移动端（H5/小程序/App）
修改登录页面提示文字，从"未注册的手机号验证后将自动创建用户账号"改为"目前内测阶段，仅限已有账号登录"，并添加联系邮箱。

---

## 📁 修改的文件清单

### PC端（lilishop-ui）

#### 1️⃣ 登录页面
- **文件路径**: `lilishop-ui/buyer/src/pages/Login.vue`
- **修改位置**: 第 129 行，第 415-422 行

#### 2️⃣ 头部导航组件
- **文件路径**: `lilishop-ui/buyer/src/components/header/Header.vue`
- **修改位置**: 第 10-12 行，第 185-192 行

#### 3️⃣ 注册页面
- **文件路径**: `lilishop-ui/buyer/src/pages/SignUp.vue`
- **修改位置**: 第 210-220 行，第 226 行

### 移动端（lilishop-uniapp）

#### 4️⃣ 移动端登录页面
- **文件路径**: `lilishop-uniapp/pages/passport/login.vue`
- **修改位置**: 第 52-60 行

---

## 🔧 详细变更记录 - 移动端重点

### 4️⃣ login.vue - 移动端登录页面

#### 变更: 修改提示文字并添加联系方式

**原始代码** (第 52-57 行):
```vue
				<div class="tips">
					未注册的手机号验证后将自动创建用户账号，登录即代表您已同意<span @click="navigateToPrivacy('PRIVACY_POLICY')">《隐私协议》</span>
					<span @click="navigateToPrivacy('USER_AGREEMENT')">
						《用户协议》
					</span>
				</div>
```

**修改后代码**:
```vue
				<div class="tips">
					目前内测阶段，仅限已有账号登录。登录即代表您已同意<span @click="navigateToPrivacy('PRIVACY_POLICY')">《隐私协议》</span>
					<span @click="navigateToPrivacy('USER_AGREEMENT')">
						《用户协议》
					</span>
					<div style="color: #999; font-size: 24rpx; margin-top: 10rpx;">
						如需注册请联系：ss@maollar.com
					</div>
				</div>
```

**变更说明**: 
- 修改主提示文字，从"未注册的手机号验证后将自动创建用户账号"改为"目前内测阶段，仅限已有账号登录"
- 添加联系邮箱信息

**注意**: 此修改只是前端提示，后端自动注册逻辑仍然存在。如需完全禁止注册，需要在后端添加拦截逻辑。

---

## 🔄 恢复步骤（开放注册时使用）

### 方法 1: 使用 Git 回退（推荐）

**移动端**:
```bash
# 1. 进入移动端项目
cd /Users/adam/0.9/lilishop-uniapp

# 2. 方式A - 直接回退提交
git revert 34e24ed
git push origin master

# 3. 方式B - 恢复单个文件到之前版本
git checkout 1c5c538 -- pages/passport/login.vue
git add .
git commit -m "feat: 恢复移动端自动注册功能"
git push origin master
```

---

### 方法 2: 手动修改代码

#### 恢复移动端 login.vue

**文件**: `lilishop-uniapp/pages/passport/login.vue`

**位置** - 第 52-60 行，恢复原始提示：

```vue
<!-- 将当前代码： -->
				<div class="tips">
					目前内测阶段，仅限已有账号登录。登录即代表您已同意<span @click="navigateToPrivacy('PRIVACY_POLICY')">《隐私协议》</span>
					<span @click="navigateToPrivacy('USER_AGREEMENT')">
						《用户协议》
					</span>
					<div style="color: #999; font-size: 24rpx; margin-top: 10rpx;">
						如需注册请联系：ss@maollar.com
					</div>
				</div>

<!-- 改回： -->
				<div class="tips">
					未注册的手机号验证后将自动创建用户账号，登录即代表您已同意<span @click="navigateToPrivacy('PRIVACY_POLICY')">《隐私协议》</span>
					<span @click="navigateToPrivacy('USER_AGREEMENT')">
						《用户协议》
					</span>
				</div>
```

---

## 📊 Git 信息

### 移动端提交记录

**关闭注册**:
```
Commit: 34e24ed
Date: 2025-10-31
Message: feat: 移动端关闭自动注册，仅允许已有账号登录

Changed files:
  - pages/passport/login.vue
```

**恢复前版本**:
```
Commit: 1c5c538
Message: feat: 积分改为喵币，修复Sass语法，更新App启动页和schemes
```

---

## 📝 注意事项

1. **邮箱地址**: 联系邮箱为 `ss@maollar.com`，如需修改请同步更新

2. **后端逻辑**: 
   - ⚠️ **重要**: 此修改只是前端提示，后端自动注册接口仍然存在
   - 如果用户通过 API 直接调用仍可注册
   - 如需完全禁止，需要在后端添加注册开关

3. **自动部署**: 
   - 推送到 GitHub 后，Cloudflare Pages 自动部署
   - H5 需要重新编译

4. **测试**: 建议先在本地测试恢复效果

---

## 🔗 相关文档

- 完整变更日志（含PC端）: `lilishop-ui/login-change.md`
- Git diff: `git show 34e24ed`

---

**最后更新**: 2025-10-31  
**文档版本**: 2.0 (移动端版)  
**维护者**: 开发团队

