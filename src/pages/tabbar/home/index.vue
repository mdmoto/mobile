<template>
  <div class="wrapper">
    <!-- 楼层装修组件 -->
    <tpl ref="tpl" />
  </div>
</template>
<script>
import tpl from "@/pages/tabbar/home/views.vue";

export default {
  data() {
    return {
      background: {
        backgroundColor: "#fff",
      },
    };
  },
  onShow(){
    this.$nextTick(() => {
      if (this.$refs.tpl && typeof this.$refs.tpl.init === "function") {
        this.$refs.tpl.init();
      }
    });
  },
  methods: {

  },
  onReachBottom(){
    // 给子级监听触底加载
    console.log('===== 首页 onReachBottom 事件触发 =====');
    uni.$emit('onReachBottom',true)
  },
  
  onPullDownRefresh() {
    this.$refs.tpl.init();

    uni.stopPullDownRefresh();
  },
  components: {
    tpl,
  },
};
</script>

<style lang="scss" scoped>
</style>
