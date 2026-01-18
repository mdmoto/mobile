<template>
  <view>
    <!-- 常用工具 -->
    <view class="interact-tools" style="margin-bottom: 15px">

      <div class="paddingBox">
        <view class="interact-container">
		<view class="interact-item" @click="navigateTo('/pages/mine/address/addressManage')">
		  <image src="/static/mine/myaddress.png" mode=""></image>
		  <view>{{ $t('address.title') }}</view>
		</view>
		
		<view class="interact-item" @click="navigateTo('/pages/mine/myTracks')">
		  <image src="/static/mine/logistics.png" mode=""></image>
		  <view>{{ $t('user.footprint') }}</view>
		</view>
	
		<view class="interact-item" @click="navigateTo('/pages/order/evaluate/myEvaluate')">
		  <image src="/static/mine/feedback.png" mode=""></image>
		  <view>{{ $t('review.myReview') }}</view>
		</view>
			<!-- <view class="interact-item" @click="linkMsgDetail()">
			  <image src="/static/mine/mycommit.png" mode=""></image>
			  <view>我的消息</view>
			</view> -->
		
		
		<view class="interact-item" @click="navigateTo('/pages/mine/myCollect')">
		  <image src="/static/mine/myfavorite.png" mode=""></image>
		  <view>{{ $t('user.collection') }}</view>
		</view>
		
		
		
		<view class="interact-item" @click="navigateTo('/pages/mine/point/myPoint')">
		  <image src="/static/mine/mypoint.png" mode=""></image>
		  <view>{{ $t('points.myPoints') }}</view>
		</view>
		
		<view class="interact-item" @click="distribution">
		  <image src="/static/mine/distribution.png" mode=""></image>
		  <view>{{ $t('common.distribution') }}</view>
		</view>
		
		
		
		<view class="interact-item" @click="navigateTo('/pages/order/complain/complainList')">
		  <image src="/static/mine/shensu.png" mode=""></image>
		  <view>{{ $t('common.complaint') }}</view>
		</view>
			   
		<view class="interact-item" @click="navigateTo('/pages/cart/coupon/myCoupon')">
		  <image src="/static/mine/mycoupon.png" mode=""></image>
		  <view>{{ $t('user.coupon') }}</view>
		</view>
			
		
			        
					
          <view class="interact-item" @click="navigateTo('/pages/mine/signIn')">
            <image src="/static/mine/sign.png" mode=""></image>
            <view>{{ $t('points.dailyCheckIn') }}</view>
          </view>
         
         
       
          

      
          <view class="interact-item" @click="navigateTo('/pages/cart/coupon/couponCenter')">
            <image src="/static/mine/couponcenter.png" mode=""></image>
            <view>{{ $t('address.couponCenter') }}</view>
          </view>
          
         
          
          <view class="interact-item" @click="navigateTo('/pages/promotion/bargain/log')">
            <image src="/static/mine/kanjia.png" mode=""></image>
            <view>{{ $t('address.bargainHistory') }}</view>
          </view>
		  
		
		  
          <view class="interact-item" @click="navigateTo('/pages/mine/set/feedBack')">
            <image src="/static/mine/feedback.png" mode=""></image>
            <view>{{ $t('user.feedback') }}</view>
          </view>
          
          <view class="interact-item" @click="navigateTo('/pages/mine/set/editionIntro')">
            <image src="/static/mine/pointgift.png" mode=""></image>
            <view>{{ $t('user.about') }}</view>
          </view>
          
          <view class="interact-item" @click="navigateTo('/pages/passport/entry/seller/index')">
            <image src="/static/mine/feedback.png" mode=""></image>
            <view>{{ $t('address.sellerEntry') }}</view>
          </view>
          
          
<!--          <view class="interact-item" @click="inviter()">-->
<!--          	<image src="/static/mine/share.png" mode=""></image>-->
<!--          	<view>邀新</view>-->
<!--          </view>-->
          <view class="interact-item" @click="navigateTo('/pages/mine/set/setUp')">
            <image src="/static/mine/setting.png" mode=""></image>
            <view>{{ $t('user.settings') }}</view>
          </view>
        
		  
        </view>
      </div>
	  
	  			<template>
	  				<u-popup v-model="sharingShow" mode="bottom" border-radius="14">
	  					<view style="margin: 10px; text-align: center;"> {{ $t('address.sharingTips') }} </view>
	  					<view class='qrcode'>
	  						<uqrcode ref="uqrcode" canvas-id="qrcode" :value="sharingLink" :options="{ margin: 10 }">
	  						</uqrcode>
	  					</view>
	  
						  <view class="copy-text" @click="getDetail(sharingLink)">
							{{sharingLink}}
						  </view>
	  					<view class="confrim-btn">
	  						<u-button @click="sharingShow = false;">{{ $t('address.close') }}</u-button>
	  					</view>
	  				</u-popup>
	  			</template>
    </view>
  </view>
</template>

<script>
import { distribution } from "@/api/goods";
import configs from "@/config/config";
import storage from "@/utils/storage";

export default {
  data() {
	return {
			configs,
			storage,
			repayingShow: false, //分销清退弹框
			sharingShow: false,
			sharingLink: ""
	  }
  },
	
  methods: {
  	handleNavigate(url) {
			uni.navigateTo({
				url,
			});
		},
		inviter() {
			if (storage.getUserInfo().id) {
				this.sharingLink = this.configs.shareLink + "?inviter=" + this.storage.getUserInfo().id
				this.sharingShow = true
			} else {
				uni.showToast({
					title: this.$t('message.pleaseLogin'),
					duration: 2000,
					icon: "none",
				});
			}
		},
    navigateTo(url) {
      const ignores = [
				'/pages/mine/set/setUp',
				'/pages/mine/set/editionIntro',
				'/pages/mine/set/feedBack'
			]
			if (!ignores.includes(url)) {
				if (this.$options.filters.tipsToLogin('normal')) {
					this.handleNavigate(url)
				}
			}
			else {
				this.handleNavigate(url)
			}
    },
	
	linkMsgDetail(){
		uni.navigateTo({
				url: `/pages/mine/im/list`,
		});
	},
	
    distribution() {
      distribution().then((res) => {
        if (res.data.result) {
          let type = res.data.result.distributionStatus;
          if (type == "PASS") {
            uni.navigateTo({
              url: "/pages/mine/distribution/home",
            });
          } else if (type == "REFUSE") {
            uni.navigateTo({
              url: "/pages/mine/distribution/auth",
            });
          } else if (type == "RETREAT") {
            uni.showToast({
              title: this.$t('distribution.retreatTips'),
              duration: 2000,
              icon: "none",
            });
          } else {
            uni.showToast({
              title: this.$t("distribution.auditTips"),
              duration: 2000,
              icon: "none",
            });
          }
        } else if (!res.data.success && res.data.code == 22000) {
          uni.showToast({
            title: this.$t("distribution.notOpenTips"),
            duration: 2000,
            icon: "none",
          });
        } else {
          // 没有资格申请 先去实名认证
          uni.navigateTo({
            url: "/pages/mine/distribution/auth",
          });
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.copy-text {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 10px;
  line-break: anywhere;
}

.interact-tools {
	border-left: none;
	border-right: none;


	.interactBox {
		height: 156rpx;
	}

	.interact-container {
		margin: 0 20rpx;
		background: #fff;
		border-radius: 20rpx;
		box-shadow: 0 4rpx 24rpx 0 rgba($color: #f6f6f6, $alpha: 1);

		.interact-item-img {
			width: 52rpx !important;
			height: 52rpx !important;
			// margin-bottom:  !important;
			margin: 0 auto 6rpx auto !important;
		}

		image {
			width: 52rpx;
			height: 52rpx;
			margin-bottom: 6rpx;
		}

		display: flex;
		align-items: center;
		flex-wrap: wrap;
		text-align: center;

		.interact-item {
			font-size: $font-sm;
			width: 25%;
			height: 160rpx;
			padding: 30rpx;
		}
	}
}

.qrcode {
	margin: 0 auto;
	width: 200px;
}
</style>
