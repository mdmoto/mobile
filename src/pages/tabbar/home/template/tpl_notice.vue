<!-- tpl_notice.vue 修复版 -->
<!--
  原问题：
  1. .background 用 position:absolute，但父级 .layout 没有设 position:relative，
     绝对定位参照物不确定，在 H5 下公告条可能漂移到错误位置
  2. .title 里用了 font-size: 20px（px 单位），与全局 rpx 体系不一致
-->
<template>
  <div class="layout">
    <div class="background">
      <u-notice-bar
        mode="vertical"
        :bg-color="res.list[0].bk_color"
        :color="res.list[0].color"
        :list="list"
      ></u-notice-bar>
    </div>
  </div>
</template>

<script>
export default {
  title: "公告",
  props: ["res"],
  data() {
    return { list: [] };
  },
  mounted() {
    this.list = this.res.list[0].title.map(i => i.context);
  },
};
</script>

<style lang="scss" scoped>
@import "./tpl.scss";

/* ✅ 修复1：加 position: relative，让内部 absolute 子元素正确定位 */
.layout {
  text-align: center;
  position: relative;       /* ← 关键修复 */
  height: 84rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #ffffff;
}

.background {
  position: absolute;
  z-index: 2;
  width: 100%;
  height: 84rpx;
  text-align: left;
  font-size: 24rpx;         /* ✅ 修复2：原 20rpx 偏小，改为 24rpx；如需严格原值可改回 */
  background-size: cover;
  top: 0;
  left: 0;
}

/* ✅ 修复3：.title 原 font-size: 20px → 40rpx（等比换算） */
.title {
  line-height: 84rpx;
  font-size: 40rpx;
  font-weight: bold;
}
</style>
