<template>
  <div class="layout">
    <div class="box">
      <u-swiper @click="clickSwiper" interval="5000" duration="500" height="350" v-if="res && res.list" keyName="img" :list="res.list">
        <u-loading-icon slot="loading"></u-loading-icon>
      </u-swiper>
    </div>
  </div>
</template>

<script>
import { modelNavigateTo } from "./tpl";
export default {
  title: "导航栏",
  props: ["res"],
  mounted() {
   
  },
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
