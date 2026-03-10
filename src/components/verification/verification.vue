<template>
  <view>
    <view
      v-if="!hid"
      class="flex-row-center"
      :style="{ top: scHight }"
      style="width: 750rpx; position: fixed; z-index: 100; left: 0"
    >
      <view
        class="flex-column-center"
        style="background-color: #fcfcfc; padding: 30rpx; border-radius: 10rpx"
      >
        <movable-area
          class="flex"
          style="width: 100%"
          animation="false"
          :style="{ height: originalHeight }"
        >
          <movable-view
            scale-value="1"
            animation="false"
            damping="5000"
            :x="moveX"
            :style="{
              height: sliderHeight,
              width: sliderWidth,
              'z-index': 101,
            }"
            direction="horizontal"
          >
            <image
              :src="imgbk"
              class="image"
              mode="aspectFit"
              :style="{
                height: sliderHeight,
                width: sliderWidth,
                'margin-top': imgbKH,
              }"
            ></image>
          </movable-view>
          <image
            :src="img"
            mode="aspectFit"
            :style="{ height: originalHeight, width: originalWidth }"
            style="border-radius: 10rpx"
          ></image>
        </movable-area>

        <movable-area
          class="flex-row-start"
          style="
            width: 100%;
            background-color: #efefef;
            height: 80rpx;
            border-radius: 40rpx;
            margin-top: 30rpx;
          "
        >
        <movable-view
          scale-value="1"
          animation="false"
          damping="50"
          :x="movePv"
          :inertia="false"
          class="flex-row-center"
          style="
            border-radius: 50%;
            height: 100rpx;
            width: 100rpx;
            background-color: #ffffff;
            border: 2rpx solid #e3e3e3;
            margin-top: -13rpx;
          "
          direction="horizontal"
          @change="moveChange"
          @touchend="end"
          @mouseup.native="end"
        >
            <u-icon
              :color="mainColor"
              size="40"
              v-if="endLoad"
              name="arrow-right"
            ></u-icon>
            <u-icon :color="mainColor" size="40" v-else name="reload"></u-icon>
          </movable-view>

          <text style="padding-left: 140rpx" :style="{ color: col }">{{
            hasImg
          }}</text>
        </movable-area>
        <view class="flex-row-around padding-top" style="width: 100%">
          <u-icon
            @click="hide"
            :color="mainColor"
            size="40"
            name="close"
          ></u-icon>

          <text class="cu-tag round" @click="getCode">刷新拼图</text>
          <text class="my-neirong-sm cuIcon-safe" style="color: #c1c1c1"
            >Lili-FRAMEWORK</text
          >
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { getSlider, validSlider } from "@/api/common.js";
import storage from "@/utils/storage.js";
import uuid from "@/utils/uuid.modified.js";
const phone = uni.getSystemInfoSync();
const l = phone.screenWidth / 750;
export default {
  name: "verification",
  created() {
    // 可自行调整
    this.scHight = phone.screenHeight / 2 - 200 + "px";
    // 不在创建时获取验证码，改为在显示时按需获取
  },
  props: {
    height: {
      type: String,
      default: "80rpx",
    },
    width: {
      type: String,
      default: "350rpx",
    },
    left: {
      type: String,
      default: "180rpx",
    },
    top: {
      type: String,
      default: "30rpx",
    },
    business: {
      type: String,
      default: "LOGIN",
    },
  },
  data() {
    return {
      mainColor: this.$mainColor,
      flage: false,
      key: "", //key
      vsrtx: "点击进行验证", //按钮提示语
      vsr: false, //
      hid: true,
      col: "#838383",
      movePv: 0,
      hasImg: "拖动滑块已完成拼图",
      spcode: "",
      tl: 0,
      moveCode: 0,
      //X轴移动距离
      moveX: 0,
      //模版高度
      originalHeight: "",
      //模版宽度
      originalWidth: "",
      //拼图高度
      sliderHeight: "",
      //平涂宽度
      sliderWidth: "",
      scHight: 0,
      //原图
      img: "",
      //拼图
      imgbk: "",
      endLoad: true,
      imgbKH: "",
      isLoadingCode: false, // 防止重复加载验证码
    };
  },
  methods: {
    show() {
      this.hid = false;
      // 只在没有验证码图片时才获取
      if (!this.img) {
        console.log('📸 滑块显示但无图片，自动获取验证码');
        this.getCode();
      } else {
        console.log('📸 滑块显示，已有验证码图片，不重复加载');
      }
    },
    hide() {
      if (!this.vsr) {
        // vsr判断是否验证成功，成功隐藏验证框
        this.hid = !this.hid;
      }
    },
    error() {
      this.vsr = false;
      this.hid = false;
      this.moveX = 0;
      this.moveCode = 0;
      this.isLoadingCode = false; // 重置加载状态
    },
    async getCode() {
      // 防止重复加载
      if (this.isLoadingCode) {
        console.log('⚠️ 验证码正在加载中，跳过重复请求');
        return;
      }
      
      this.isLoadingCode = true;
      this.col = "#b3afae";
      this.hasImg = "图片加载中...";
      console.log('🔄 开始获取验证码图片, business:', this.business);
      
      const currentUuid = storage.getUuid() || uuid.v1();
      if (!storage.getUuid()) {
        storage.setUuid(currentUuid);
      }

      try {
        const data = await getSlider(this.business, currentUuid);
        this.col = "#838383";
        this.hasImg = "拖动滑块以完成拼图";

        // base64的图片
        this.img = data.backImage;
        this.imgbk = data.slidingImage;
        // 根据参数动态适应验证图片的高宽
        this.imgbKH = data.randomY * 1.8 + "rpx";
        this.originalHeight = data.originalHeight * 1.8 + "rpx";
        this.originalWidth = data.originalWidth * 1.8 + "rpx";
        this.sliderHeight = data.sliderHeight * 1.8 + "rpx";
        this.sliderWidth = data.sliderWidth * 1.8 + "rpx";
        
        // 适应比率，用来适应滑动距离 - 每次重新获取屏幕宽度
        const currentPhone = uni.getSystemInfoSync();
        const currentL = currentPhone.screenWidth / 750;
        this.tl = 1 / (1.8 * currentL);
        console.log('📏 屏幕宽度:', currentPhone.screenWidth, 'tl:', this.tl);
        
        // 无用信息
        this.spcode = data.capcode;
        // 验证令牌
        this.key = data.key;
        this.$store.state.verificationKey = data.key;
        console.log('✅ 验证码图片加载成功, key:', data.key);
      } catch (err) {
        console.error('❌ 验证码图片加载失败:', err);
        this.hasImg = "加载失败，请点击刷新";
      } finally {
        this.isLoadingCode = false;
      }
    },
    async end(e) {
      console.log('🎯 滑块释放事件触发');
      const xPos = parseInt(this.moveCode * this.tl);
      console.log('计算后的 xPos:', xPos);
  
      this.endLoad = false;
      try {
        const result = await validSlider(this.business, storage.getUuid(), xPos);
        console.log('✅ 滑块验证成功');
        //验证成功后把key发送出去
        this.$emit("send", this.key);
        this.hide();
        this.vsr = true;
        this.vsrtx = "已通过验证";
      } catch (err) {
        console.log('❌ 滑块验证失败:', err);
        uni.showToast({
          title: "验证失败，请重试",
          duration: 2000,
          icon: "none",
        });
        // 验证失败，重新获取验证码
        this.getCode(); 
        this.movePv = this.movePv == 1 ? 0 : 1;
      } finally {
        this.endLoad = true;
      }
    },
    // 绑定拼图位置
    moveChange(e) {
      this.moveX = e.detail.x;
      this.moveCode = e.detail.x;
      console.log('🎯 滑块移动:', {
        moveX: this.moveX,
        moveCode: this.moveCode,
        detail: e.detail
      });
    },
  },
};
</script>

<style lang="scss" scoped>
@import "./animation.css";
@import "./icon.css";
// @import './main.css';
.dh-wt {
  animation: at 1.1s ease;
  animation-iteration-count: infinite;
  animation-direction: alternate;
  background-color: $main-color;
  border-radius: 50%;
}

@keyframes at {
  from {
    width: 27rpx;
    height: 27rpx;
  }

  to {
    width: 45rpx;
    height: 45rpx;
  }
}

.ttcl {
  color: $main-color;
}

.border-index {
  border: 1rpx solid $main-color;
}

.status_bar {
  height: var(--status-bar-height);
  background-color: #f1f1f1;
  width: 100%;
}

.status_bar-nobg {
  height: var(--status-bar-height);
  width: 100%;
}

/* 转圈动画 */
.turn-load {
  animation: turnmy 1s linear infinite;
}

@keyframes turnmy {
  0% {
    -webkit-transform: rotate(0deg);
  }

  25% {
    -webkit-transform: rotate(90deg);
  }

  50% {
    -webkit-transform: rotate(180deg);
  }

  75% {
    -webkit-transform: rotate(270deg);
  }

  100% {
    -webkit-transform: rotate(360deg);
  }
}

.status_bar-fixed {
  height: var(--status-bar-height);
  width: 100%;
  position: fixed;
  background-color: #f1f1f1;
  z-index: 20;
}

.head-dh-my {
  display: flex;
  position: fixed;
  justify-content: space-around;
  align-items: flex-end;
  padding-bottom: 10rpx;
  z-index: 15;
  background-color: #e3e3e3;
  width: 750rpx;
}

.padding-left {
  padding-left: 20rpx;
}

.padding-left-top {
  padding-left: 20rpx;
  padding-top: 20rpx;
}

.padding-right {
  padding-right: 20rpx;
}

.input-my {
  padding-left: 20rpx;
  border-radius: 40rpx;
  height: 50rpx;
  margin: 10rpx;
}

.tb-tag-absolute {
  position: absolute;
  z-index: 5;
  border-radius: 25rpx;
  font-size: 16rpx;
  margin-left: 25rpx;
  margin-top: -35rpx;
}

.flex-column-center {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.flex-column-between {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
}

.flex-column-start {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.flex-column-around {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
}

.flex-row-start {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.flex-row-around {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
}

.flex-row-center {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}

.flex-row-between {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}

.my-title {
  font-size: 35rpx;
  font-weight: bold;
}

.my-neirong {
  font-size: 26rpx;
  color: #6d6d6d;
}

.my-neirong-sm {
  font-size: 23rpx;
  color: #616161;
}

.my-tag-text {
  font-size: 22rpx;
  padding-top: 20rpx;
  color: #bababa;
}

.padding-top {
  padding-top: 35rpx;
}

.padding-top-sm {
  padding-top: 20rpx;
}

.bottom-dh {
  background-color: #f1f1f1;
  position: fixed;
  z-index: 10;
  bottom: 0;
  width: 750rpx;
  height: 110rpx;
}

.tb-text {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.bottom-text {
  width: 750rpx;
  position: fixed;
  text-align: center;
  font-size: 26rpx;
  color: #9d9d9d;
  bottom: 70rpx;
}

.moneycolor {
  color: #ea5002;
}

.margin-top {
  margin-top: 20rpx;
}

.margin-top-sm {
  margin-top: 12rpx;
}

.margin {
  margin: 20rpx;
}

.margin-left {
  margin-left: 20rpx;
}

.margin-right {
  margin-right: 20rpx;
}

.main-color {
  color: #07d188;
}
</style>
