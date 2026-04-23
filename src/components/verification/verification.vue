<template>
  <view>
    <view v-if="!hid" class="verify-overlay">
      <view class="verify-modal">
		        <movable-area
		          class="verify-puzzle-area"
		          animation="false"
			          :style="{ height: (displayHeightPx || 150) + 'px', width: (displayWidthPx || 300) + 'px' }"
		        >
          <movable-view
            scale-value="1"
            animation="false"
            damping="5000"
            :x="moveX"
            :style="{
	              height: sliderHeightPx + 'px',
	              width: sliderWidthPx + 'px',
	              'z-index': 2,
            }"
            direction="horizontal"
          >
            <image
              :src="imgbk"
	              class="verify-puzzle-piece"
              mode="aspectFit"
              :style="{
	                height: sliderHeightPx + 'px',
	                width: sliderWidthPx + 'px',
	                'margin-top': imgbkTopPx + 'px',
              }"
            ></image>
          </movable-view>
	          <image
	            :src="img"
	            mode="aspectFit"
	            class="verify-puzzle-bg"
		            :style="{ height: (displayHeightPx || 150) + 'px', width: (displayWidthPx || 300) + 'px' }"
	          ></image>
        </movable-area>

		        <movable-area
		          class="verify-slider-area"
			          :style="{ width: (displayWidthPx || 300) + 'px' }"
		        >
        <movable-view
          scale-value="1"
          animation="false"
          damping="50"
          :x="movePv"
          :inertia="false"
          class="verify-slider-thumb flex-row-center"
          style="border-radius: 50%;"
          direction="horizontal"
          @change="moveChange"
          @touchend="end"
          @mouseup.native="end"
        >
            <u-icon
              :color="mainColor"
              size="24"
              v-if="endLoad"
              name="arrow-right"
            ></u-icon>
            <u-icon :color="mainColor" size="24" v-else name="reload"></u-icon>
          </movable-view>

          <text class="verify-slider-text" :style="{ color: col }">{{ hasImg }}</text>
        </movable-area>
        <view class="verify-footer">
          <u-icon
            @click="hide"
            :color="mainColor"
            size="24"
            name="close"
          ></u-icon>

          <text class="cu-tag round" @click="getCode">刷新拼图</text>
          <text class="my-neirong-sm cuIcon-safe" style="color: #c1c1c1"
            >MaoMall-FRAMEWORK</text
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
export default {
  name: "verification",
  created() {
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
	      moveCode: 0,
	      //X轴移动距离
	      moveX: 0,
	      // 自适应缩放
	      scale: 1,
	      displayHeightPx: 0,
	      displayWidthPx: 0,
	      // 拼图尺寸（显示用）
	      sliderHeightPx: 0,
	      sliderWidthPx: 0,
	      //原图
	      img: "",
	      //拼图
	      imgbk: "",
	      endLoad: true,
	      // 拼图块的 Y 偏移（显示用）
	      imgbkTopPx: 0,
	      isLoadingCode: false, // 防止重复加载验证码
	    };
	  },
	  methods: {
	    show() {
	      this.hid = false;
	      // 每次打开都刷新验证码，避免状态/图片残留导致“弹出异常”
	      this.vsr = false;
	      this.endLoad = true;
	      this.movePv = 0;
	      this.moveX = 0;
	      this.moveCode = 0;
	      this.img = "";
	      this.imgbk = "";
	      this.getCode();
	    },
    hide() {
      if (!this.vsr) {
        // vsr判断是否验证成功，成功隐藏验证框
        this.hid = !this.hid;
        this.$emit('close');
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
	        const res = await getSlider(this.business, currentUuid);
	        if (!res || !res.data || !res.data.success) {
	          const message = (res && res.data && (res.data.message || res.data.msg)) || "加载失败，请点击刷新";
	          console.error("❌ 获取滑块验证码失败:", res);
	          this.hasImg = message;
	          return;
	        }

	        const data = res.data.result;
	        if (!data) {
	          console.error("❌ 获取滑块验证码 result 为空:", res);
	          this.hasImg = "加载失败，请点击刷新";
	          return;
	        }

          // 后端关闭滑块时，直接放行（AI 友好模式）
          if (data.disabled) {
            this.key = data.key || "";
            this.$store.state.verificationKey = this.key;
            this.$emit("send", this.key);
            this.hide();
            this.vsr = true;
            this.flage = true;
            this.vsrtx = "已通过验证";
            console.log("✅ 滑块已禁用，直接通过验证");
            return;
          }
	        this.col = "#838383";
	        this.hasImg = "拖动滑块以完成拼图";

	        // base64的图片
	        this.img = data.backImage;
	        this.imgbk = data.slidingImage;
	        // 自适应缩放：限制弹窗最大宽度，避免手机端显示不全
	        const currentPhone = uni.getSystemInfoSync();
	        const maxWidthPx = Math.min(Math.max(280, currentPhone.screenWidth - 48), 420);
	        const originalWidthPx = Number(data.originalWidth) || 0;
	        const originalHeightPx = Number(data.originalHeight) || 0;
	        const nextScale = originalWidthPx > 0 ? Math.min(1, maxWidthPx / originalWidthPx) : 1;
	        this.scale = nextScale || 1;
	        this.displayWidthPx = Math.round(originalWidthPx * this.scale);
	        this.displayHeightPx = Math.round(originalHeightPx * this.scale);
	        this.sliderHeightPx = Math.round((Number(data.sliderHeight) || 0) * this.scale);
	        this.sliderWidthPx = Math.round((Number(data.sliderWidth) || 0) * this.scale);
	        this.imgbkTopPx = Math.round((Number(data.randomY) || 0) * this.scale);
	        console.log("📏 屏幕宽度:", currentPhone.screenWidth, "scale:", this.scale, "displayWidthPx:", this.displayWidthPx);
        
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
	      // 自适应缩放后，需要反算回后端使用的原始坐标(px)
	      const safeScale = this.scale || 1;
	      const xPos = Math.round(this.moveCode / safeScale);
	      console.log('计算后的 xPos (px):', xPos);
  
      this.endLoad = false;
      try {
        const res = await validSlider(this.business, storage.getUuid(), xPos);
        console.log('📥 滑块验证结果:', res);
        
        // P0: 滑块成功条件 res.data.success && res.data.result === true
        if (res.data.success && res.data.result === true) {
          console.log('✅ 滑块验证成功');
          // 验证成功后把 key 发送出去
          this.$emit("send", this.key);
          this.hide();
          this.vsr = true;
          this.flage = true; // 用户要求置 flage=true
          this.vsrtx = "已通过验证";
        } else {
          // 如果后端返回 success 为 true 但 result 不为 true，也视为失败
          throw { data: { message: "验证不匹配，请重试" } };
        }
      } catch (err) {
        console.log('❌ 滑块验证失败:', err);
        const errorMsg = (err.data && err.data.message) || "验证失败，请重试";
        uni.showToast({
          title: errorMsg,
          duration: 2000,
          icon: "none",
        });
        // 验证失败，重置滑动位置并重新获取验证码
        this.moveX = 0;
        this.moveCode = 0;
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

.verify-overlay {
  position: fixed;
  inset: 0;
  z-index: 10000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  box-sizing: border-box;
  background: rgba(0, 0, 0, 0.35);
}

.verify-modal {
  background-color: #fcfcfc;
  padding: 16px;
  border-radius: 10px;
  max-width: calc(100vw - 32px);
  max-height: calc(100vh - 32px);
  overflow: auto;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.verify-puzzle-area {
  border-radius: 10px;
  overflow: hidden;
}

.verify-slider-area {
  background-color: #efefef;
  height: 44px;
  border-radius: 22px;
  margin-top: 14px;
  display: flex;
  flex-direction: row;
  align-items: center;
  position: relative;
}

.verify-slider-thumb {
  height: 44px;
  width: 44px;
  background-color: #ffffff;
  border: 1px solid #e3e3e3;
}

.verify-slider-text {
  padding-left: 56px;
  padding-right: 12px;
  font-size: 13px;
  line-height: 18px;
  user-select: none;
}

.verify-footer {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-around;
  padding-top: 16px;
}
</style>
