<template>
  <div class="layout">
    <div class="view-list">
      <div class="view-item" @click="modelNavigateTo(res.list[0])">
        <div class="-item-title">{{ res.list[0].title }}</div>
        <div class="-item-image">
          <u-image width="120rpx" mode="scaleToFill" height="120rpx" :src="res.list[0].img"></u-image>
        </div>
      </div>
      <div class="view-item" @click="modelNavigateTo(res.list[1])">
        <div class="-item-title">{{ res.list[1].title }}</div>
        <div class="-item-image">
          <u-image width="120rpx" mode="scaleToFill" height="120rpx" :src="res.list[1].img"></u-image>
        </div>
      </div>
    </div>
    <div class="view-list">
      <div class="view-item" @click="modelNavigateTo(res.list[2])">
        <div class="-item-title">{{ res.list[2].title }}</div>
        <div class="-item-image">
          <u-image width="120rpx" mode="scaleToFill" height="120rpx" :src="res.list[2].img"></u-image>
        </div>
      </div>
      <div class="view-item" @click="modelNavigateTo(res.list[3])">
        <div class="-item-title">{{ res.list[3].title }}</div>
        <div class="-item-image">
          <u-image width="120rpx" mode="scaleToFill" height="120rpx" :src="res.list[3].img"></u-image>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { modelNavigateTo } from './tpl'
export default {
  title: "文字图片模板",
  props: ["res"],
  data() {
    return { modelNavigateTo };
  },
};
</script>

<style lang="scss" scoped>
@import "./tpl.scss";

.layout {
  display: flex;
  background: #e8e8e8;
  align-items: center;
  justify-content: center;
  background-size: cover;
  padding: 0;
}

.-item-image {
  padding: 20rpx;        /* 原 10px → 20rpx */
}

/* ✅ 修复：原 font-size: 14px 与旁边的 rpx 元素不协调
   14px ≈ 28rpx；统一改用 rpx 变量 */
.-item-title {
  background: $aider-light-color;
  height: 60rpx;
  color: #fff;
  font-size: 24rpx;      /* 原 14px → 24rpx（略调小，标题不宜过大） */
  text-align: center;
  line-height: 60rpx;   /* 与 height 相同，单行垂直居中 */
}

.view-list {
  width: 48%;
  margin: 0 auto;
  display: flex;
  background: #fff;
  border-top-left-radius: 0.8em;
  border-top-right-radius: 0.8em;
  border: 1rpx solid #ededed;  /* 原 1px → 1rpx */

  > .view-item {
    width: 50%;
  }
  > .view-item:nth-of-type(1) > .-item-title {
    border-top-left-radius: 0.8em;
  }
  > .view-item:nth-of-type(2) > .-item-title {
    border-top-right-radius: 0.8em;
  }
}
</style>
