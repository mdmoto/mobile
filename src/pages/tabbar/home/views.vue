<template>
  <div class="wrapper">
    <!-- uni 中不能使用 vue component 所以用if判断每个组件 -->
    <div v-for="(item, index) in pageData.list" :key="index">
      <template v-if="item.type == 'search'">
        <search style="width: 100%" :res="item.options" />
      </template>
      <carousel v-if="item.type == 'carousel' || item.type == 'banner' || item.type == 'slider' || item.type == 'BANNER' || item.type == 'BANNER_FLOOR'" :res="item.options" />
      <titleLayout v-if="item.type == 'title'" :res="item.options" />
      <leftOneRightTwo v-if="item.type == 'leftOneRightTwo'" :res="item.options" />
      <leftTwoRightOne v-if="item.type == 'leftTwoRightOne'" :res="item.options" />
      <topOneBottomTwo v-if="item.type == 'topOneBottomTwo'" :res="item.options" />
      <topTwoBottomOne v-if="item.type == 'topTwoBottomOne'" :res="item.options" />
      <flexThree v-if="item.type == 'flexThree'" :res="item.options" />
      <flexFive v-if="item.type == 'flexFive'" :res="item.options" />
      <flexFour v-if="item.type == 'flexFour'" :res="item.options" />
      <flexTwo v-if="item.type == 'flexTwo'" :res="item.options" />
      <textPicture v-if="item.type == 'textPicture'" :res="item.options" />
      <menuLayout v-if="item.type == 'menu'" :res="item.options" />
      <flexOne v-if="item.type == 'flexOne' || item.type == 'IMAGE_FLOOR' || item.type == 'image_floor' || item.type == 'IMAGE'" :res="item.options" />
      <goods :enableBottomLoad="enableLoad" v-if="item.type == 'goods'" :res="item.options" />
      <group v-if="item.type == 'group'" :res="item.options" />
      <notice v-if="item.type == 'notice'" :res="item.options" />
      <promotions v-if="item.type == 'promotionDetail'" :res="item.options" />
    </div>
  </div>
</template>

<script>
// 引用组件
import tpl_banner from "@/pages/tabbar/home/template/tpl_banner"; //导航栏模块
import tpl_title from "@/pages/tabbar/home/template/tpl_title"; //标题栏模块
import tpl_left_one_right_two from "@/pages/tabbar/home/template/tpl_left_one_right_two"; //左一右二模块
import tpl_left_two_right_one from "@/pages/tabbar/home/template/tpl_left_two_right_one"; //左二右一模块
import tpl_top_one_bottom_two from "@/pages/tabbar/home/template/tpl_top_one_bottom_two"; //上一下二模块
import tpl_top_two_bottom_one from "@/pages/tabbar/home/template/tpl_top_two_bottom_one"; //上二下一模块
import tpl_flex_one from "@/pages/tabbar/home/template/tpl_flex_one"; //单行图片模块
import tpl_flex_two from "@/pages/tabbar/home/template/tpl_flex_two"; //两张横图模块
import tpl_flex_three from "@/pages/tabbar/home/template/tpl_flex_three"; //三列单行图片模块
import tpl_flex_five from "@/pages/tabbar/home/template/tpl_flex_five"; //五列单行图片模块
import tpl_flex_four from "@/pages/tabbar/home/template/tpl_flex_four"; //四列单行图片模块
import tpl_text_picture from "@/pages/tabbar/home/template/tpl_text_picture"; //文字图片模板
import tpl_menu from "@/pages/tabbar/home/template/tpl_menu"; //五列菜单模块
import tpl_search from "@/pages/tabbar/home/template/tpl_search"; //搜索栏
import tpl_group from "@/pages/tabbar/home/template/tpl_group"; //
import tpl_goods from "@/pages/tabbar/home/template/tpl_goods"; //商品分类以及分类中的商品
// 结束引用组件
import { getFloorData } from "@/api/home"; //获取楼层装修接口
import permission from "@/js_sdk/wa-permission/permission.js"; //权限工具类
import config from "@/config/config";

import tpl_notice from "@/pages/tabbar/home/template/tpl_notice"; //标题栏模块
import tpl_promotions from "@/pages/tabbar/home/template/tpl_promotions_detail"; //标题栏模块
import storage from "@/utils/storage.js";

export default {
  data () {
    return {
      config,
      storage,
      pageData: "", //楼层页面数据
      isIos: "",
      enableLoad: false, //触底加载 针对于商品模块
    };
  },
  components: {
    carousel: tpl_banner,
    titleLayout: tpl_title,
    leftOneRightTwo: tpl_left_one_right_two,
    leftTwoRightOne: tpl_left_two_right_one,
    topOneBottomTwo: tpl_top_one_bottom_two,
    topTwoBottomOne: tpl_top_two_bottom_one,
    flexThree: tpl_flex_three,
    flexFive: tpl_flex_five,
    flexFour: tpl_flex_four,
    flexTwo: tpl_flex_two,
    textPicture: tpl_text_picture,
    menuLayout: tpl_menu,
    search: tpl_search,
    flexOne: tpl_flex_one,
    goods: tpl_goods,
    group: tpl_group,
    notice: tpl_notice,
    promotions: tpl_promotions,
  },

  mounted () {
    this.init();
    // #ifdef MP-WEIXIN
    // 小程序默认分享
    uni.showShareMenu({ withShareTicket: true });
    // #endif
   
  },
  methods: {
    /**
     * 实例化首页数据楼层
     */
    init () {
      this.pageData = "";
      getFloorData().then((res) => {
        const payload = (res && (res.result || (res.data && res.data.result))) || res;
        console.log('FLOOR_DIAGNOSTIC: raw payload', payload);
        const rawPageData = payload && payload.pageData;
        if (!rawPageData) {
          console.error('FLOOR_DIAGNOSTIC: no pageData found');
          this.pageData = "";
          return;
        }

        try {
          const result = typeof rawPageData === "string" ? JSON.parse(rawPageData) : rawPageData;
          console.log('FLOOR_DIAGNOSTIC: parsed pageData', result);
          this.pageData = result;
          if (result && Array.isArray(result.list) && result.list.length) {
            result.list.forEach((m, i) => {
              console.log(`FLOOR_DIAGNOSTIC: module ${i} type ${m.type}`);
            });
            const lastModule = result.list[result.list.length - 1];
            if (lastModule && lastModule.type == 'goods') {
              this.enableLoad = true;
            }
          }
        } catch (e) {
          console.error("Failed to parse floor pageData", e, rawPageData);
          this.pageData = "";
        }
      });
    },

    /**
     * TODO 扫码功能后续还会后续增加
     */
    scanCode () {
      uni.scanCode({
        success: function (res) {
          let path = encodeURIComponent(res.result);
          if (path != undefined && path.indexOf("QR_CODE_LOGIN_SESSION") == 0) {
            uni.navigateTo({
              url: "/pages/passport/scannerCodeLoginConfirm?token=" + path
            });
            return;
          }

          if (res.scanType == "WX_CODE") {
            uni.navigateTo({
              url: `/${res.path}`,
            });
          } else {
            config.scanAuthNavigation.forEach((src) => {
              if (res.result.indexOf(src) != -1) {
                uni.navigateTo({
                  url: `/${res.result.substring(src.length)}`,
                });
              } else {
                setTimeout(() => {
                  uni.navigateTo({
                    url: "/pages/tabbar/home/web-view?src=" + path,
                    });
                }, 100);
              }
            });
          }
        },
      });
    },

    /**
     * 提示获取权限
     */
    tipsGetSettings () {
      uni.showModal({
        title: "提示",
        content: "您已经关闭相机权限,去设置",
        success: function (res) {
          if (res.confirm) {
            if (this.isIos) {
              plus.runtime.openURL("app-settings:");
            } else {
              permission.gotoAppPermissionSetting();
            }
          }
        },
      });
    },

    /**
     * 唤醒客户端扫码
     */
    async scan () {
      // #ifdef APP-PLUS
      this.isIos = plus.os.name == "iOS";
      if (this.isIos) {
        const iosFirstCamera = uni.getStorageSync("iosFirstCamera"); 
        if (iosFirstCamera !== "false") {
          uni.setStorageSync("iosFirstCamera", "false"); 
          this.scanCode();
        } else {
          if (permission.judgeIosPermission("camera")) {
            this.scanCode();
          } else {
            this.tipsGetSettings();
          }
        }
      } else {
        this.scanCode();
      }
      // #endif

      // #ifdef MP-WEIXIN
      this.scanCode();
      // #endif
    },
  },
};
</script>

<style scoped lang="scss">
.navbar-right {
  padding: 0 16rpx 0 0;
}
</style>
