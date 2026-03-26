<template>
  <view class="add-address">
    <div class="uForm">
      <u-form :border-bottom="false" :model="form" ref="uForm" :error-type="['toast']" :rule="rules">
				<!-- #ifndef H5 -->
        <view class="selectAddress" @click="clickUniMap">
          {{ $t('address.selectShippingAddress') }}
        </view>
				<!-- #endif -->
        <u-form-item class="border" :label="$t('address.name')" label-width="130" prop="name">
          <u-input v-model="form.name" clearable :placeholder="$t('address.inputConsigneeName')" />
        </u-form-item>

        <u-form-item :label="$t('address.phone')" label-width="130" prop="mobile">
          <u-input v-model="form.mobile" type="number" maxlength="11" :placeholder="$t('address.inputMobile')" />
        </u-form-item>
        <u-form-item :label="$t('address.region')" label-width="130" prop="___path">
          <div  @click="showPicker" >
            {{ form.___path || $t('address.selectRegionPlaceholder') }}
          </div>
        </u-form-item>
        <u-form-item :label="$t('address.countryCode') || 'Country'" label-width="130" prop="countryCode">
          <u-input v-model="form.countryCode" :placeholder="$t('address.inputCountryCode') || 'e.g. CN, US, JP'" />
        </u-form-item>
        <u-form-item :label="$t('address.postalCode') || 'Postal Code'" label-width="130" prop="postalCode">
          <u-input v-model="form.postalCode" :placeholder="$t('address.inputPostalCode') || 'Postal Code'" />
        </u-form-item>
        <u-form-item class="detailAddress" :label="$t('address.detail')" label-width="130" prop="detail">
          <u-input type="textarea" v-model="form.detail" maxlength="100" height="150" :placeholder="$t('address.detailAddressPlaceholder')" />
        </u-form-item>
        <u-form-item :label="$t('address.addressAlias')" label-width="130">
          <u-input v-model="form.alias" :placeholder="$t('address.inputAddressAlias')" />
        </u-form-item>
        <u-checkbox-group shape="circle" size="30">
          <u-checkbox :active-color="lightColor" v-model="form.isDefault">{{ $t('address.setDefaultAddress') }}</u-checkbox>
        </u-checkbox-group>

        <div class="saveBtn" @click="save">{{ $t('common.save') }}</div>
      </u-form>

      <m-city :provinceData="list" :headTitle="$t('user.regionSelection')" ref="cityPicker" @funcValue="getpickerParentValue" pickerSize="4">
      </m-city>

      <uniMap v-if="mapFlag" @close="closeMap" @callback="callBackAddress" />
    </div>
  </view>
</template>
<script>
import { addAddress, editAddress, getAddressDetail } from "@/api/address.js";
import city from "@/components/m-city/m-city.vue";
import uniMap from "@/components/uniMap";
import permision from "@/js_sdk/wa-permission/permission.js";
export default {
  components: {
    "m-city": city,
    uniMap,
  },
  onShow() {
    // 判断当前系统权限定位是否开启
  },
  methods: {
    // 关闭地图
    closeMap() {
      this.mapFlag = false;
    },
    // 打开地图并访问权限
    clickUniMap() {
      // #ifdef APP-PLUS
      if (plus.os.name == "iOS") {
        // ios系统
        permision.judgeIosPermission("location")
          ? (this.mapFlag = true)
          : this.refuseMap();
      } else {
        // 安卓
        this.requestAndroidPermission(
          "android.permission.ACCESS_FINE_LOCATION"
        );
      }
      // #endif

      // #ifndef APP-PLUS
      this.mapFlag = true;
      // #endif
    },

    // 如果拒绝权限 提示区设置
    refuseMap() {
      uni.showModal({
        title: this.$t('address.warmTips'),
        content: this.$t('address.refusedLocation'),
        confirmText: this.$t('address.goToSettings'),
        success(res) {
          if (res.confirm) {
            //打开授权设置
            // #ifndef MP-WEIXIN
            uni.getSystemInfo({
              success(res) {
                if (res.platform == "ios") {
                  //IOS
                  plus.runtime.openURL("app-settings://");
                } else if (res.platform == "android") {
                  //安卓
                  let main = plus.android.runtimeMainActivity();
                  let Intent = plus.android.importClass(
                    "android.content.Intent"
                  );
                  let mIntent = new Intent("android.settings.ACTION_SETTINGS");
                  main.startActivity(mIntent);
                }
              },
            });
            // #endif
          }
        },
      });
    },

    // 获取安卓是否拥有地址权限
    async requestAndroidPermission(permisionID) {
      var result = await permision.requestAndroidPermission(permisionID);

      if (result == 1) {
        this.mapFlag = true;
      } else {
        this.refuseMap();
      }
    },

    // 选择地址后数据的回调
    callBackAddress(val) {
      console.log(val)

      if (val.regeocode && val) {
        uni.showLoading({
          title: this.$t('common.loading'),
        });
        let address = val.regeocode;
        this.form.detail = address.formatted_address; //地址详情
        this.form.___path = val.data.result.name;
        this.form.consigneeAddressIdPath = val.data.result.id; // 地址id分割
        this.form.consigneeAddressPath = val.data.result.name; //地址名称， '，'分割
        this.form.lat = val.latitude; //纬度
        this.form.lon = val.longitude; //经度
        uni.hideLoading();
      }

      this.mapFlag = !this.mapFlag; //关闭地图
    },

    // 保存当前 地址
    save() {
      this.$refs.uForm.validate((valid) => {
        if (valid) {
          // Prepare data for submission
          let submitData = JSON.parse(JSON.stringify(this.form));
          if (Array.isArray(submitData.consigneeAddressIdPath)) {
            submitData.consigneeAddressIdPath = submitData.consigneeAddressIdPath.join(",");
          }
          if (Array.isArray(submitData.consigneeAddressPath)) {
            submitData.consigneeAddressPath = submitData.consigneeAddressPath.join(",");
          }

          // 如果没有id则为新增地址
          if (!submitData.id) {
            // 删除没有的数据
            delete submitData.___path;
            addAddress(submitData).then((res) => {
              if (res.data.success) {
                uni.navigateBack();
              }
            });
          } else {
            // 修改地址
            delete submitData.___path;
            delete submitData.updateBy;
            delete submitData.updateTime;
            editAddress(submitData).then((res) => {
              if (res.data.success) {
                uni.navigateBack();
              }
            });
          }
        }
      });
    },

    // 三级地址联动回调
    getpickerParentValue(e) {
      // 将需要绑定的地址设置为空，并赋值
      this.form.consigneeAddressIdPath = [];
      this.form.consigneeAddressPath = [];
      let name = "";

      e.forEach((item, index) => {
        if (item.id) {
          // 遍历数据
          this.form.consigneeAddressIdPath.push(item.id);
          this.form.consigneeAddressPath.push(item.localName);
          name += item.localName;
          this.form.___path = name;
          
          // 如果有 countryCode，设置到 form 中
          // 通常第一个 level 是国家
          if (item.countryCode) {
            this.form.countryCode = item.countryCode;
          }
        }
        if (index == e.length - 1) {
          //如果是最后一个
          if (item.center) {
            this.form.lat = item.center.split(",")[1];
            this.form.lon = item.center.split(",")[0];
          }
        }
      });
    },

    // 显示三级地址联动
    showPicker() {
      this.$refs.cityPicker.show();
    },
  },
  mounted() {},
  data() {
    return {
      lightColor: this.$lightColor, //高亮颜色
      mapFlag: false, // 地图选择开
      routerVal: "",
      form: {
        detail: "", //地址详情
        name: "", //收货人姓名
        mobile: "", //手机号码
        consigneeAddressIdPath: [], //地址id
        consigneeAddressPath: [], //地址名字
        ___path: "", //所在区域
        isDefault: false, //是否默认地址
        countryCode: "CN", // 国家代码
        postalCode: "", // 邮政编码
      },
      // 表单提交校验规则
      rules: {
        name: [
          {
            required: true,
            message: this.$t('address.inputConsigneeName'),
            trigger: ["blur", "change"],
          },
        ],
        mobile: [
          {
            required: true,
            message: this.$t('address.inputMobile'),
            trigger: ["blur", "change"],
          },
          {
            validator: (rule, value, callback) => {
              return uni.$u.test.mobile(value);
            },
            message: this.$t('auth.mobileError'),
            trigger: ["change", "blur"],
          },
        ],
        ___path: [
          {
            required: true,
            message: this.$t('address.selectRegionPlaceholder'),
            trigger: ["change"],
          },
        ],
        detail: [
          {
            required: true,
            message: this.$t('address.detail'),
            trigger: ["blur", "change"],
          },
        ],
      },
      list: [
        {
          id: "",
          localName: "国家/地区",
          children: [],
        },
      ],
    };
  },
  onLoad(option) {
    this.routerVal = option;
    // 如果当前是编辑地址,则需要查询出地址详情信息
    if (option.id) {
      uni.showLoading({
        title: this.$t('common.loading'),
      });
      getAddressDetail(option.id).then((res) => {
        const params = res.data.result;
        params.___path = params.consigneeAddressPath;
        this["form"] = params;
      }).finally(() => {
        uni.hideLoading();
      });
    }
  },
  // 初始化rules必须要在onReady生命周期，因为onLoad生命周期组件可能尚未创建完毕
  onReady() {
    this.$refs.uForm.setRules(this.rules);
  },
};
</script>
<style scoped lang="scss">
.detailAddress {
  ::v-deep  .u-form-item--left {
    display: flex;
    align-items: flex-start;
  }
}
.saveBtn,
.selectAddress {
  height: 70rpx;

  line-height: 70rpx;
  text-align: center;
  font-size: 30rpx;
  background: $aider-light-color;
  color: #fff;
  width: 70%;
  margin: 40rpx auto 0 auto;
  border-radius: 20rpx;
}
.selectAddress {
  margin-top: 40rpx;
  background: #fff;

  color: $aider-light-color;
  border: 2rpx solid $aider-light-color;
}

.uForm {
  width: 94%;
  overflow: hidden;
  left: 3%;
  position: relative;
  top: 2%;
  background: #fff;
  border-radius: 20rpx;
  padding: 0 0 40rpx 0;
}
.add-address {
  width: 100%;
  padding-top: 3%;

  ::v-deep  .u-form-item {
    background-color: #fff;
    padding: 24rpx 30rpx;
  }
  .u-btn {
    margin: 30rpx 30rpx 0 30rpx;
    background-color: $main-color;
  }

  ::v-deep .u-checkbox {
    margin: 30rpx 30rpx 0 30rpx;

    .u-label-class.u-checkbox__label {
      color: $font-color-light;
      font-size: $font-sm;
    }
  }
}
::v-deep  .u-checkbox__label {
  font-size: 28rpx;
}
</style>
