<template>
  <view class="container">
    <u-navbar :title="$t('user.legalNotice')" :is-back="true"></u-navbar>
    
    <view class="content">
      <view class="title">特定商取引法に基づく表記</view>
      
      <view class="table">
        <view class="tr">
          <view class="th">販売業者</view>
          <view class="td">猫楽合同会社</view>
        </view>
        <view class="tr">
          <view class="th">運営責任者</view>
          <view class="td">MA DA</view>
        </view>
        <view class="tr">
          <view class="th">住所</view>
          <view class="td">日本·冲绳·西原</view>
        </view>
        <view class="tr">
          <view class="th">電話番号</view>
          <view class="td">+81 07038023421</view>
        </view>
        <view class="tr">
          <view class="th">メールアドレス</view>
          <view class="td">ss@maollar.com</view>
        </view>
        <view class="tr">
          <view class="th">URL</view>
          <view class="td">https://www.maollar.com</view>
        </view>
        <view class="tr">
          <view class="th">商品の販売価格</view>
          <view class="td">各商品ページに記載の金額（消費税込み）</view>
        </view>
        <view class="tr">
          <view class="th">商品以外の必要料金</view>
          <view class="td">配送料（詳細は配送ポリシー参照）</view>
        </view>
        <view class="tr">
          <view class="th">支払方法</view>
          <view class="td">クレジットカード決済、Stripe（Apple Pay / Google Pay）、預金払い</view>
        </view>
        <view class="tr">
          <view class="th">返品・交換・キャンセル</view>
          <view class="td">商品到着後7日以内にご連絡ください。お客様都合による返品は原則不可。</view>
        </view>
      </view>
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
.container {
  background-color: #f8f8f8;
  min-height: 100vh;
}

.content {
  padding: 30rpx;
  background-color: #fff;
  margin: 20rpx;
  border-radius: 16rpx;
}

.title {
  font-size: 34rpx;
  font-weight: bold;
  margin-bottom: 40rpx;
  text-align: center;
  color: #333;
}

.table {
  border: 1rpx solid #eee;
  border-bottom: none;
}

.tr {
  display: flex;
  border-bottom: 1rpx solid #eee;
}

.th {
  width: 240rpx;
  padding: 24rpx;
  background-color: #fcfcfc;
  font-size: 26rpx;
  color: #666;
  font-weight: bold;
  border-right: 1rpx solid #eee;
  display: flex;
  align-items: center;
}

.td {
  flex: 1;
  padding: 24rpx;
  font-size: 26rpx;
  color: #333;
  line-height: 1.5;
  word-break: break-all;
}
</style>
