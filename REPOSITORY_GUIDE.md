# 📦 仓库使用指南

## ⚠️ 重要：两个仓库的用途完全不同

### 1️⃣ mobile 仓库 - 源代码备份

**用途**: uni-app 源代码版本控制和备份

- **本地路径**: `/Users/adam/0.9/lilishop-uniapp/`
- **远程仓库**: `git@github.com:mdmoto/mobile.git`
- **分支**: `master`
- **内容**: uni-app 源代码（.vue, .js, .json 等源文件）
- **何时推送**: 
  - ✅ 修改源代码后
  - ✅ 添加新功能后
  - ✅ 修复bug后
- **⚠️ 注意**: 
  - 这是源代码，不是编译后的文件
  - 用于版本控制和团队协作
  - **不会触发 Cloudflare 部署**

**推送命令**:
```bash
cd /Users/adam/0.9/lilishop-uniapp
git add .
git commit -m "描述"
git push origin master
# 或使用安全脚本
./push-to-github-safe.sh
```

---

### 2️⃣ m 仓库 - 编译后的部署文件

**用途**: 编译后的静态文件，用于 Cloudflare Pages 自动部署

- **本地路径**: `/Users/adam/0.9/m/` 或 `/Users/adam/0.9/lilishop-uniapp/unpackage/dist/build/web/`
- **远程仓库**: `git@github.com:mdmoto/m.git`
- **分支**: `main` (注意：是 main，不是 master)
- **内容**: 编译后的静态文件（HTML, CSS, JS 等）
- **何时推送**: 
  - ✅ 编译完成后
  - ✅ 需要更新线上版本时
- **⚠️ 注意**: 
  - 这是编译后的文件，不是源代码
  - Cloudflare Pages 会自动从该仓库部署
  - **推送后会立即触发部署**

**推送命令**:
```bash
# 方法1: 从编译目录推送
cd /Users/adam/0.9/lilishop-uniapp/unpackage/dist/build/web
git add .
git commit -m "部署: 更新编译后的文件"
git push origin main

# 方法2: 从 m 目录推送（如果已复制）
cd /Users/adam/0.9/m
git add .
git commit -m "部署: 更新编译后的文件"
git push origin main
```

---

## 🔄 完整工作流程

### 场景：修改代码并部署

```bash
# 步骤1: 修改源代码
cd /Users/adam/0.9/lilishop-uniapp
# ... 修改代码 ...

# 步骤2: 提交源代码到 mobile 仓库（备份）
git add .
git commit -m "fix: 修复注册功能验证码发送问题"
git push origin master

# 步骤3: 编译项目
npm run build:h5

# 步骤4: 将编译后的文件推送到 m 仓库（部署）
cd unpackage/dist/build/web
git add .
git commit -m "部署: 更新编译后的文件"
git push origin main

# 步骤5: Cloudflare Pages 自动部署
# 无需手动操作，Cloudflare 会自动检测并部署
```

---

## ❌ 常见错误

### 错误1: 将源代码推送到 m 仓库
```bash
# ❌ 错误
cd /Users/adam/0.9/lilishop-uniapp
git push origin main  # 推送到 m 仓库

# ✅ 正确
cd /Users/adam/0.9/lilishop-uniapp
git push origin master  # 推送到 mobile 仓库
```

### 错误2: 将编译后的文件推送到 mobile 仓库
```bash
# ❌ 错误
cd /Users/adam/0.9/lilishop-uniapp/unpackage/dist/build/web
git push origin master  # 推送到 mobile 仓库

# ✅ 正确
cd /Users/adam/0.9/lilishop-uniapp/unpackage/dist/build/web
git push origin main  # 推送到 m 仓库
```

### 错误3: 忘记编译就直接推送
```bash
# ❌ 错误
cd /Users/adam/0.9/lilishop-uniapp
git push origin master
# 然后直接推送到 m 仓库（没有编译）

# ✅ 正确
cd /Users/adam/0.9/lilishop-uniapp
git push origin master  # 先备份源代码
npm run build:h5        # 编译
cd unpackage/dist/build/web
git push origin main    # 再推送编译后的文件
```

---

## ✅ 快速检查清单

推送前检查：

- [ ] 我在正确的目录？
  - mobile 仓库：`/Users/adam/0.9/lilishop-uniapp/`
  - m 仓库：`/Users/adam/0.9/m/` 或编译目录

- [ ] 我在推送正确的内容？
  - mobile 仓库：源代码（.vue, .js 文件）
  - m 仓库：编译后的文件（HTML, CSS, JS）

- [ ] 我使用了正确的分支？
  - mobile 仓库：`master`
  - m 仓库：`main`

- [ ] 我检查了远程仓库？
  ```bash
  git remote -v
  ```
  - mobile 仓库应该显示：`git@github.com:mdmoto/mobile.git`
  - m 仓库应该显示：`git@github.com:mdmoto/m.git`

---

## 📝 总结

| 项目 | mobile 仓库 | m 仓库 |
|------|------------|--------|
| **用途** | 源代码备份 | 部署文件 |
| **内容** | uni-app 源代码 | 编译后的静态文件 |
| **分支** | master | main |
| **推送时机** | 修改源代码后 | 编译完成后 |
| **是否触发部署** | ❌ 否 | ✅ 是 |
| **Cloudflare** | 不关联 | 自动部署 |

**记住**: 
- 📝 **mobile** = 源代码 = 备份
- 🚀 **m** = 编译后 = 部署

