<template>
  <view class="address">
    <u-empty class="empty" v-if="this.addressList.length === 0" :text="$t('address.noAddress')" mode="address"></u-empty>
    <view class="list" >
      <view class="item c-content" v-for="(item, index) in addressList" :key="index">
        <view class="basic">
          <text>{{ item.name }}</text>
          <text>{{ item.mobile }}</text>
          <text class="default" v-show="item.isDefault">{{ $t('address.defaultTag') }}</text>
          <view>
            <div class="region">
              <span v-if="item.consigneeAddressPath[0]">{{item.consigneeAddressPath[0]}}</span>
              <span v-if="item.consigneeAddressPath[1]">{{item.consigneeAddressPath[1]}}</span>
              <span v-if="item.consigneeAddressPath[2]">{{item.consigneeAddressPath[2]}}</span>
              <span v-if="item.consigneeAddressPath[3]">{{item.consigneeAddressPath[3]}}</span>
              <span>{{ item.detail }}</span>
            </div>
          </view>
        </view>
        <view class="edit">
          <view class="relative" @click="setDefault(item)">
            <view v-if="item.isDefault" class="alifont icon-xuanzhong"></view>
            <text v-else class="unchecked"></text>
            <text>{{ item.isDefault ? $t('address.defaultAddress') : $t('address.setDefault') }}</text>
          </view>
          <view class="relative">
            <view class="alifont icon-bianji-copy"></view>
            <text class="mr-40" @click="addAddress(item.id)">{{ $t('common.edit') }}</text>
            <view class="alifont icon-lajitong"></view>
            <text @click="removeAddress(item.id)">{{ $t('common.delete') }}</text>
          </view>
        </view>
      </view>
      <view style="height: 100px"></view>
    </view>

    <button type="default" class="btn" @click="addAddress('')">
      <u-icon name="plus-circle"></u-icon>
      {{ $t('address.addNewConsignee') }}
    </button>

    <u-action-sheet :list="removeList" :tips="tips" v-model="showAction" @click="deleteAddressMessage"></u-action-sheet>
  </view>
</template>

<script>
import * as API_Address from "@/api/address.js";
export default {
  data() {
    return {
      addressList: [], //地址列表
      showAction: false, //是否显示下栏框

      removeList: [
        {
          text: this.$t('common.confirm'),
        },
      ],
      tips: {
        text: this.$t('address.confirmDeleteConsignee'),
      },
      removeId: "", //删除的地址id
      routerVal: "",
      params: {
        pageNumber: 1,
        pageSize: 1000,
      },
    };
  },
  // 返回上一级
  onBackPress(e) {
    uni.switchTab({
      url: "/pages/tabbar/user/my",
    });
    return true;
  },
  onLoad: function (val) {
    this.routerVal = val;
  },
  onPullDownRefresh() {
    //下拉刷新
    this.addressList = [];
    this.getAddressList();
  },
  /**
   * 进入页面检测当前账户是否登录
   */
  onShow() {
    if (this.tipsToLogin()) {
      this.getAddressList();
    }
  },
  methods: {
    //获取地址列表
    getAddressList() {
      uni.showLoading();
      API_Address.getAddressList(
        this.params.pageNumber,
        this.params.pageSize
      ).then((res) => {
        res.data.result.records.forEach((item) => {
          item.consigneeAddressPath = item.consigneeAddressPath.split(",");
        });
        this.addressList = res.data.result.records;

         if (this.$store.state.isShowToast){ uni.hideLoading() };
      });
    },
    //删除地址
    removeAddress(id) {
      this.removeId = id;
      this.showAction = true;
    },
    // 删除地址
    deleteAddressMessage() {
      API_Address.deleteAddress(this.removeId).then((res) => {
        if (res.statusCode == 200) {
          uni.showToast({
            icon: "none",
            title: this.$t('message.deleteSuccess'),
          });
          this.getAddressList();
        } else {
          uni.showToast({
            icon: "none",
            title: res.data.message,
            duration: 2000,
          });
        }
      });
    },
    //新建。编辑地址
    addAddress(id) {
      uni.navigateTo({
        url: `/pages/mine/address/add${id ? "?id=" + id : ""}`,
      });
    },
    //设为默认地址
    setDefault(item) {
      delete item.updateBy;
      delete item.updateTime;
      delete item.deleteFlag;

      item.isDefault ? "" : (item.isDefault = !item.isDefault);

      API_Address.editAddress(item).then(() => {
        uni.showToast({
          title: this.$t('address.setDefaultSuccess'),
          icon: "none",
        });
        this.getAddressList();
      });
    },
  },
};
</script>

<style lang="scss" scoped>
@import "./address.scss";
</style>
