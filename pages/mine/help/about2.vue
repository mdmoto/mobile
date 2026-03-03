<template>
  <view class="about-container">
    <u-navbar title="About Mao Mall" :is-back="true" back-icon-color="#00FFCC" title-color="#fff" :background="{backgroundColor: '#0d0d0d'}"></u-navbar>
    
    <!-- Hero Section -->
    <view class="hero-section">
      <view class="hero-bg">
        <svg width="100%" height="100%" viewBox="0 0 400 400">
          <circle cx="200" cy="200" r="150" stroke="#00FFCC" stroke-width="0.5" fill="none" opacity="0.2" />
          <circle cx="200" cy="200" r="100" stroke="#00FFCC" stroke-width="0.5" fill="none" opacity="0.1" />
          <path d="M 50 200 L 350 200 M 200 50 L 200 350" stroke="#00FFCC" stroke-width="0.5" opacity="0.1" />
        </svg>
      </view>
      
      <view class="hero-content">
        <text class="h1">Decentralized Supply Chain Protocol.</text>
        <view class="h2-wrap">
          <text class="h2">Native to the AI Era.</text>
        </view>
        <text class="chinese-subtext">去中心化供应链协议。AI 纪元原生。</text>
        <text class="description">The infrastructure powering the autonomous economy. Connecting the world's best factories to your AI Agent.</text>
      </view>
    </view>

    <!-- Value Section -->
    <view class="section value-section">
      <view class="section-header">
        <text class="section-title">Global Arbitrage. 全球套利</text>
      </view>
      <text class="section-body"> Tokyo Standards. Shenzhen Prices. We source directly from the exact same ODMs supplying top Japanese brands. </text>
      
      <view class="comparison-card">
        <view class="comp-row red">
          <text>Traditional Brand Label</text>
          <text class="price-old">$500</text>
        </view>
        <view class="comp-row green">
          <text>Mao Mall ODM Factory</text>
          <view class="price-wrap">
            <text class="price-new">$80</text>
            <u-icon name="checkmark-circle-fill" color="#4ade80" size="32"></u-icon>
          </view>
        </view>
      </view>
    </view>

    <!-- Model Section -->
    <view class="section model-section">
      <text class="section-title">Zero Profit. Maximum Value.</text>
      <text class="section-body">Mao Mall operates as a non-profit Foundation. 100% of surplus revenue is returned to the community.</text>
      
      <view class="flow-chart">
        <view class="flow-box">
          <text class="flow-label">Users Pay</text>
          <text class="flow-val">$100 Value</text>
        </view>
        <u-icon name="arrow-rightward" color="#00FFCC" size="40" class="flow-arrow"></u-icon>
        <view class="flow-box active">
          <text class="flow-label">Community</text>
          <text class="flow-val">100% Return</text>
        </view>
      </view>
    </view>

    <!-- FOMO Section -->
    <view class="section fomo-section">
      <text class="section-title">The Genesis Multiplier.</text>
      <text class="halving-text">The Fibonacci Halving Protocol.</text>
      
      <view class="graph-box">
        <view class="graph-header">
          <view class="here-tag">YOU ARE HERE</view>
        </view>
        <view class="graph-body">
          <view class="bar-wrap">
            <view class="bar genesis" style="height: 80%;"></view>
            <text class="bar-label">Genesis</text>
            <text class="bar-val">1000%</text>
          </view>
          <view class="bar-wrap">
            <view class="bar growth" style="height: 40%;"></view>
            <text class="bar-label">Growth</text>
            <text class="bar-val">125%</text>
          </view>
          <view class="bar-wrap">
            <view class="bar mature" style="height: 15%;"></view>
            <text class="bar-label">Mature</text>
            <text class="bar-val">30%</text>
          </view>
        </view>
      </view>
      <text class="fomo-footer">Secure your Genesis Hashrate today. easy mining ends soon.</text>
    </view>

    <!-- Security Section -->
    <view class="section security-section">
      <text class="section-title">Institutional Grade Security.</text>
      <view class="sec-grid">
        <view class="sec-item">
          <u-icon name="shield-fill" color="#00FFCC" size="48"></u-icon>
          <text class="sec-h">Multi-Sig</text>
        </view>
        <view class="sec-item">
          <u-icon name="order" color="#00FFCC" size="48"></u-icon>
          <text class="sec-h">DAO Gov</text>
        </view>
        <view class="sec-item">
          <u-icon name="file-text-fill" color="#00FFCC" size="48"></u-icon>
          <text class="sec-h">Open Code</text>
        </view>
      </view>
    </view>

    <!-- Tech Section -->
    <view class="section tech-section">
      <text class="section-title">Built for Silicon Lifeforms.</text>
      <view class="code-block">
        <text class="code-line">{ "protocol": "maomall", </text>
        <text class="code-line">  "agent": "mcp-ready", </text>
        <text class="code-line">  "status": "genesis" }</text>
      </view>
      <text class="section-body">Native MCP interface. Connect ChatGPT to find best ROI.</text>
    </view>

    <!-- Footer -->
    <view class="footer">
      <view class="partners">
        <text>Airwallex</text>
        <text>Solana</text>
        <text>Cloudflare</text>
      </view>
      <text class="copyright">© 2026 Mao Mall Protocol</text>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {};
  }
};
</script>

<style lang="scss" scoped>
.about-container {
  background-color: #0d0d0d;
  min-height: 100vh;
  color: #fff;
  padding-bottom: 60rpx;
}

.hero-section {
  height: 80vh;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40rpx;
  
  .hero-bg {
    position: absolute;
    width: 600rpx;
    height: 600rpx;
    opacity: 0.3;
  }
  
  .hero-content {
    z-index: 10;
    text-align: center;
    
    .h1 {
      font-size: 56rpx;
      font-weight: 800;
      line-height: 1.2;
      display: block;
      margin-bottom: 20rpx;
    }
    
    .h2 {
      font-size: 40rpx;
      font-weight: 700;
      background: linear-gradient(to right, #00fbff, #4eff7e);
      -webkit-background-clip: text;
      color: transparent;
    }
    
    .chinese-subtext {
      display: block;
      font-size: 28rpx;
      color: #888;
      margin-top: 20rpx;
      letter-spacing: 4rpx;
    }
    
    .description {
      display: block;
      font-size: 26rpx;
      color: #bbb;
      margin-top: 40rpx;
      line-height: 1.6;
    }
  }
}

.section {
  padding: 60rpx 40rpx;
  
  .section-title {
    font-size: 36rpx;
    font-weight: 700;
    display: block;
    margin-bottom: 30rpx;
  }
  
  .section-body {
    font-size: 26rpx;
    color: #999;
    line-height: 1.5;
    display: block;
  }
}

.comparison-card {
  background: #1a1a1a;
  border-radius: 20rpx;
  padding: 30rpx;
  margin-top: 40rpx;
  border: 1px solid #333;
  
  .comp-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20rpx 10rpx;
    
    &.red { border-left: 6rpx solid #ff4d4f; margin-bottom: 20rpx; opacity: 0.6; }
    &.green { border-left: 6rpx solid #4ade80; background: #000; border-radius: 10rpx; }
    
    text { font-size: 24rpx; color: #ccc; }
    .price-old { text-decoration: line-through; color: #ff4d4f; font-weight: bold; font-size: 32rpx; }
    .price-new { color: #4ade80; font-weight: 800; font-size: 40rpx; margin-right: 10rpx; }
    .price-wrap { display: flex; align-items: center; }
  }
}

.flow-chart {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 60rpx;
  
  .flow-box {
    flex: 1;
    background: #111;
    border: 1px solid #333;
    padding: 20rpx;
    border-radius: 16rpx;
    text-align: center;
    
    &.active { border-color: #00FFCC; background: #001a14; }
    
    .flow-label { font-size: 20rpx; color: #666; display: block; }
    .flow-val { font-size: 28rpx; font-weight: bold; color: #fff; }
  }
  
  .flow-arrow { margin: 0 20rpx; }
}

.fomo-section {
  background: #080808;
  
  .halving-text {
    color: #00FFCC;
    font-size: 24rpx;
    font-weight: bold;
    display: block;
    margin-bottom: 40rpx;
  }
}

.graph-box {
  background: #000;
  border: 1px solid #222;
  border-radius: 24rpx;
  padding: 40rpx;
  position: relative;
  
  .here-tag {
    position: absolute;
    top: 20rpx;
    left: 20rpx;
    background: #00eba3;
    color: #000;
    font-size: 18rpx;
    font-weight: 900;
    padding: 4rpx 12rpx;
    border-radius: 8rpx;
  }
  
  .graph-body {
    height: 300rpx;
    display: flex;
    align-items: flex-end;
    justify-content: space-around;
    padding-top: 40rpx;
    
    .bar-wrap {
      width: 100rpx;
      display: flex;
      flex-direction: column;
      align-items: center;
      
      .bar {
        width: 60rpx;
        border-radius: 10rpx 10rpx 0 0;
        margin-bottom: 20rpx;
        
        &.genesis { background: linear-gradient(to top, #00FFCC, #00eba3); }
        &.growth { background: #333; }
        &.mature { background: #222; }
      }
      
      .bar-label { font-size: 18rpx; color: #555; }
      .bar-val { font-size: 24rpx; font-weight: bold; color: #888; }
      & .genesis + .bar-val { color: #00FFCC; }
    }
  }
}

.fomo-footer {
  display: block;
  text-align: center;
  font-size: 22rpx;
  color: #555;
  margin-top: 40rpx;
}

.sec-grid {
  display: flex;
  justify-content: space-between;
  margin-top: 40rpx;
  
  .sec-item {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10rpx;
    .sec-h { font-size: 22rpx; color: #888; }
  }
}

.code-block {
  background: #1a1a1a;
  padding: 30rpx;
  border-radius: 20rpx;
  margin: 30rpx 0;
  border-left: 8rpx solid #333;
  
  .code-line {
    font-family: monospace;
    font-size: 24rpx;
    color: #00fbff;
    display: block;
  }
}

.footer {
  border-top: 1px solid #222;
  padding: 40rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20rpx;
  
  .partners {
    display: flex;
    gap: 30rpx;
    opacity: 0.3;
    text { font-size: 20rpx; font-weight: bold; }
  }
  
  .copyright { font-size: 18rpx; color: #444; }
}
</style>
