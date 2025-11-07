<template>
  <view class="content">
    <u-navbar :title="$t('points.title')" :is-back="true"></u-navbar>
    
    <view class="portrait-box">
      <image src="/static/pointTrade/point_bg_1.png" mode=""></image>
      <image class="point-img" src="/static/pointTrade/tradehall.png" />
      <view class="position-point">
        <view class="balance-display">
          <text class="balance-label">{{ $t('points.available') }}</text>
          <text class="balance-amount">{{ pointData.point || 0 }}</text>
        </view>
      </view>
    </view>
    
    <u-row class="portrait-box2">
      <u-col span="6" class="portrait-box2-col" :gutter="16">
        <text>{{ $t('points.total') }}：</text>
        <text class="pcolor">{{ pointData.totalPoint || 0 }}</text>
      </u-col>
      <u-col span="6" class="portrait-box2-col">
        <text>{{ $t('points.used') }}：</text>
        <text class="pcolor">{{ (pointData.totalPoint || 0) - (pointData.point || 0) }}</text>
      </u-col>
    </u-row>

    <!-- 操作按钮 -->
    <view class="action-buttons">
      <button class="action-btn" @click="navigateTo('/pages/promotion/point/pointList')">
        <u-icon name="shopping-cart" size="36"></u-icon>
        <text>{{ $t('points.pointsMall') }}</text>
      </button>
      <button class="action-btn" @click="showPointsRule">
        <u-icon name="info-circle" size="36"></u-icon>
        <text>{{ $t('points.pointsRule') }}</text>
      </button>
    </view>

    <!-- 喵币明细 -->
    <view class="section-title">{{ $t('points.pointsDetail') }}</view>
    <div class="point-list">
      <view v-if="pointList.length === 0" class="empty-state">
        <u-empty mode="list" :text="$t('points.noRecord')"></u-empty>
      </view>
      <view class="point-item" v-for="(item, index) in pointList" :key="index">
        <view>
          <view class="point-label">{{ item.content }}</view>
          <view class="point-time">{{ item.createTime}}</view>
        </view>
        <view :class="[item.pointType == 'INCREASE' ? 'plus' : 'reduce']">
          <span>{{item.pointType == "INCREASE" ? '+' : '-'}}</span>{{ item.variablePoint }}
        </view>
      </view>
      <uni-load-more :status="count.loadStatus"></uni-load-more>
    </div>
  </view>
</template>

<script>
import { getPointsData } from "@/api/members.js";
import { getMemberPointSum } from "@/api/members.js";
export default {
  data() {
    return {
      count: {
        loadStatus: "more",
      },
      pointList: [], //喵币数据集合
      params: {
        pageNumber: 1,
        pageSize: 10,
      },
      pointData: {}, //累计获取 未输入 集合
    };
  },

  onLoad() {
    this.initPointData();
    this.getList();
  },

  /**
   * 触底加载
   */
  onReachBottom() {
    this.params.pageNumber++;
    this.getList();
  },
  methods: {
    /**
     * 获取喵币数据
     */
    getList() {
      let params = this.params;
      uni.showLoading({
        title: this.$t('common.loading'),
      });
      getPointsData(params).then((res) => {
         if (this.$store.state.isShowToast){ uni.hideLoading() };
        if (res.data.success) {
          let data = res.data.result.records;
          if (data.length < 10) {
            this.$set(this.count, "loadStatus", "noMore");
            this.pointList.push(...data);
          } else {
            this.pointList.push(...data);
            if (data.length < 10) this.$set(this.count, "loadStatus", "noMore");
          }
        }
      });
    },

    /**
     * 获得累计喵币使用
     */
    initPointData() {
      getMemberPointSum().then((res) => {
        this.pointData = res.data.result;
      });
    },
    
    /**
     * 页面跳转
     */
    navigateTo(url) {
      uni.navigateTo({ url });
    },
    
    /**
     * 显示喵币规则
     */
    showPointsRule() {
      uni.showModal({
        title: this.$t('points.pointsRule'),
        content: '1. 购物即可获得喵币奖励\n2. 签到、评价、邀请好友也可获得喵币\n3. 喵币可兑换商品或提现\n4. 喵币永久有效，不会过期',
        showCancel: false,
        confirmText: this.$t('common.confirm')
      });
    }
  },
};
</script>

<style lang="scss" scoped>
.point-list{
  margin-top: 50rpx;
}
.title {
  height: 80rpx;
  text-align: center;
  line-height: 80rpx;
  font-size: 32rpx;
  font-weight: bold;
}
.plus{
  color: $light-color;
  font-weight: bold;
}
.reduce{
  color: $weChat-color;
  font-weight: bold;
}

.point-item {
  width: 100%;
  height: 130rpx;
  padding: 0 20rpx;
  background: #ffffff;
  font-size: $font-sm;
  border-bottom: 1px solid $border-color-light;
  display: flex;
  justify-content: end;
  align-items: center;
  > view:nth-child(1) {
    flex: 1;
    line-height: 40rpx;
    view {
      color: #666666;
    }
    :last-child {
      color: #999;
    }
  }

  > view:nth-child(2) {
    width: 100rpx;
    text-align: center;
  }
}

.portrait-box2 {
  height: 100rpx;
  background: #ffffff;
  border-radius: 0 0 20rpx 20rpx;
  margin: 0 20rpx;
  font-size: 26rpx;
  ::v-deep  .u-col {
    text-align: center !important;
  }
  ::v-deep  .u-col:first-child {
    border-right: 1px solid $border-color-light;
  }
  .pcolor {
    color: $light-color;
  }
}

.content {
  background: #f9f9f9;
}

.more {
  text-align: right;
  color: $u-tips-color;
  font-size: 24rpx;
  padding-right: 40rpx !important;
}

.portrait-box {
  background-color: $main-color;
  height: 280rpx;
  background: linear-gradient(135deg, $light-color 0%, $aider-light-color 100%);
  border-radius: 20rpx 20rpx 0 0;
  margin: 20rpx 20rpx 0;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #ffffff;

  > image:first-child {
    width: 263rpx;
    height: 250rpx;
    position: absolute;
    left: 0;
    bottom: 0;
    transform: rotateY(180deg);
    opacity: 0.3;
  }

  .position-point {
    position: relative;
    z-index: 10;
    
    .balance-display {
      text-align: center;
      
      .balance-label {
        display: block;
        font-size: 28rpx;
        color: #fff;
        opacity: 0.9;
        margin-bottom: 10rpx;
      }
      
      .balance-amount {
        display: block;
        font-size: 64rpx;
        font-weight: bold;
        color: #fff;
        text-shadow: 0 4rpx 8rpx rgba(0,0,0,0.1);
      }
    }
  }
  
  .point-img {
    height: 108rpx;
    width: 108rpx;
    margin-bottom: 20rpx;
  }
  
}
.point-label{
    font-weight: bold;
    margin-bottom: 10rpx;
}

.point-time {
  font-size: 24rpx;
  color: #999;
  margin-top: 5rpx;
}

/* 操作按钮 */
.action-buttons {
  display: flex;
  gap: 20rpx;
  padding: 30rpx 20rpx;
  background: #fff;
  margin: 0 20rpx;
  border-radius: 0 0 20rpx 20rpx;
  
  .action-btn {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 25rpx 0;
    background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
    border-radius: 15rpx;
    border: none;
    
    &::after {
      border: none;
    }
    
    text {
      margin-top: 10rpx;
      font-size: 26rpx;
      color: #333;
    }
  }
}

/* 区块标题 */
.section-title {
  padding: 30rpx 20rpx 20rpx;
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  background: #f9f9f9;
}

/* 空状态 */
.empty-state {
  padding: 80rpx 0;
  background: #fff;
}
</style>
