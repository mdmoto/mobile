<template>
  <div class="layout" style="pointer-events: auto !important;">
    <div class="box">
      <u-swiper @click.stop="clickSwiper" interval="5000" duration="500" height="350" v-if="res && res.list && res.list.length > 0" keyName="img" :list="res.list">
         <template #loading>
            <u-loading-icon></u-loading-icon>
         </template>
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
      if (this.res && this.res.list && this.res.list[index]) {
        modelNavigateTo(this.res.list[index]);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import "./tpl.scss";
</style>
