<template>
  <view>
    <!-- 订单状态 -->
    <div class="info-view order-view">
      <div class="order-status" v-if="orderStatusList[order.orderStatus]">
        {{ orderStatusList[order.orderStatus].title }}
        <div>{{ orderStatusList[order.orderStatus].value }}</div>
      </div>

    </div>
    <!-- 物流信息 -->
    <view class="info-view logistics-view">

      <view class="logistics-List">
        <view class="verificationCode" v-if="order.verificationCode">
          {{ $t('order.couponCode') }}： {{ order.orderStatus == 'CANCELLED' ?  $t('order.expired') : order.verificationCode }}
        </view>
		<view @click="handleClickDeliver()" class="info-view logi-view"  v-else-if="orderPackage && orderPackage.length">
		  <view class="verificationCode">
		      {{ $t('order.packageCount', {count: orderPackage.length}) }}
		  </view>
		  <div>
		      {{ $t('order.viewPackage') }}
		  </div>
		</view>
        <view v-else class="logistics-List-title">
          {{ $t('common.noData') }}
        </view>
      </view>

    </view>
    <!-- 地址 -->
    <view class="info-view" v-if="order.deliveryMethod === 'LOGISTICS' && order.orderType !== 'VIRTUAL'">
      <view class="address-view">
        <view>
          <view class="address-title">
            <span>{{ order.consigneeName || $t('user.noNickname') }}</span>
            <span>{{ order.consigneeMobile || $t('user.noMobile') | secrecyMobile }}</span>
          </view>
          <view class="address">{{ $t('user.address') }}：{{ order.consigneeAddressPath }}
            {{ order.consigneeDetail }}</view>
        </view>
      </view>
    </view>

    <!-- 提货地址 -->
    <view class="info-view" v-if="order.deliveryMethod === 'SELF_PICK_UP'">
      <view class="address-view">
        <view>
          <view class="order-info-view">
            <view class="title">{{ $t('address.pickUpAddress') }}:</view>
            <view class="value address-line-height">{{ order.storeAddressPath }}</view>
          </view>
          <view class="order-info-view" @click="callPhone" >
            <view class="title">{{ $t('address.phone') }}:</view>
            <view class="value">{{ order.storeAddressMobile }}<u-icon name='phone-fill' ></u-icon></view>
          </view>
         
        </view>
      </view>
    </view>

    <!-- 商品信息 -->
    <view>
      <view class="seller-view">
        <!-- 店铺名称 -->
        <view class="seller-info u-flex u-row-between">
          <view class="seller-name" @click="goToShopPage(order)">
            <view class="name">{{ order.storeName }}</view>
            <view class="status" v-if="orderStatusList[order.orderStatus]"> {{ orderStatusList[order.orderStatus].title
            }}</view>
          </view>
          <view class="order-sn"></view>
        </view>
        <view>
          <view v-for="(sku, skuIndex) in orderGoodsList" :key="skuIndex">
            <view class="goods-item-view">
              <view class="goods-img" @click="gotoGoodsDetail(sku)">
                <u-image border-radius="6" width="131rpx" height="131rpx" :src="sku.image"></u-image>
              </view>
              <view class="goods-info" @click="gotoGoodsDetail(sku)">
                <view class="goods-title u-line-2">{{ sku.goodsName }}</view>
                <view class="goods-price">
                  ￥{{ sku.goodsPrice | unitPrice }}
                  <!-- <span v-if="sku.point">+{{ sku.point }}猫币</span> -->
				  <span style="font-size: 24rpx;margin-left: 14rpx;color: #ff9900;" v-if="sku.isRefund && sku.isRefund !== 'NO_REFUND'">
				  {{refundPriceList(sku.isRefund)}} ({{ sku.refundPrice | unitPrice("￥") }})
				   </span>
                </view>
              </view>
              <view class="goods-num">
                <view>x{{ sku.num }}</view>

                <view class="good-complaint">
                  <u-tag size="mini" mode="plain" @click="complaint(sku)" v-if="sku.complainStatus == 'NO_APPLY'"
                    :text="$t('common.complaint')" type="info" />
                </view>
              </view>
            </view>

          </view>
        </view>
      </view>
    </view>
    <view class="info-view">
      <view>
        <view class="order-info-view">
          <view class="title">{{ $t('goods.totalPrice') }}：</view>
          <view class="value">￥{{ order.goodsPrice | unitPrice }}</view>
        </view>
        <view class="order-info-view" v-if="order.freightPrice">
          <view class="title">{{ $t('order.shippingFee') }}：</view>
          <view class="value">￥{{ order.freightPrice | unitPrice }}</view>
        </view>
        <view class="order-info-view" v-if="order.priceDetailDTO">
          <view class="title">{{ $t('user.coupon') }}：</view>
          <view class="value main-color">-￥{{ order.priceDetailDTO.couponPrice | unitPrice }}</view>
        </view>
        <view class="order-info-view">
          <view class="title">{{ $t('goods.promotion') }}：</view>
          <view class="value main-color">-￥{{ order.discountPrice | unitPrice }}</view>
        </view>
        <!-- <view class="order-info-view" v-if="order.use_point">
					<view class="title">使用猫币：</view>
					<view class="value">{{ order.use_point }}</view>
				</view> -->
      </view>
    </view>
    <!-- 客户服务， 售后，取消订单，查看物流，投诉等 -->
    <view class="info-view">
      <view style="width: 100%">
        <view class="order-info-view">
          <view class="title">{{ $t('user.service') }}</view>
        </view>
        <view class="customer-list">
          <view class="customer-service"
            v-if="orderDetail.allowOperationVO && orderDetail.allowOperationVO.cancel == true"
            @click="onCancel(order.sn)">{{ $t('order.cancel') }}</view>
          <view class="customer-service" v-if="order.orderStatus == 'DELIVERED'" @click="onLogistics(order)">{{ $t('order.viewLogistics') }}</view>
          <view class="customer-service" v-if="order.orderStatus != 'UNPAID' && order.orderPromotionType == 'PINTUAN'"
            @click="ByUserMessage(order)">{{ $t('order.viewPromotion') }}</view>
            <view class="customer-service"
            @click="contact(order.storeId)">{{ $t('user.service') }}</view>
        </view>
      </view>
    </view>
    <view class="info-view">
      <view style="width: 100%">
        <view class="order-info-view">
          <view class="title">{{ $t('order.orderNo') }}：</view>
          <view class="value">
            {{ order.sn }}
            <u-tag class="copy" :text="$t('common.copy')" type="info" size="mini" @click="onCopy(order.sn)" />
          </view>
        </view>
        <view class="order-info-view">
          <view class="title">{{ $t('order.orderTime') }}：</view>
          <view class="value">{{
              order.createTime
          }}</view>
        </view>
        <view class="order-info-view">
          <view class="title">{{ $t('order.remark') }}：</view>
          <view class="value">{{
              order.remark || $t('common.noData')
          }}</view>
        </view>
        <view class="order-info-view">
          <view class="title">{{ $t('order.payStatus') }}：</view>
          <view class="value">
            {{
                order.payStatus == "UNPAID"
                  ? "未付款"
                  : order.payStatus == "PAID"
                    ? "已付款"
                    : ""
            }}</view>
        </view>
        <view class="order-info-view">
          <view class="title">{{ $t('order.paymentMethod') }}：</view>
          <view class="value">{{ orderDetail.paymentMethodValue || $t('common.noData')}}</view>
        </view>
      </view>
    </view>

    <view class="info-view" v-if="order.payStatus == 'PAID'">
      <view>
        <view class="invoice-info-view">
          <view class="invoice-title">{{ $t('invoice.title') }}：</view>
          <view v-if="!order.needReceipt" class="value">{{ $t('invoice.notIssued') }}</view>
          <view v-else class="value" @click="onReceipt(orderDetail.receipt)">{{ $t('invoice.view') }}</view>
        </view>
      </view>
    </view>
    <view style="padding-bottom: 150rpx"></view>

    <view class="bottom_view">
      <view class="btn-view u-flex u-row-between">
        <view class="description">
          <!-- 全部 -->
          <!-- 等待付款 -->

          <text v-if="order.payStatus === 'PAID'">{{ $t('order.paidAmount') }}：</text>
          <text v-else>{{ $t('order.payableAmount') }}：</text>

          <text class="price" v-if="order.priceDetailDTO">￥{{ order.priceDetailDTO.flowPrice | unitPrice }}</text>
        </view>
        <view>
          <!-- 全部 -->
          <!-- 等待付款 -->
          <u-button type="error" ripple size="mini" v-if="orderDetail.allowOperationVO && orderDetail.allowOperationVO.pay"
            @click="toPay(order)">{{ $t('order.payment') }}</u-button>

          <!-- <u-button class="rebuy-btn" size="mini" v-if="order.order_operate_allowable_vo.allow_service_cancel"> 提醒发货</u-button> -->
          <!-- <div class="pay-btn">确认收货</div> -->
          <u-button shape="circle" ripple type="warning" size="mini" v-if="order.orderStatus == 'DELIVERED'"
            @click="onRog(order.sn)">{{ $t('order.confirm') }}</u-button>
          <!-- 交易完成 未评价 -->
          <u-button shape="circle" ripple size="mini" v-if="order.orderStatus == 'COMPLETE'"
            @click="onComment(order.sn)">{{ $t('review.writeReview') }}</u-button>
        </view>
      </view>
    </view>
    <u-popup class="cancel-popup" v-model="cancelShow" mode="bottom" length="60%">
      <view class="header">{{ $t('order.cancel') }}</view>
      <view class="body">
        <view class="title">{{ $t('order.cancelTips') }}</view>
        <view>
          <u-radio-group v-model="reason">
            <view class="value">
              <view class="radio-view" v-for="(item, index) in cancelList" :key="index">
                <u-radio :active-color="lightColor" label-size="25" shape="circle" :name="item.reason"
                  @change="reasonChange">{{ item.reason }}</u-radio>
              </view>
            </view>
          </u-radio-group>
        </view>
      </view>
      <view class="footer">
        <u-button size="medium" v-if="reason" shape="circle" @click="submitCancel">{{ $t('common.submit') }}</u-button>
      </view>
    </u-popup>
    <u-toast ref="uToast" />
    <u-modal v-model="rogShow" :show-cancel-button="true" :content="$t('order.confirmRogTips')" :confirm-color="lightColor"
      @confirm="confirmRog"></u-modal>

    <!-- 分享 -->
    <shares v-if="shareFlag" :thumbnail="orderDetail.orderItems[0].image"
      :goodsName="orderDetail.orderItems[0].goodsName" @close="shareFlag = false" />

  </view>
</template>

<script>
import { getExpress, getPackage } from "@/api/trade.js";
import { cancelOrder, confirmReceipt, getOrderDetail } from "@/api/order.js";

import shares from "@/components/m-share/index"; //分享

import { getClearReason } from "@/api/after-sale.js";

export default {
  components: {
    shares,
  },
  data() {
    return {
      lightColor: this.$lightColor,
      logisticsList: "", //物流信息
      shareFlag: false, //拼团分享开关
      orderStatusList: {
        UNPAID: {
          title: "未付款",
          value: "商品暂未付款",
        },
        PAID: {
          title: "已付款",
          value: "买家已付款",
        },
        UNDELIVERED: {
          title: "待发货",
          value: "商品等待发货中",
        },
        PARTS_DELIVERED: {
          title: "部分发货",
          value: "商品已部分发货。",
        },
        DELIVERED: {
          title: "已发货",
          value: "商品已发货,请您耐心等待",
        },
        CANCELLED: {
          title: "已取消",
          value: "订单已取消",
        },
        COMPLETED: {
          title: "已完成",
          value: "订单已完成,祝您生活愉快",
        },
        STAY_PICKED_UP: {
          title: "待自提",
          value: "商品正在等待提取",
        },
        TAKE: {
          title: "待核验",
        },
      },
      order: {},
      cancelShow: false, //取消订单
      orderSn: "",
      orderGoodsList: "", //订单中商品集合
      orderDetail: "", //订单详情信息
      sn: "",
      cancelList: "",
      rogShow: false,
      reason: "",
	  orderPackage:"",
    };
  },
  onLoad(options) {
    this.loadData(options.sn);
    this.sn = options.sn;
  },
  methods: {
	//获取包裹
	async getOrderPackage() {
		getPackage(this.order.sn).then(res => {
			if (res.data.success) {
				this.orderPackage = res.data.result
			}
		})
	},
	handleClickDeliver(){
		uni.navigateTo({
			url: `/pages/order/deliverDetail?order_sn=${this.order.sn}`,
		});
	},
	// 退款状态枚举
	refundPriceList(status) {
		switch (status) {
		case 'ALL_REFUND':
		  return "全部退款";
		case 'PART_REFUND':
		  return "部分退款";
		case 'NO_REFUND':
		  return "未退款";
		case 'REFUNDING':
		  return "退款中";
		default:
			return "";
		}
	},
    callPhone(){
      this.$options.filters.callPhone(this.order.storeAddressMobile )
    },
    //联系客服
    contact(storeId){
      this.$options.filters.talkIm(storeId)
    },
    goToShopPage(val) {
      uni.navigateTo({
        url: "/pages/product/shopPage?id=" + val.storeId,
      });
    },
    // 获取物流信息
    loadLogistics(sn) {
      getExpress(sn).then((res) => {
        this.logisticsList = res.data.result;
      });
    },

    // 分享当前拼团信息
    inviteGroup() {
      this.shareFlag = true;
    },
    // #TODO 这块需要写一下 目前没有拼团的详细信息
    ByUserMessage(order) {
      uni.navigateTo({
        url:
          "/pages/cart/payment/shareOrderGoods?sn=" +
          order.sn +
          "&sku=" +
          this.orderGoodsList[0].skuId +
          "&goodsId=" +
          this.orderGoodsList[0].goodsId,
      });
    },
    async loadData(sn) {
      uni.showLoading({
        title: "加载中",
      });
      getOrderDetail(sn).then((res) => {
        const order = res.data.result;
        this.order = order.order;
        this.orderGoodsList = order.orderItems;
        this.orderDetail = res.data.result;
        if (this.order.deliveryMethod === 'LOGISTICS') {
          this.loadLogistics(sn);
		  this.getOrderPackage();
        }
         if (this.$store.state.isShowToast){ uni.hideLoading() };
      });

    },
    onReceipt(val) {
      uni.navigateTo({
        url: "/pages/order/invoice/invoiceDetail?id=" + val.id,
      });
    },
    gotoGoodsDetail(sku) {
      uni.navigateTo({
        url: `/pages/product/goods?id=${sku.skuId}&goodsId=${sku.goodsId}`,
      });
    },
    onCopy(sn) {
      this.$options.filters.setClipboard(sn)
    },

    /**
     * 投诉
     */
    complaint(sku) {
      uni.navigateTo({
        url:
          "/pages/order/complain/complain?sn=" +
          this.sn +
          "&skuId=" +
          sku.skuId,
      });
    },
    //售后按钮
    onAfterSales(sn, sku) {
      uni.navigateTo({
        url: `./afterSales/afterSalesSelect?sn=${sn}&sku=${encodeURIComponent(
          JSON.stringify(sku)
        )}`,
      });
    },
    // 去支付
    toPay(val) {
      val.sn
        ? uni.navigateTo({
          url: "/pages/cart/payment/payOrder?order_sn=" + val.sn,
        })
        : false;
    }, //删除订单
    deleteOrder(index) {
      uni.showLoading({
        title: "请稍后",
      });
      setTimeout(() => {
        this.navList[this.tabCurrentIndex].orderList.splice(index, 1);
         if (this.$store.state.isShowToast){ uni.hideLoading() };
      }, 600);
    },
    //取消订单
    onCancel(sn) {
      this.orderSn = sn;

      uni.showLoading({
        title: "加载中",
      });
      getClearReason().then((res) => {
        if (res.data.result.length >= 1) {
          this.cancelList = res.data.result;
        }
         if (this.$store.state.isShowToast){ uni.hideLoading() };
      });

      this.cancelShow = true;
    },

    //提交取消订单（未付款）
    submitCancel() {
      cancelOrder(this.orderSn, { reason: this.reason }).then((res) => {
        if (res.data.success) {
          uni.showToast({
            title: "已取消",
            duration: 2000,
            icon: "none",
          });
          this.cancelShow = false;
          setTimeout(() => {
            uni.reLaunch({
              url: "/pages/order/myOrder?status=0",
            });
          }, 500);
        } else {
          uni.showToast({
            title: res.data.message,
            duration: 2000,
            icon: "none",
          });
          this.cancelShow = false;
        }
      });
    },

    //确认收货
    onRog(sn) {
      this.orderSn = sn;
      this.rogShow = true;
    },
    confirmRog() {
      confirmReceipt(this.orderSn).then((res) => {
        if (res.data.success) {
          uni.showToast({
            title: "已确认收货",
            duration: 2000,
            icon: "none",
          });
          this.rogShow = false;
          this.loadData(this.sn);
        }
      });
    },
    //评价商品
    onComment(sn) {
      uni.navigateTo({
        url: "./evaluate/myEvaluate",
      });
    }, //查看物流
    onLogistics(order) {
      uni.navigateTo({
        url:
          "/pages/mine/msgTips/packageMsg/logisticsDetail?logi_id=" +
          order.logi_id +
          "&ship_no=" +
          order.ship_no +
          "&order_sn=" +
          order.sn,
      });
    },

    //选择取消原因
    reasonChange(reason) {
      this.reason = reason;
    },
    reBuy(order) {
      uni.navigateTo({
        url:
          "/pages/product/goods?id=" + order.id + "&goodsId=" + order.goodsId,
      });
    },
  },
};
</script>

<style lang="scss">
@import "./goods.scss";

.empty {
  width: 100%;
}

.customer-service {
  background: #ededed;
  // padding: 12rpx 40rpx;
  width: 48%;
  margin: 0 1%;
  height: 55rpx;
  line-height: 55rpx;
  margin-bottom: 10rpx;
  text-align: center;
  font-size: 24rpx;
  border-radius: 10rpx;
}

.customer-list {
  display: flex;
  flex-wrap: wrap;
}

.logistics-view {
  justify-content: space-between;
  padding: 30rpx !important;
  margin: 0 !important;
  transform: translateY(-10px);
}

.order-status {
  color: #fff;
  width: 100%;
  text-align: center;
  font-size: 36rpx;
  margin-top: 40rpx;

  >div {
    font-size: 24rpx;
    margin-top: 10rpx;
  }
}

.logistics-List-title {
  margin-bottom: 10rpx;
  font-size: 26rpx;
}

.logistics-List-time {
  font-size: 24rpx;
  color: #999;
}

.info-detail {
  margin-right: 30rpx;
  color: #333;
}

.order-view {
  margin: 0 !important;
  border-radius: 0 !important;
  width: 100%;
  height: 200rpx;
  padding: 0 !important;
  background-image: linear-gradient(to right,
      $light-color 0%,
      $aider-light-color 100%) !important;
}

page,
.content {
  background: #f1f1f1;
  height: 100%;
}

.info-line {
  align-items: center;
  display: flex;
  border-radius: 30rpx;
  flex-direction: row;
  justify-content: space-between;
  background-color: #fff;
  width: 100%;
  height: 110rpx;
  color: #333333;
  font-size: 28rpx;
  border-bottom: 1rpx solid #eeeeee;

  .info-title {
    margin: 0 30rpx;
    padding: 16rpx 0rpx;
  }
}

.seller-view {
  margin: 20rpx 0;
  padding: 15rpx 0;
  border-radius: 30rpx;
}

.address-title {
  font-size: 26rpx;
  font-weight: bold;

  >span {
    margin-right: 20rpx;
  }
}

.info-view {
  display: flex;
  margin: 0 0 20rpx 0;
  border-radius: 30rpx;
  flex-direction: row;
  padding: 15rpx 30rpx;
  margin-bottom: 20rpx;
  background-color: #fff;

  .address-view {
    display: flex;
    flex-direction: row;
    padding: 16rpx 0;

    .address {
      color: $font-color-light;
      overflow: hidden;
      line-height: 1.75;
      font-size: 22rpx;
    }
  }

  .order-info-view {
    line-height: 60rpx;
    display: flex;
    flex-direction: row;
    width: 100%;
    margin: 10rpx 0rpx;

    .title {
      color: #666;
      width: 140rpx;
      font-size: 24rpx;
      font-weight: 600;
      flex:3;
      min-width: 160rpx;
    }

    .value {
      color: #666;
      font-size: 24rpx;
      flex:10;
    }

    .copy {
      font-size: 20rpx;
      color: #333;
      border: 1px solid #dddddd;
      margin-left: 30rpx;
    }
  }

  .invoice-info-view {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    width: 100%;
    margin: 10rpx 0rpx;

    .invoice-title {
      width: 550rpx;
      font-size: 28rpx;
      color: #333333;
    }

    .value {
      color: $font-color-light;
    }
  }
}

.verificationCode {
  font-weight: bold;
  letter-spacing: 2rpx;
}

.bottom_view {
  width: 100%;
  height: 100rpx;
  background-color: #ffffff;
  position: fixed;
  bottom: 0;
  left: 0;

  .btn-view {
    padding: 0 30rpx;
    line-height: 100rpx;
    font-size: 26rpx;

    .description {
      color: #909399;
      size: 25rpx;

      .price {
        color: $main-color;
      }
    }
  }

  .cancel-btn {
    color: #999999;
    border-color: #999999;
    margin-left: 15rpx;
    height: 60rpx;
  }
}

.cancel-popup {
  .header {
    display: flex;
    flex-direction: row;
    justify-content: center;
    margin: 15rpx 0rpx;
  }

  .body {
    padding: 30rpx;

    .title {
      font-weight: 600;
    }

    .value {
      display: flex;
      flex-direction: column;

      .radio-view {
        margin: 10rpx 0rpx;
      }
    }
  }

  .footer {
    text-align: center;
  }
}
.address-line-height{
  line-height: 1.75;
}
.seller-name{
  >.name{
    flex:10 !important;
  }
  >.status{
    flex:2;
  }
}
</style>
