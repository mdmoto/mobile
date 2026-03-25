<!-- tpl_flex_three.vue 修复版 -->
<!-- 原问题：scoped style 里有 img { width: 111px } 用 px 单位，
     与 u-image 的 240rpx 不协调，H5 下宽度不一致 -->
<template>
  <div class="layout">
    <u-image
      @click="modelNavigateTo(item)"
      height="240rpx"
      width="240rpx"
      class="image-mode"
      :src="item.img"
      v-for="(item, index) in res.list"
      :key="index"
    >
      <template #loading><u-loading-icon></u-loading-icon></template>
    </u-image>
  </div>
</template>

<script>
import { modelNavigateTo } from "./tpl";
export default {
  title: "三列单行图片模块",
  props: ["res"],
  data() {
    return { modelNavigateTo };
  },
};
</script>

<style lang="scss" scoped>
@import "./tpl.scss";
.layout {
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-size: cover;
}
/* ✅ 删除了原来的 img { width: 111px } —— u-image 组件不渲染 <img> 标签，这条规则从未生效且会干扰原生图片渲染 */
</style>
