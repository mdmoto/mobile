<template>
  <div class="layout">
    <div class="search" @click="handleSearch">
      <u-icon name="search"></u-icon>
      {{ res.list[0].title }}
    </div>
  </div>
</template>
<script>
export default {
  title:"搜索栏",
  props: ["res","storeId"],
  methods: {
    linkMsgDetail(){
      uni.navigateTo({
        url:`/pages/tabbar/home/title`
      })
    },
 
    handleSearch() {
      if(this.storeId){
        uni.navigateTo({
        url: `/pages/navigation/search/searchPage?storeId=${this.storeId}`,
      });
      }else{
         uni.navigateTo({
        url: `/pages/navigation/search/searchPage`,
      });
      }
      
    },
  },
};
</script>
<style lang="scss" scoped>
@import "./tpl.scss";

.search {
  height: 64rpx;
  border-radius: 10rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #ededed;
}

.layout {
  background: #fff;
  padding: 0 16rpx;
  position: relative;
}
.navbar-right{
	position: absolute;
	top: 0;
	// right: 0;
}
.message{
	right:40rpx;
}
</style>
