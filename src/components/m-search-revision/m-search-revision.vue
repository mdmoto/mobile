<template>
  <view class="serach">
    <view class="left-box" @tap="onClickLeft">
      <u-icon name="arrow-left" size="40" color="#666"></u-icon>
    </view>
    <!--
      ✅ 关键修复：
      原来 .content 设 width:100%，加上 .left-box(15%) + .button.active(100rpx padding)
      三者之和超过 100%，导致取消按钮溢出屏幕。
      改为 flex:1 让搜索框弹性占满剩余空间，不再固定 100%。
    -->
    <view class="content" :style="{ 'border-radius': radius + 'px' }">
      <view class="content-box" :class="{ center: mode === 2 }">
        <u-icon name="search" size="32" style="padding:0 15rpx;"></u-icon>
        <input
          style="width:100%;"
          :placeholder="placeholder"
          placeholder-class="placeholder-color"
          @input="inputChange"
          confirm-type="search"
          @confirm="triggerConfirm"
          class="input"
          :class="{ center: !active && mode === 2 }"
          :focus="isFocus"
          v-model="inputVal"
          @focus="focus"
          @blur="blur"
        />
        <u-icon name="close" v-if="isDelShow" style="padding:0 30rpx;" @click="clear"></u-icon>
      </view>
    </view>

    <view class="button active">
      <view v-if="isShowSeachGoods !== true" class="button-item">
        <div @click="out()">取消</div>
      </view>
      <view v-else class="button-item">
        <u-icon name="grid-fill" size="50" @click="handelListClass()" v-if="!switchLayout"></u-icon>
        <u-icon v-else @click="handelListClass()" name="list-dot" size="50"></u-icon>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  emits: ["update:modelValue", "confirm", "search", "SwitchType"],
  props: {
    mode: { type: Number, default: 1 },
    placeholder: { type: String, default: "请输入搜索内容" },
    modelValue: { type: String, default: "" },
    radius: { type: [String, Number], default: 60 },
    isFocusVal: { type: Boolean, default: true },
  },
  data() {
    return {
      isShowSeachGoods: false,
      active: false,
      inputVal: "",
      isDelShow: false,
      isFocus: false,
      switchLayout: true,
    };
  },
  created() { this.inputVal = this.modelValue; },
  mounted() { this.isFocus = this.isFocusVal; },
  methods: {
    out() {
      uni.reLaunch({ url: "/pages/tabbar/home/index" });
    },
    handelListClass() {
      this.switchLayout = !this.switchLayout;
      this.$emit("SwitchType");
    },
    triggerConfirm() {
      this.$emit("confirm", false);
      uni.hideKeyboard();
    },
    inputChange(event) {
      const keyword = event.detail.value;
      this.$emit("update:modelValue", keyword);
      if (this.inputVal) this.isDelShow = true;
    },
    focus() {
      this.active = true;
      if (this.inputVal) this.isDelShow = true;
    },
    blur() {
      this.isFocus = false;
      if (!this.inputVal) this.active = false;
    },
    clear() {
      uni.hideKeyboard();
      this.isFocus = false;
      this.inputVal = "";
      this.active = false;
      this.$emit("update:modelValue", "");
    },
    onClickLeft() {
      const paths = getCurrentPages();
      if (paths.length > 1) {
        uni.navigateBack();
      } else {
        uni.switchTab({ url: "/pages/tabbar/home/index" });
      }
    },
    search() {
      if (!this.inputVal) {
        if (this.searchName === "取消") {
          uni.hideKeyboard();
          this.isFocus = false;
          this.active = false;
          return;
        }
      }
      this.$emit("search", this.inputVal ? this.inputVal : this.placeholder);
    },
  },
  watch: {
    inputVal(newVal) { newVal ? (this.isDelShow = true) : (this.isDelShow = false); },
    modelValue(newVal) { this.inputVal = newVal; }
  },
};
</script>

<style lang="scss" scoped>
.serach {
  display: flex;
  width: 100%;
  box-sizing: border-box;
  align-items: center;   /* ✅ 确保三个子元素垂直居中 */
  font-size: 28rpx;

  .left-box {
    /* ✅ 固定宽度，不用百分比，避免压缩搜索框 */
    flex-shrink: 0;
    width: 80rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
  }

  .content {
    /*
     * ✅ 核心修复：flex:1 代替 width:100%
     * width:100% 在 flex 容器里会按父级全宽计算，
     * 导致 left-box + content(100%) + button 三者超出一行
     * flex:1 只占剩余空间，天然不会溢出
     */
    flex: 1;
    display: flex;
    align-items: center;
    height: 70rpx;
    color: #999;
    background: #eee;
    overflow: hidden;
    border-radius: 60rpx;
    transition: all 0.2s linear;

    .content-box {
      width: 100%;
      display: flex;
      align-items: center;
      &.center { justify-content: center; }

      .input {
        flex: 1;
        max-width: 100%;
        line-height: 60rpx;
        height: 60rpx;
        transition: all 0.2s linear;
        &.center { width: 200rpx; flex: none; }
      }
    }
  }

  .button {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;          /* ✅ 禁止被压缩 */
    width: 0;
    transition: all 0.2s linear;
    white-space: nowrap;
    overflow: hidden;

    &.active {
      padding-left: 15rpx;
      width: 100rpx;         /* ✅ 固定宽度，不依赖 % */
    }

    .button-item {
      font-size: 28rpx;
      color: #333;
    }
  }
}

.placeholder-color {
  color: #999;
  opacity: 0.4;
}
</style>
