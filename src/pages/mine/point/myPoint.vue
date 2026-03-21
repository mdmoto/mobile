<template>
  <view class="content">
    <u-navbar :title="$t('points.title')" :is-back="true"></u-navbar>
    
    <!-- 头部余额展示 -->
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
    
    <!-- 统计数据 -->
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

    <!-- 钱包绑定状态 (引导注册/绑定) -->
    <view class="wallet-status-card" v-if="!walletAddress">
      <view class="status-info">
        <u-icon name="warning-fill" color="#f29100" size="40"></u-icon>
        <view class="address-info">
          <text class="status-text">未绑定 Solana 钱包</text>
          <text class="status-desc">绑定后即可将积分兑现为 $MAO</text>
        </view>
      </view>

      <!-- #ifdef MP-WEIXIN -->
      <!-- 微信小程序端降级为直接手动输入，避开唤起拦截 -->
      <button class="bind-btn" @click="fallbackManualInput">
        <u-icon name="edit-pen" size="28" color="#fff" style="margin-right: 10rpx;"></u-icon>
        <text>手动填入钱包地址</text>
      </button>
      <text class="manual-tips">微信环境暂不支持插件唤起，请手动填写</text>
      <!-- #endif -->

      <!-- #ifndef MP-WEIXIN -->
      <button class="bind-btn" @click="handleConnectWallet">
        <u-icon name="plus" size="28" color="#fff" style="margin-right: 10rpx;"></u-icon>
        <text>一键连接 Phantom 钱包</text>
      </button>
      <text class="manual-entry" @click="fallbackManualInput">或手动输入地址</text>
      <!-- #endif -->
    </view>
    <view class="wallet-status-card active" v-else>
      <view class="status-info">
        <u-icon name="checkmark-circle-fill" color="#19be6b" size="40"></u-icon>
        <view class="address-info">
          <text class="status-text">已连接：{{ formattedWalletAddress }}</text>
          <text class="disconnect-link" @click="handleDisconnect">断开连接</text>
        </view>
      </view>
    </view>

    <!-- 兑换控制台 (Exchange Console) -->
    <view class="exchange-console">
      <view class="console-header">
        <text class="console-title">$MAO 兑换控制台</text>
        <view class="rule-link" @click="openExternalRule">
          <u-icon name="question-circle" size="28" color="#999"></u-icon>
          <text>{{ $t('points.pointsRule') }}</text>
        </view>
      </view>

      <view class="exchange-input-box">
        <view class="input-header">
          <text>输入兑换积分数量</text>
          <text class="all-in" @click="maxExchange">全部兑换</text>
        </view>
        <u-input v-model="exchangeAmount" type="number" placeholder="0.000000" :border="false" />
      </view>

      <view class="exchange-estimate" v-if="exchangeAmount > 0">
        <text>预计可得：</text>
        <text class="estimate-value">{{ estimatedMao }} $MAO</text>
      </view>

      <button class="main-exchange-btn" :disabled="!walletAddress || exchangeAmount <= 0" @click="handleExchange">
        <text>立即兑换 $MAO</text>
      </button>

      <view class="exchange-tips">
        <text>* 兑换将根据当前全站实时汇率进行折算</text>
        <text>* $MAO 将直接发放至您的绑定钱包地址</text>
      </view>
    </view>

    <!-- 积分明细 -->
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
import { getPointsData, getMemberPointSum } from "@/api/members.js";
import { getMaoMallRates, applyMaoMallExchange } from "@/api/maollar.js";
import { connectPhantom, disconnectPhantom } from "@/utils/solana.js";
import storage from "@/utils/storage.js";

export default {
  data() {
    return {
      count: {
        loadStatus: "more",
      },
      pointList: [], 
      params: {
        pageNumber: 1,
        pageSize: 10,
      },
      pointData: {}, 
      walletAddress: storage.getWalletAddress() || "", 
      exchangeAmount: "",
      currentRate: 1000.0, // 默认汇率
    };
  },

  computed: {
    formattedWalletAddress() {
      if (!this.walletAddress) return "";
      return this.walletAddress.substring(0, 6) + "..." + this.walletAddress.substring(this.walletAddress.length - 4);
    },
    estimatedMao() {
      if (!this.exchangeAmount) return "0.000000";
      // 汇率计算逻辑：1 USD = X $MAO (这里的 rate 是 100M / DeltaGMV)
      // 但积分已经是金额 * 汇率的结果，所以 1 积分 = 1 $MAO (底层 6 位精度)
      // 我们这里展示的是带小数点的数量
      return (parseFloat(this.exchangeAmount) / 1000000).toFixed(6);
    }
  },

  onLoad(options) {
    this.initPointData();
    this.getList();
    this.fetchRate();
    if (options.register) {
      this.showRegisterWelcome();
    }
  },

  onReachBottom() {
    this.params.pageNumber++;
    this.getList();
  },
  
  methods: {
    async fetchRate() {
      try {
        const res = await getMaoMallRates();
        // 如果后端有返回当前 Tiers 的基础汇率，可以在这里更新
      } catch (e) {}
    },

    async getList() {
      let params = this.params;
      uni.showLoading({ title: this.$t('common.loading') });
      
      try {
        const result = await getPointsData(params);
        if (this.$store.state.isShowToast) { uni.hideLoading(); }
        
        let data = result.records;
        if (this.params.pageNumber === 1) this.pointList = [];
        
        this.pointList.push(...data);
        if (data.length < 10) {
          this.count["loadStatus"] = "noMore";
        } else {
          this.count["loadStatus"] = "more";
        }
      } catch (err) {
        if (this.$store.state.isShowToast) { uni.hideLoading(); }
        console.error('Failed to get points record:', err);
      }
    },

    async initPointData() {
      try {
        const result = await getMemberPointSum();
        this.pointData = result;
      } catch (err) {
        console.error('Failed to init point data:', err);
      }
    },
    
    maxExchange() {
      this.exchangeAmount = this.pointData.point || 0;
    },

    handleConnectWallet() {
      const currentUrl = window.location.href; // H5 自动获取
      
      uni.showLoading({ title: '正在唤起 Phantom...' });
      
      connectPhantom({ url: currentUrl }).then(address => {
        uni.hideLoading();
        if (address) {
          this.walletAddress = address;
          storage.setWalletAddress(this.walletAddress);
          uni.showToast({ title: '连接成功', icon: 'success' });
        }
      }).catch(err => {
        uni.hideLoading();
        this.fallbackManualInput();
      });
    },

    handleDisconnect() {
      uni.showActionSheet({
        itemList: ['断开当前连接'],
        success: (res) => {
          if (res.tapIndex === 0) {
            disconnectPhantom();
            this.walletAddress = "";
            storage.setWalletAddress("");
            uni.showToast({ title: '已断开', icon: 'none' });
          }
        }
      });
    },

    fallbackManualInput() {
      uni.showActionSheet({
        itemList: ['手动输入地址'],
        success: (res) => {
          if (res.tapIndex === 0) {
            uni.showModal({
              title: '绑定钱包',
              editable: true,
              placeholderText: '请输入 Solana 钱包地址',
              success: (modalRes) => {
                if (modalRes.confirm && modalRes.content) {
                  this.walletAddress = modalRes.content;
                  storage.setWalletAddress(this.walletAddress);
                  uni.showToast({ title: '绑定成功', icon: 'success' });
                }
              }
            });
          }
        }
      });
    },

    handleExchange() {
      if (!this.walletAddress) {
        uni.showToast({ title: '请先绑定钱包', icon: 'none' });
        return;
      }
      uni.showModal({
        title: '确认兑换',
        content: `确定将 ${this.exchangeAmount} 积分兑换为 ${this.estimatedMao} $MAO 吗？\n该操作不可逆，将直接转账至：\n${this.walletAddress}`,
        success: async (res) => {
          if (res.confirm) {
            uni.showLoading({ title: '兑换中...' });
            
            try {
              await applyMaoMallExchange({
                points: this.exchangeAmount,
                solanaWalletAddress: this.walletAddress
              });
              
              uni.hideLoading();
              uni.showToast({ title: '兑换成功', icon: 'success' });
              this.exchangeAmount = "";
              this.initPointData();
              this.params.pageNumber = 1;
              this.getList();
            } catch (err) {
              uni.hideLoading();
              uni.showToast({ title: err.message || '兑换失败', icon: 'none' });
            }
          }
        }
      });
    },

    openExternalRule() {
      // #ifdef H5
      window.open('https://about.maollar.com', '_blank');
      // #endif
      // #ifndef H5
      uni.navigateTo({
        url: '/pages/tabbar/home/web-view?url=' + encodeURIComponent('https://about.maollar.com')
      });
      // #endif
    },

    showRegisterWelcome() {
      uni.showModal({
        title: '🎉 欢迎来到 MaoMall',
        content: '作为新用户，我们已为您分配了 $MAO 积分模型。现在只需绑定 Solana 钱包地址，即可开启“消费即增值”之旅！',
        confirmText: '去绑定',
        cancelText: '稍后再说',
        success: (res) => {
          if (res.confirm) {
            this.handleConnectWallet();
          }
        }
      });
    }
  },
};
</script>

<style lang="scss" scoped>
.content {
  background: #f4f6f8;
  min-height: 100vh;
}

.portrait-box {
  background: linear-gradient(135deg, #2c3e50 0%, #000000 100%);
  height: 320rpx;
  margin: 0;
  border-radius: 0 0 40rpx 40rpx;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #ffffff;
  box-shadow: 0 10rpx 30rpx rgba(0,0,0,0.2);

  > image:first-child {
    width: 300rpx;
    height: 300rpx;
    position: absolute;
    right: -50rpx;
    bottom: -50rpx;
    opacity: 0.1;
  }

  .balance-display {
    text-align: center;
    .balance-label {
      font-size: 26rpx;
      opacity: 0.8;
      letter-spacing: 2rpx;
    }
    .balance-amount {
      display: block;
      font-size: 72rpx;
      font-weight: 800;
      color: #ffd700; /* 黄金色 */
      text-shadow: 0 4rpx 12rpx rgba(255,215,0,0.3);
      margin-top: 10rpx;
    }
  }
}

.portrait-box2 {
  background: #fff;
  margin: -40rpx 30rpx 30rpx;
  height: 120rpx;
  border-radius: 20rpx;
  box-shadow: 0 4rpx 20rpx rgba(0,0,0,0.05);
  font-size: 26rpx;
  .pcolor {
    color: #2c3e50;
    font-weight: bold;
    margin-left: 10rpx;
  }
}

/* 钱包绑定卡片 */
.wallet-status-card {
  margin: 0 30rpx 30rpx;
  padding: 30rpx;
  background: #fff;
  border-radius: 20rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  border: 2rpx dashed #dcdfe6;

  &.active {
    border: 2rpx solid #19be6b;
    background: #f7fffa;
  }

    .status-info {
      display: flex;
      align-items: center;
      gap: 15rpx;
      margin-bottom: 20rpx;
      .status-text {
        font-size: 28rpx;
        color: #333;
        font-weight: bold;
      }
      .status-desc {
        font-size: 24rpx;
        color: #999;
      }
      .address-info {
        display: flex;
        flex-direction: column;
        .disconnect-link {
          font-size: 22rpx;
          color: #fa3534;
          margin-top: 5rpx;
          text-decoration: underline;
        }
      }
    }

  .bind-btn {
    width: 100%;
    height: 90rpx;
    line-height: 90rpx;
    background: #000;
    color: #fff;
    border-radius: 45rpx;
    font-size: 28rpx;
    display: flex;
    justify-content: center;
    align-items: center;
    &::after { border: none; }
  }
  
  .manual-entry, .manual-tips {
    margin-top: 20rpx;
    font-size: 24rpx;
    color: #2979ff;
    text-decoration: underline;
  }
  
  .manual-tips {
    color: #999;
    text-decoration: none;
  }
}

/* 兑换控制台 */
.exchange-console {
  margin: 0 30rpx 30rpx;
  padding: 40rpx;
  background: #fff;
  border-radius: 30rpx;
  box-shadow: 0 10rpx 40rpx rgba(0,0,0,0.03);

  .console-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 40rpx;
    .console-title {
      font-size: 32rpx;
      font-weight: bold;
      color: #000;
    }
    .rule-link {
      display: flex;
      align-items: center;
      gap: 5rpx;
      font-size: 24rpx;
      color: #999;
    }
  }

  .exchange-input-box {
    background: #f8f9fb;
    padding: 30rpx;
    border-radius: 20rpx;
    .input-header {
      display: flex;
      justify-content: space-between;
      font-size: 24rpx;
      color: #666;
      margin-bottom: 20rpx;
      .all-in {
        color: #2979ff;
        font-weight: bold;
      }
    }
    ::v-deep .u-input__input {
      font-size: 40rpx !important;
      font-weight: bold !important;
    }
  }

  .exchange-estimate {
    margin: 30rpx 0;
    font-size: 28rpx;
    color: #333;
    .estimate-value {
      color: #19be6b;
      font-weight: 800;
      font-size: 34rpx;
    }
  }

  .main-exchange-btn {
    width: 100%;
    height: 100rpx;
    line-height: 100rpx;
    background: linear-gradient(90deg, #ffd700, #ffb800);
    color: #000;
    font-weight: bold;
    border-radius: 50rpx;
    font-size: 32rpx;
    margin-top: 20rpx;
    box-shadow: 0 10rpx 20rpx rgba(255,215,0,0.2);
    &[disabled] {
      background: #ebeef5;
      color: #c0c4cc;
      box-shadow: none;
    }
    &::after { border: none; }
  }

  .exchange-tips {
    margin-top: 30rpx;
    display: flex;
    flex-direction: column;
    gap: 8rpx;
    font-size: 22rpx;
    color: #999;
  }
}

.section-title {
  padding: 30rpx 40rpx 20rpx;
  font-size: 30rpx;
  font-weight: bold;
  color: #333;
}

.point-list {
  background: #fff;
  margin: 0 30rpx 40rpx;
  border-radius: 20rpx;
  overflow: hidden;
}

.point-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 30rpx;
  border-bottom: 2rpx solid #f8f9fb;
  .point-label {
    font-size: 28rpx;
    color: #333;
    font-weight: 500;
    margin-bottom: 10rpx;
  }
  .point-time {
    font-size: 22rpx;
    color: #999;
  }
  .plus { color: #19be6b; font-weight: bold; font-size: 30rpx; }
  .reduce { color: #fa3534; font-weight: bold; font-size: 30rpx; }
}

.empty-state {
  padding: 60rpx 0;
}
</style>
