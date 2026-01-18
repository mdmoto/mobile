# Git 工作流程指南

## 📋 概述

本文档说明如何安全地使用Git进行代码提交和推送，避免常见问题。

## ⚠️ 常见问题

### 1. Force Push 问题

**问题**: 使用 `git push --force` 会覆盖远程分支的历史，可能导致：
- 丢失其他人的提交
- 破坏协作流程
- 无法恢复数据

**解决方案**: 
- ✅ 使用 `push-to-github-safe.sh` 脚本（推荐）
- ✅ 手动推送前先 `git pull --rebase`
- ❌ 避免使用 `--force` 除非绝对必要

### 2. 远程仓库混乱

**问题**: 频繁切换远程仓库可能导致：
- 推送到错误的仓库
- 丢失远程配置
- 分支跟踪关系混乱

**解决方案**:
- 为不同用途使用不同的远程名称（如 `origin`, `github`, `gitee`）
- 使用 `git remote -v` 检查当前配置
- 不要频繁删除和重新添加远程仓库

### 3. 未提交的更改

**问题**: 推送前忘记提交更改

**解决方案**:
- 使用 `git status` 检查状态
- 使用 `push-to-github-safe.sh` 脚本会自动检查

## 🚀 推荐工作流程

### 日常提交和推送

```bash
# 1. 检查状态
git status

# 2. 添加更改
git add <文件>

# 3. 提交
git commit -m "描述性提交信息"

# 4. 安全推送（推荐）
./push-to-github-safe.sh

# 或者手动推送
git pull --rebase origin master  # 如果有冲突先解决
git push origin master
```

### 处理冲突

```bash
# 1. 获取远程更新
git fetch origin

# 2. 使用rebase合并（保持历史整洁）
git pull --rebase origin master

# 3. 解决冲突后
git add <解决冲突的文件>
git rebase --continue

# 4. 推送
git push origin master
```

## 📁 仓库说明

### ⚠️ 重要：两个仓库的用途完全不同

#### 1. mobile 仓库（源代码备份）
- **本地路径**: `/Users/adam/0.9/lilishop-uniapp/`
- **远程**: `git@github.com:mdmoto/mobile.git`
- **用途**: **uni-app 源代码备份**
- **分支**: `master`
- **何时推送**: 修改源代码后推送，用于版本控制和备份
- **⚠️ 注意**: 这是源代码，不是编译后的文件

#### 2. m 仓库（编译后的部署文件）
- **本地路径**: `/Users/adam/0.9/m/` 或 `/Users/adam/0.9/lilishop-uniapp/unpackage/dist/build/web/`
- **远程**: `git@github.com:mdmoto/m.git`
- **用途**: **编译后的静态文件，直接用于 Cloudflare Pages 部署**
- **分支**: `master`
- **何时推送**: 编译完成后，将 `unpackage/dist/build/web/` 的内容推送到此仓库
- **⚠️ 注意**: 这是编译后的文件，Cloudflare 会自动从该仓库部署

### 🔄 工作流程

```
1. 修改源代码 (lilishop-uniapp/)
   ↓
2. 提交并推送到 mobile 仓库 (备份源代码)
   ↓
3. 编译项目 (npm run build:h5)
   ↓
4. 将编译后的文件复制到 m 仓库
   ↓
5. 提交并推送到 m 仓库 (触发 Cloudflare 部署)
```

## 🔧 脚本说明

### push-to-github-safe.sh
- ✅ 自动检查未提交的更改
- ✅ 检查本地和远程分支状态
- ✅ 避免使用force push
- ✅ 提供清晰的错误信息

### pushGithub.sh (旧脚本)
- ⚠️ 使用force push（不推荐）
- ⚠️ 会切换远程仓库
- ⚠️ 建议迁移到新脚本

## 📝 提交信息规范

使用清晰的提交信息：

```
类型(范围): 简短描述

详细描述（可选）

- 修复点1
- 修复点2
```

**类型**:
- `fix`: 修复bug
- `feat`: 新功能
- `docs`: 文档更新
- `style`: 代码格式
- `refactor`: 重构
- `test`: 测试
- `chore`: 构建/工具

**示例**:
```
fix(H5): 修复注册功能验证码发送问题

- 修复验证码验证组件的business参数
- 改进错误处理和日志
- 完善注册流程
```

## 🆘 紧急情况处理

### 如果推送被拒绝

```bash
# 1. 查看差异
git log HEAD..origin/master

# 2. 拉取并合并
git pull --rebase origin master

# 3. 解决冲突后推送
git push origin master
```

### 如果误用了force push

```bash
# 1. 查看reflog找到之前的提交
git reflog

# 2. 恢复到之前的提交
git reset --hard <commit-hash>

# 3. 强制推送（仅限紧急情况）
git push --force-with-lease origin master
```

## ✅ 最佳实践

1. **推送前检查**: 使用 `git status` 和 `git log`
2. **使用安全脚本**: 优先使用 `push-to-github-safe.sh`
3. **清晰的提交信息**: 便于追踪和回滚
4. **定期同步**: 经常 `git pull` 保持同步
5. **分支管理**: 重要功能使用独立分支
6. **备份重要更改**: 推送前确保本地有备份

