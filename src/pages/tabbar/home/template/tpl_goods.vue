<template>
  <div class="layout">
    <u-sticky>
      <div class="goods-cell-title">
        <div
          class="goods-item-title"
          :class="{ 'selected-title': selected.index == index }"
          @click="handleClickTitle(title, index)"
          v-for="(title, index) in res.list[0].titleWay"
          :key="index"
        >
          <h4 class="h4">{{ title.title }}</h4>
          <div>{{ title.desc }}</div>
        </div>
      </div>
    </u-sticky>
    <div class="goods-list">
      <div
        v-if="
          item.___index != undefined
            ? selected.index == item.___index
            : selected.val == item.type
        "
        @click="handleClick(item)"
        class="goods-item"
        v-for="(item, item_index) in res.list[0].listWay"
        :key="item_index"
      >
        <div class="goods-img">
          <u-image
            :src="item.img"
            height="350rpx"
            mode="aspectFit"
            width="100%"
          >
            <u-loading-icon slot="loading"></u-loading-icon>
          </u-image>
        </div>
        <div class="goods-desc">
          <div class="goods-title">
            {{ item.title }}
          </div>
          <div class="goods-bottom">
            <div class="goods-price">
              <span>{{ unitPrice(item.price, undefined, 'before') }}</span>.{{ goodsFormatPrice(item.price)[1] }}
            </div>
          </div>
        </div>
      </div>

      <div
        v-if="res.list[0].titleWay[selected.index].bindCategory && goodsData.length"
        v-for="(item, index) in goodsData"
        :key="index"
        class="goods-item"
        @click="handleClick(item)"
      >
        <div class="goods-img">
          <u-image
            :src="item.thumbnail"
            height="350rpx"
            mode="aspectFit"
            width="100%"
          >
            <u-loading-icon slot="loading"></u-loading-icon>
          </u-image>
        </div>
        <div class="goods-desc">
          <div class="goods-title">
            {{ item.goodsName }}
          </div>
          <div class="goods-bottom">
            <div class="goods-price">
              <span>{{ unitPrice(item.price, undefined, 'before') }}</span>.{{ goodsFormatPrice(item.price)[1] }}
            </div>
          </div>
        </div>
      </div>
      
      <!-- 加载更多提示（仅最后模块且启用触底加载时显示） -->
      <div v-if="enableBottomLoad && goodsData.length > 0" style="width: 100%; padding: 20rpx 0;">
        <uni-load-more :status="loadStatus"></uni-load-more>
      </div>
    </div>
  </div>
</template>
<script>
import { getGoodsList } from "@/api/goods.js";
import uniLoadMore from "@/components/uni-load-more/uni-load-more.vue";
export default {
  title: "商品分类以及商品",
  components: {
    uniLoadMore,
  },
  data() {
    return {
      selected: {
        index: 0,
        val: "",
      },
      params: {
        pageNumber: 1,
        pageSize: 100, // 初始加载100条
        categoryId: "",
      },
      isInitialLoad: true, // 标记是否为初始加载
      goodsData: [], //商品循环内容
      goodsResult:"", //es总返回内容
      loadStatus: 'more', // 加载状态：more-可以加载更多, loading-加载中, noMore-没有更多了
    };
  },
  props: ["res","enableBottomLoad"],
  watch: {
    res: {
      handler(val) {
        // 监听父级的值 如果有值将值赋给selected
        if (val) {
          // 如果第一个标签页绑定为商品
          this.selected.val = this.res.list[0].listWay[0] ? this.res.list[0].listWay[0].type: '';
          // 如果第一个标签为绑定为分类
          if (this.res.list[0].titleWay[0].bindCategory) {
            this.params.pageNumber = 1;
            this.goodsData = [];
            this.isInitialLoad = true; // 初始加载
            this.initGoods(this.res.list[0].titleWay[0]);
          }
        }
      },
      immediate: true,
    },
  },
  mounted() {
    uni.$on('onReachBottom',()=>{
      console.log('触底事件触发:', {
        enableBottomLoad: this.enableBottomLoad,
        goodsResult: this.goodsResult,
        totalElements: this.goodsResult ? this.goodsResult.totalElements : 0,
        goodsDataLength: this.goodsData.length,
        loadStatus: this.loadStatus,
        canLoadMore: this.goodsResult && this.goodsResult.totalElements > this.goodsData.length
      });
      
      if(this.enableBottomLoad && this.goodsResult && this.goodsResult.totalElements > this.goodsData.length && this.loadStatus !== 'loading'){
        console.log('开始加载更多商品...');
        this.isInitialLoad = false;
        this.params.pageSize = 20; // 触底加载时每次加载20条
        this.params.pageNumber++;
        this.loadStatus = 'loading'; // 设置加载状态
        
        // 获取当前选中的分类
        const currentTitle = this.res.list[0].titleWay[this.selected.index];
        if (currentTitle && currentTitle.bindCategory) {
          this.initGoods(currentTitle);
        } else {
          console.error('无法获取当前分类信息');
          this.loadStatus = 'more';
        }
      } else {
        console.log('不满足加载条件，跳过加载');
      }
    })
  },
  destroyed(){
    uni.$off('onReachBottom')
  },
  methods: {
    handleClick(item) {
      uni.navigateTo({
        url: `/pages/product/goods?id=${item.id}&goodsId=${item.goodsId}`,
      });
    },
    closeGoods(val, index) {
      this.res.list[0].listWay.splice(index, 1);
    },
    async initGoods(val) {
      // 防止重复加载
      if (this.loadStatus === 'loading') {
        console.log('正在加载中，跳过重复请求');
        return;
      }
      
      // 如果是初始加载，使用100条；如果是触底加载，使用20条（已在onReachBottom中设置）
      if (this.isInitialLoad) {
        this.params.pageSize = 100;
        this.loadStatus = 'loading'; // 初始加载时显示加载状态
      }
      
      // 设置分类ID
      if (val && val.bindCategory) {
        this.params.categoryId = val.bindCategory.id;
      } else if (val && val.id) {
        // 兼容直接传入分类ID的情况
        this.params.categoryId = val.id;
      }
      
      console.log('开始请求商品列表:', {
        isInitialLoad: this.isInitialLoad,
        pageSize: this.params.pageSize,
        pageNumber: this.params.pageNumber,
        categoryId: this.params.categoryId
      });
      
      try {
        const res = await getGoodsList(this.params);
        if (res.data.success) {
          this.goodsResult = res.data.result;
          const result = res.data.result.records || [];
          
          // 追加新数据
          this.goodsData.push(...result);
          
          // 更新加载状态
          if (this.enableBottomLoad) {
            if (this.goodsData.length >= this.goodsResult.totalElements) {
              this.loadStatus = 'noMore'; // 没有更多了
            } else {
              this.loadStatus = 'more'; // 可以加载更多
            }
          }
          
          console.log('商品数据加载成功:', {
            isInitialLoad: this.isInitialLoad,
            pageSize: this.params.pageSize,
            pageNumber: this.params.pageNumber,
            loadedCount: this.goodsData.length,
            totalElements: this.goodsResult.totalElements,
            loadStatus: this.loadStatus,
            newRecordsCount: result.length
          });
        } else {
          console.error('商品数据加载失败:', res.data);
          // 加载失败时重置状态
          if (this.enableBottomLoad) {
            this.loadStatus = 'more';
          }
          uni.showToast({
            title: res.data.message || '加载失败，请重试',
            icon: 'none',
            duration: 2000
          });
        }
      } catch (error) {
        console.error('商品数据加载异常:', error);
        // 加载异常时重置状态
        if (this.enableBottomLoad) {
          this.loadStatus = 'more';
        }
        uni.showToast({
          title: '加载失败，请重试',
          icon: 'none',
          duration: 2000
        });
      }
    },
    handleClickTitle(val, index) {
      this.selected.index = index;
      this.selected.val = val.title;
      if (val.bindCategory) {
        this.params.pageNumber = 1
        this.goodsData = []
        this.isInitialLoad = true; // 切换分类时重置为初始加载
        this.loadStatus = 'more'; // 重置加载状态
        this.initGoods(val);
      }
    },
  },
};
</script>
<style lang="scss" scoped>
$w_94: 94%;

.layout {
  padding: 8px 0;
  background: #f9f9f9;
}

.selected-title {
  > h4 {
    font-size: 30rpx;
    color: #000 !important;
  }

  > div {
    font-weight: bold;
    color: $main-color !important;
  }
}

.goods-cell-title {
  background: #f9f9f9;
  padding: 10px;
  transition: 0.35s;
  display: flex;

  > .goods-item-title {
    flex: 1;
    text-align: center;

    > h4 {
      font-size: 32rpx;
    }

    > div {
      color: #999;
      font-size: 24rpx;
    }
  }
}

.goods-list {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
}

.goods-item {
  width: 50%;
  margin-bottom: 10px;
  border-radius: 0.4em;
  overflow: hidden;
}

.goods-img {
  position: relative;
  margin: 0 auto;
  // width: 158px;
  width: $w_94;
  border-top-left-radius: 20rpx;
  border-top-right-radius: 20rpx;
  overflow: hidden;
  > img {
    width: 100%;
    height: 100%;
  }
}

.goods-desc {
  border-bottom-left-radius: 20rpx;
  border-bottom-right-radius: 20rpx;
  width: $w_94;
  background: #fff;
  padding: 8rpx 0 8rpx 8rpx;
  margin: 0 auto;
  > .goods-title {
    font-size: 24rpx;
    height: 67rpx;
    display: -webkit-box;
    font-weight: 500;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
  }

  > .goods-bottom {
    display: flex;
    font-weight: bold;
    > .goods-price {
      line-height: 2;
      color: $main-color;
      > span {
        font-size: 42rpx;
      }
    }
  }
}
</style>
