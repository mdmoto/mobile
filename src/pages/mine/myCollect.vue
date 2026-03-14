<template>
	<view class="content">
		<u-navbar>
			<u-tabs :active-color="lightColor"  class="slot-wrap" :list="navList" count="count" :is-scroll="true" :current="tabCurrentIndex" @change="tabClick"></u-tabs>
		</u-navbar>
		<view class="swiper-box">
			<!-- 显示商品栏 -->
			<view v-if="tabCurrentIndex == 0" class="tab-content">
				<scroll-view class="list-scroll-content" scroll-y>
					<!-- 空白页 -->
					<u-empty style="margin-top: 40rpx" text="暂无收藏商品数据" mode="favor" v-if="goodsEmpty"></u-empty>
					<!-- 商品展示数据 -->
					<u-swipe-action @open="openLeftChange(item, index, 'goods')" :show="item.selected" btn-width="180"
						:options="LeftOptions" v-else v-for="(item, index) in goodList"
						@click="clickGoodsSwiperAction(item, index)" :index="index" :key="index">
						<view class="goods" @click="goGoodsDetail(item)">
							<u-image width="131rpx" height="131rpx" :src="item.image" mode="aspectFit">
								<u-loading-icon slot="loading"></u-loading-icon>
							</u-image>
							<view class="goods-intro">
								<view>{{ item.goodsName }}</view>
								<view class="goods-sn">{{ item.goods_sn }}</view>
								<view>{{ unitPrice(item.price, undefined, 'before') }}.<span style="font-size: 24rpx">{{ unitPrice(item.price, undefined, 'after') }}</span></view>
							</view>
						</view>
					</u-swipe-action>

				</scroll-view>
			</view>
			<!-- 显示收藏的店铺栏 -->
			<view v-else class="tab-content">
				<scroll-view class="list-scroll-content" scroll-y>
					<!-- 空白页 -->
					<u-empty style="margin-top: 40rpx" text="暂无收藏店铺数据" mode="favor" v-if="storeEmpty"></u-empty>
					<!-- 店铺展示数据 -->
					<u-swipe-action @open="openLeftChange(item, 'store')" :show="item.selected" btn-width="180"
						:options="LeftOptions" v-else v-for="(item, index) in storeList" :key="index"
						@click="clickStoreSwiperAction(item)">
						<view class="store" @click="goStoreMainPage(item.id)">
							<view class="intro">
								<view class="store-logo">
									<u-image width="102rpx" height="102rpx" :src="item.storeLogo" :alt="item.storeName"
										mode="aspectFit">
										<u-loading-icon slot="loading"></u-loading-icon>
									</u-image>
								</view>
								<view class="store-name">
									<view>{{ item.storeName }}</view>
									<u-tag size="mini" type="error" :color="$mainColor" v-if="item.selfOperated"
										text="自营" mode="plain" shape="circle" />
								</view>
								<view class="store-collect">
									<view>进店逛逛</view>
								</view>
							</view>
						</view>
					</u-swipe-action>
				</scroll-view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		getGoodsCollection,
		getStoreCollection,
		deleteGoodsCollection,
		deleteStoreCollection,
	} from "@/api/members.js";
	export default {
		data() {
			return {
        lightColor:this.$lightColor,
				// 商品左滑侧边栏
				LeftOptions: [{
					text: "取消",
					style: {
						backgroundColor: this.$lightColor,
					},
				}, ],
				tabCurrentIndex: 0, //tab的下标默认为0，也就是说会默认请求商品
				navList: [
					//tab显示数据
					{
						name: "商品(0)",
					
						params: {
							pageNumber: 1,
							pageSize: 10,
						},
					},
					{
						name: "店铺(0)",
					
						params: {
							pageNumber: 1,
							pageSize: 10,
						},
					},
				],
			
				goodsEmpty: false, //商品数据是否为空
				storeEmpty: false, //店铺数据是否为空
				goodList: [], //商品集合
				storeList: [], //店铺集合
			};
		},
		onShow() {
			this.fetchReloadOrNextPage('reload')
		},
		onReachBottom() {
			this.fetchReloadOrNextPage('next')
		},

		methods: {
			// 刷新或者下一页
			fetchReloadOrNextPage(type) {
				if(type == 'next'){
					this.navList[this.tabCurrentIndex].params.pageNumber ++;
					if (this.tabCurrentIndex == 0) {
					this.getGoodList();
					} else {
						this.getStoreList();
					}
				}
				else{
					this.navList[0].params.pageNumber = 1;
					this.navList[1].params.pageNumber = 1;
					this.goodList = [];
					this.storeList = [];
					this.getGoodList();
					this.getStoreList();
				}
			},

			/**
			 * 打开商品左侧取消收藏
			 */
			openLeftChange(val, type) {
				const {
					goodList,
					storeList
				} = this;
				let way;
				type == "goods" ? (way = goodList) : (way = storeList);
				way.forEach((item) => {
					this.$set(item, "selected", false);
				});
				this.$set(val, "selected", false);
				val.selected = true;
			},

			/**
			 * 点击商品左侧取消收藏
			 */
			clickGoodsSwiperAction(val) {
				deleteGoodsCollection(val.skuId).then((res) => {
					if (res.statusCode == 200) {
						this.storeList = [];
						this.goodList = [];
						this.getGoodList();
					}
				});
			},

			/**
			 * 点击店铺左侧取消收藏
			 */
			clickStoreSwiperAction(val) {
				deleteStoreCollection(val.id).then((res) => {
					if (res.statusCode == 200) {
						this.storeList = [];
						this.getStoreList();
					}
				});
			},

			/**
			 * 顶部tab点击
			 */
			tabClick(index) {
				this.tabCurrentIndex = index;
			},

			/**
			 * 查看商品详情
			 */
			goGoodsDetail(val) {
				//商品详情
				uni.navigateTo({
					url: "/pages/product/goods?id=" + val.skuId + "&goodsId=" + val.goodsId,
				});
			},

			/**
			 * 查看店铺详情
			 */
			goStoreMainPage(id) {
				//店铺主页
				uni.navigateTo({
					url: "/pages/product/shopPage?id=" + id,
				});
			},

			/**
			 * 获取商品集合
			 */
			getGoodList() {
				uni.showLoading({
					title: "加载中",
				});
				getGoodsCollection(this.navList[0].params, "GOODS").then((res) => {
					 if (this.$store.state.isShowToast){ uni.hideLoading() };
					uni.stopPullDownRefresh();
					if (res.data.success) {
						let data = res.data.result;
						data.selected = false;
						  this.navList[0].name = `商品(${data.total})`;
          
						if (data.total == 0) {
							this.goodsEmpty = true;
						} else if (data.total < 10) {
							this.goodsLoad = "noMore";
							this.goodList.push(...data.records);
						} else {
							this.goodList.push(...data.records);
							if (data.total.length < 10) this.goodsLoad = "noMore";
						}
					}
				});
			},

			/**
			 * 获取店铺集合
			 */
			getStoreList() {
				uni.showLoading({
					title: "加载中",
				});
				getStoreCollection(this.navList[1].params, "STORE").then((res) => {
					 if (this.$store.state.isShowToast){ uni.hideLoading() };
					uni.stopPullDownRefresh();
					if (res.data.success) {
						let data = res.data.result;
						data.selected = false;
						 this.navList[1].name = `店铺(${data.total})`;
						if (data.total == 0) {
							this.storeEmpty = true;
						} else if (data.total < 10) {
						
							this.storeList.push(...data.records);
						} 
					}
				});
			},
		},

		/**
		 * 下拉刷新时
		 */
		onPullDownRefresh() {
			if (this.tabCurrentIndex == 0) {
				this.navList[0].params.pageNumber = 1;
				this.goodList = [];
				this.getGoodList();
			} else {
				this.navList[1].params.pageNumber = 1;
				this.storeList = [];
				this.getStoreList();
			}
		},
	};
</script>

<style lang="scss">
	page,
	.content {
		background: $page-color-base;
		height: 100%;
	}

  .slot-wrap{
    flex: 1;
    display: flex;
    justify-content: center;
    padding-right: 72rpx;
  }

	.content {
		width: 100%;
	}

	.swiper-box {
		overflow-y: auto;
	}

	.list-scroll-content {
		height: 100%;
		width: 100%;
	}

	::v-deep  .u-swipe-content {
		overflow: hidden;
	}

	.goods {
		background-color: #fff;
		border-bottom: 1px solid $border-color-light;
		height: 190rpx;
		display: flex;
		align-items: center;
		padding: 30rpx 20rpx;
		margin-top: 20rpx;

		image {
			width: 131rpx;
			height: 131rpx;
			border-radius: 10rpx;
		}

		.goods-intro {
			flex: 1;
			font-size: $font-base;
			line-height: 48rpx;
			margin-left: 30rpx;

			view:nth-child(1) {
				line-height: 1.4em;
				font-size: 24rpx;
				max-height: 2.8em; //height是line-height的整数倍，防止文字显示不全
				overflow: hidden;
				color: #666;
			}

			view:nth-child(2) {
				color: #cccccc;
				font-size: 24rpx;
			}

			view:nth-child(3) {
				color: $light-color;
			}
		}

		button {
			color: $main-color;
			height: 50rpx;
			width: 120rpx;
			font-size: $font-sm;
			padding: 0;
			line-height: 50rpx;
			background-color: #ffffff;
			margin-top: 80rpx;

			&::after {
				border-color: $main-color;
			}
		}
	}

	.store {
		background-color: #fff;
		border: 1px solid $border-color-light;
		border-radius: 16rpx;
		margin: 20rpx 10rpx;

		.intro {
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 0 30rpx 0 40rpx;
			height: 170rpx;

			.store-logo {
				width: 102rpx;
				height: 102rpx;
				border-radius: 50%;
				overflow: hidden;

				image {
					width: 100%;
					height: 100%;
					border-radius: 50%;
				}
			}

			.store-name {
				flex: 1;
				margin-left: 30rpx;
				line-height: 2em;

				:first-child {
					font-size: $font-base;
				}

				:last-child {
					font-size: $font-sm;
					color: #999;
				}
			}

			.store-collect {
				border-left: 1px solid $border-color-light;
				padding-left: 20rpx;
				text-align: center;

				:last-child {
					color: #999;
					font-size: $font-sm;
				}
			}
		}
	}

	.navbar {
		display: flex;
		height: 40px;
		padding: 0 5px;
		background: #fff;
		box-shadow: 0 1px 5px rgba(0, 0, 0, 0.06);
		position: relative;
		z-index: 10;

		.nav-item {
			flex: 1;
			display: flex;
			justify-content: center;
			align-items: center;
			height: 100%;
			font-size: 26rpx;

			text {
				position: relative;
			}

			text.current {
				color: $light-color;
				font-weight: bold;
				font-size: 28rpx;

				&::after {
					content: "";
					position: absolute;
					left: 20rpx;
					bottom: -10rpx;
					width: 30rpx;
					height: 0;
					border-bottom: 2px solid $light-color;
				}
			}
		}
	}
</style>
