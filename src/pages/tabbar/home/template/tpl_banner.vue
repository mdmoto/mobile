<template>
  <div class="layout">
    <div class="box">
      <u-swiper @click="clickSwiper" interval="5000" duration="500" height="350rpx" v-if="res" keyName="img" :list="res.list">
        <template #loading><u-loading-icon></u-loading-icon></template>
      </u-swiper>
    </div>
  </div>
</template>

<script>
import { modelNavigateTo } from "./tpl";
export default {
  title: "导航栏",
  props: ["res"],
  methods: {
    clickSwiper(index) {
      modelNavigateTo(this.res.list[index]);
    },
  },
};
</script>
<style lang="scss" scoped>
@import "./tpl.scss";
</style>
