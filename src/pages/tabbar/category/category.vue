<template>
  <view class="category-wrap">
    <!--
      ✅ 关键修复：
      原来 navbar-left-content 设了 width: 750rpx，
      但 u-navbar 本身内有 padding/margin，加上 750rpx 就超出屏幕宽度，
      导致搜索框溢出到屏幕右侧之外。
      改为 width: 100%，依靠 flex 布局让标题和搜索框分配空间。
    -->
    <u-navbar class="navbar" :is-back="false" fixed placeholder border>
      <template #left>
        <view class="navbar-left-content">
          <text class="nav-title">{{ $t('category.title') }}</text>
          <u-search
            class="nav-search"
            @click.native="search"
            :placeholder="$t('home.search')"
            :show-action="false"
          ></u-search>
        </view>
      </template>
    </u-navbar>

    <view class="content">
      <scroll-view scroll-y scroll-with-animation class="left-aside">
        <view
          v-for="(item, index) in tabList"
          :key="item.id"
          class="f-item b-b"
          :class="{ active: item.id === currentId }"
          @click="tabtap(item, index)"
        >
          {{ item.name }}
        </view>
      </scroll-view>

      <scroll-view scroll-with-animation scroll-y class="right-aside" :upper-threshold="-100" :lower-threshold="-100">
        <view class="top-img" id="main-top">
          <u-image width="100%" height="230rpx" @click="navigateToList(topImg.id, topImg.id)" :src="topImg.image" mode="aspectFill">
          </u-image>
        </view>
        <view v-for="item in categoryList" :key="item.id" class="s-list" :id="'main-' + item.id">
          <text class="s-item">{{ item.name }}</text>
          <view class="t-list">
            <template v-for="(children, cIndex) in item.children" :key="children.id">
              <view
                @click="navigateToList(item.id, children.id)"
                v-if="children.parentId === item.id"
                class="t-item"
                :class="{ 'margin-right': (cIndex + 1) % 3 == 0 }"
              >
                <u-image width="110rpx" height="110rpx" :src="children.image" :lazy-load="true">
                </u-image>
                <text>{{ children.name }}</text>
              </view>
            </template>
          </view>
        </view>
      </scroll-view>
    </view>
  </view>
</template>

<script>
import { getCategoryList } from "@/api/goods.js";
export default {
  data() {
    return {
      currentId: 0,
      tabList: [],
      categoryList: [],
      topImg: "",
    };
  },
  onLoad() {
    this.loadData();
    // #ifdef MP-WEIXIN
    uni.showShareMenu({ withShareTicket: true });
    // #endif
  },
  methods: {
    search() {
      uni.navigateTo({ url: "/pages/navigation/search/searchPage" });
    },
    async loadData() {
      let list = await getCategoryList(0);
      this.tabList = list.data.result;
      this.currentId = list.data.result[0].id;
      this.loadListContent(0);
    },
    loadListContent(index) {
      this.topImg = this.tabList[index];
      this.categoryList = this.tabList[index].children;
    },
    tabtap(item, i) {
      if (item.id !== this.currentId) {
        this.currentId = item.id;
        this.loadListContent(i);
      }
    },
    navigateToList(sid, tid) {
      uni.navigateTo({ url: `/pages/navigation/search/searchPage?category=${tid}` });
    },
  },
};
</script>

<style lang="scss" scoped>
page {
  height: 100%;
  background-color: #fdfaff;
}

/* 解决小程序和 App 滚动条问题 */
/* #ifdef MP-WEIXIN || APP-PLUS */
::-webkit-scrollbar { display: none; }
/* #endif */
/* #ifdef H5 */
uni-scroll-view .uni-scroll-view::-webkit-scrollbar { display: none; }
/* #endif */

/*
 * ✅ 核心修复：navbar 内容区
 * 原来用了 width: 750rpx 硬编码，在有 navbar 内边距的情况下必然溢出
 * 改为 width: 100%，box-sizing: border-box，内部用 flex 分配空间
 */
.navbar-left-content {
  display: flex;
  align-items: center;
  width: 100%;
  box-sizing: border-box;
  padding: 0 16rpx;
  gap: 12rpx;
}

.nav-title {
  flex-shrink: 0;              /* 标题不压缩 */
  font-weight: bold;
  font-size: $font-md;         /* ✅ 使用全局字号变量，不再写字面量 */
  color: #333;
}

/* ✅ 搜索框弹性占满剩余宽度，不用固定宽度 */
.nav-search {
  flex: 1;
  min-width: 0;                /* flex 允许收缩到 0 */
}

.s-list {
  box-shadow: 0 4rpx 12rpx 0 rgba(0, 0, 0, 0.05);
}

.category-wrap {
  height: 100%;

  .content {
    /*
     * ✅ 高度计算：用 rpx 替代 px，避免跨设备不一致
     * 94px ≈ 188rpx（navbar 高度）
     * 用 CSS var 更准确
     */
    height: calc(100vh - 94px);
    display: flex;
    color: #333;
    font-size: $font-base;     /* ✅ 使用全局变量 */
    background: #fff;
  }

  .left-aside {
    flex-shrink: 0;
    width: 200rpx;
    height: 100%;
    background-color: #f7f7f7;
  }

  .f-item {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 97rpx;
    position: relative;
    font-size: $font-sm;       /* ✅ 统一左侧菜单字号 */

    &.active {
      font-weight: bold;
      color: $light-color;
      background: #fff;
    }
  }

  .right-aside {
    flex: 1;
    overflow: hidden;
    padding: 40rpx 0 0 30rpx;
  }

  .top-img {
    width: 100%;               /* ✅ 改为 100%，不固定 500rpx，避免在窄屏溢出 */
    height: 230rpx;
    border-radius: 8rpx;
    overflow: hidden;
  }

  .s-item {
    display: flex;
    align-items: center;
    height: 70rpx;
    padding-top: 16rpx;
    font-weight: 500;
    font-size: $font-base;
  }

  .t-list {
    display: flex;
    flex-wrap: wrap;
    width: 100%;
    padding-top: 12rpx;
  }

  .t-item {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    width: 25%;
    font-size: $font-sm;
    padding-bottom: 20rpx;
    box-sizing: border-box;

    /* ✅ 统一用 rpx，不混用 px */
    ::v-deep .u-image {
      width: 110rpx !important;
      height: 110rpx !important;
      border-radius: 8rpx !important;
      margin-bottom: 16rpx !important;
    }
  }
}
</style>
