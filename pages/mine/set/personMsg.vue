<template>
  <view class="person-msg">
    <view class="head c-content" @click="changeFace">
      <image :src="form.face || '/static/missing-face.png'" mode=""></image>
      <view>{{ $t('user.changeFace') }}</view>
    </view>
    <u-form :model="form" ref="uForm" class="form">
      <u-form-item :label="$t('user.nickname')" label-width="150">
        <u-input v-model="form.nickName" :placeholder="$t('user.pleaseInputNickname')" />
      </u-form-item>
      <u-form-item :label="$t('user.gender')" label-width="150">
        <u-radio-group v-model="form.sex" :active-color="lightColor">
          <u-radio name="1">{{ $t('user.male') }}</u-radio>
          <u-radio name="0">{{ $t('user.female') }}</u-radio>
        </u-radio-group>
      </u-form-item>

      <u-form-item :label="$t('user.birthday')" label-width="150" right-icon="arrow-right">
        <div style="width: 100%;" @click="showBirthday = true">{{ birthday || $t('user.pleaseSelectBirthday') }}</div>
       <u-picker v-model="showBirthday" mode="time" :confirm-color="lightColor" @confirm="selectTime"></u-picker>
      </u-form-item>
      <u-form-item :label="$t('user.city')" label-width="150" :placeholder="$t('user.pleaseSelectCity')" right-icon="arrow-right">
        <div style="width: 100%;" @click="clickRegion">{{ form.___path || $t('user.pleaseSelectCity') }}</div>
      </u-form-item>
	  
	  <u-form-item :label="$t('user.mobile')" label-width="150">
		<view v-if="form.mobile">
			{{form.mobile}}
		</view>
		<view v-else>
			<view class="submit" @click="navigateTo(form.username)">{{ $t('user.bindMobile') }}</view>
		</view>
	  </u-form-item>
    
    </u-form>
    <div class="bottom">
      <view class="submit" @click="submit">{{ $t('common.save') }}</view>
	    <view class="submit light" @click="quiteLoginOut">{{ $t('user.logout') }}</view>
    </div>
    <m-city :provinceData="region" :headTitle="$t('user.regionSelection')" ref="cityPicker" @funcValue="getPickerParentValue" pickerSize="4"></m-city>
  </view>
</template>
<script>
import { saveUserInfo, getUserInfo } from "@/api/members.js";
import { upload } from "@/api/common.js";
import storage from "@/utils/storage.js";
import uFormItem from "@/uview-ui/components/u-form-item/u-form-item.vue";
import city from "@/components/m-city/m-city.vue";
export default {
  components: { uFormItem, "m-city": city },
  data() {
    return {
      lightColor: this.$lightColor, //高亮颜色
      form: {
        nickName: storage.getUserInfo().nickName || "",
        birthday: storage.getUserInfo().birthday || "",
        face: storage.getUserInfo().face || "/static/missing-face.png", //默认头像
        regionId: [], //地址Id
        region: storage.getUserInfo().region || [], //地址
        sex: storage.getUserInfo().sex, //性别
        ___path: storage.getUserInfo().region,
		mobile: storage.getUserInfo().mobile,
		username: storage.getUserInfo().username,
      },
      birthday: storage.getUserInfo().birthday || "", //生日
      photo: [
        { text: this.$t('user.takePhoto'), color: this.$mainColor },
        { text: this.$t('user.chooseFromAlbum'), color: this.$mainColor },
      ],
      region: [
        //请求城市默认地址
        {
          id: "",
          localName: this.$t('user.pleaseSelect'),
          children: [],
        },
      ],
      showBirthday: false, //显示生日日期
    };
  },
  methods: {
	  /**
	   * 退出登录
	   */
	  quiteLoginOut() {
      this.$options.filters.quiteLoginOut();
	  },
	  
    /**
     * 选择地址回调
     */
    getPickerParentValue(e) {
      this.form.region = [];
      this.form.regionId = [];
      let name = "";

      e.forEach((item, index) => {
        if (item.id) {
          this.form.region.push(item.localName);
          this.form.regionId.push(item.id);
          if (index == e.length - 1) {
            name += item.localName;
          } else {
            name += item.localName + ",";
          }
          this.form.___path = name;
        }
      });
    },

    /**
     * 点击选择地址
     */
    clickRegion() {
      this.$refs.cityPicker.show();
    },

    /**
     * 提交保存
     */
    submit() {
      delete this.form.___path;
      let params = JSON.parse(JSON.stringify(this.form));
      saveUserInfo(params).then((res) => {
        if (res.statusCode == 200) {
          storage.setUserInfo(res.data.result);
          uni.navigateBack();
        }
      });
    },

    /**
     * 修改头像
     */
    changeFace(index) {
      uni.chooseImage({
        success: (chooseImageRes) => {
          const tempFilePaths = chooseImageRes.tempFilePaths;
          uni.uploadFile({
            url: upload,
            filePath: tempFilePaths[0],
            name: "file",
            header: {
              accessToken: storage.getAccessToken(),
            },
            success: (uploadFileRes) => {
              let data = JSON.parse(uploadFileRes.data);

              this.form.face = data.result;
            },
          });
        },
      });
    },

    /**
     * 选择地址
     */
    selectRegion(region) {
      this.$set(
        this.form,
        "address",
        `${region.province.label} ${region.city.label} ${region.area.label}`
      );
    },

    /**
     * 选择时间
     */
    selectTime(time) {
      this.form.birthday = `${time.year}-${time.month}-${time.day}`;
      this.birthday = `${time.year} - ${time.month} - ${time.day}`;
    },
	
	navigateTo(username) {
	  uni.navigateTo({
	    url: '/pages/mine/set/securityCenter/bindMobile' + '?username=' + username,
	  });
	},
  },

  /**
   * 加载数据
   */
  onLoad() {},
};
</script>
<style>
page{
  background: #fff;
}
</style>
<style lang="scss" scoped>
.submit {
  height: 90rpx;
  line-height: 90rpx;
  text-align: center;
  margin-top: 90rpx;

  width: 100%;
  margin: 0 auto;
  color: $main-color;
  border-radius: 100px;
}
.head {
  height: 260rpx;
  color: $font-color-light;
  font-size: $font-sm;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  line-height: 2em;
  image {
    width: 144rpx;
    height: 144rpx;
    border-radius: 50%;
  }
}
::v-deep  .u-form {
  background-color: #ffffff;
  padding: 0;
  margin-top: 30rpx;
  .u-form-item {
    padding: 0 20rpx;
    height: 110rpx;
    line-height: 110rpx;
  }
}
.form {
  background-color: #ffffff;
}
.bottom{
  position: fixed;
  bottom: 40px;
  display: flex;
  align-items: center;
  width: 100%;
  >.submit{
    background: $light-color;
    color: #fff;
    width: 40%;
  }

}
.light{
  background: rgba($color: $light-color, $alpha: 0.2) !important;
  color: $light-color !important;
}
</style>
