<!-- tpl_flex_four.vue 修复版 -->
<!-- 原问题：scoped style 里有 img { width: 84px } 用 px，与 u-image 175rpx 不一致 -->
<template>
  <div class="layout">
    <u-image
      height="175rpx"
      mode="aspectFit"
      width="175rpx"
      @click="modelNavigateTo(item)"
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
  title: "四列单行图片模块",
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
  align-items: center;
  justify-content: center;
  background-size: cover;
}
/* ✅ 删除了 img { width: 84px } —— 与 u-image 组件无关，已清除 */
</style>
