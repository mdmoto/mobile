#!/bin/bash

# 安全的GitHub推送脚本
# 避免使用force push，防止覆盖远程更改

set -e  # 遇到错误立即退出

echo "=========================================="
echo "开始安全推送到GitHub"
echo "=========================================="

# 检查当前分支
CURRENT_BRANCH=$(git branch --show-current)
echo "当前分支: $CURRENT_BRANCH"

# 检查是否有未提交的更改
if ! git diff-index --quiet HEAD --; then
    echo "❌ 错误: 有未提交的更改，请先提交或暂存"
    echo "使用 'git status' 查看详情"
    exit 1
fi

# 检查远程仓库
REMOTE_URL=$(git remote get-url origin 2>/dev/null || echo "")
if [ -z "$REMOTE_URL" ]; then
    echo "❌ 错误: 未找到远程仓库 origin"
    exit 1
fi

echo "远程仓库: $REMOTE_URL"

# 获取远程更新
echo "正在获取远程更新..."
if ! git fetch origin; then
    echo "❌ 错误: 无法获取远程更新"
    exit 1
fi

# 检查本地分支是否落后于远程
LOCAL=$(git rev-parse @)
REMOTE=$(git rev-parse @{u} 2>/dev/null || echo "")
BASE=$(git merge-base @ @{u} 2>/dev/null || echo "")

if [ -z "$REMOTE" ] || [ -z "$BASE" ]; then
    echo "⚠️  警告: 无法比较本地和远程分支，可能是新分支"
    echo "正在推送新分支..."
    git push --set-upstream origin "$CURRENT_BRANCH"
    echo "✅ 推送完成"
    exit 0
fi

if [ "$LOCAL" = "$REMOTE" ]; then
    echo "✅ 本地分支与远程分支一致，无需推送"
    exit 0
elif [ "$LOCAL" = "$BASE" ]; then
    echo "⚠️  警告: 本地分支落后于远程分支"
    echo "建议先执行: git pull origin $CURRENT_BRANCH"
    read -p "是否继续推送? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "已取消推送"
        exit 1
    fi
elif [ "$REMOTE" = "$BASE" ]; then
    echo "✅ 本地分支领先于远程分支，可以安全推送"
else
    echo "⚠️  警告: 本地分支和远程分支已分叉"
    echo "建议先执行: git pull --rebase origin $CURRENT_BRANCH"
    read -p "是否继续推送? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "已取消推送"
        exit 1
    fi
fi

# 安全推送（不使用force）
echo "正在推送到GitHub..."
if git push origin "$CURRENT_BRANCH"; then
    echo "✅ 推送成功"
else
    echo "❌ 推送失败"
    echo ""
    echo "如果推送被拒绝，可能的原因："
    echo "1. 远程分支有新的提交，需要先拉取: git pull --rebase origin $CURRENT_BRANCH"
    echo "2. 权限不足，检查SSH密钥配置"
    echo "3. 网络问题，稍后重试"
    exit 1
fi

echo "=========================================="
echo "推送完成"
echo "=========================================="

