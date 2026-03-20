/** 配置楼层模块的跳转 */
import { uniNavigateTo, uniSwitchTab } from "@/utils/nav.js";

export function modelNavigateTo(item) {
	let val = item.url || item;
	//链接跳转到专题

	if (val && val.id && val.pageType == "special") {
		uniNavigateTo(`/pages/tabbar/special/special?id=${val.id}`);
	}
	switch (val.___type || val.type) {
		case "goods":
			uniNavigateTo("/pages/product/goods?id=" + val.id + "&goodsId=" + val.goodsId);
			break;
		case "category":
			if (val.id) {
				uniNavigateTo(`/pages/navigation/search/searchPage?category=${val.id}`);
			} else {
				uniNavigateTo(`/pages/navigation/search/searchPage`);
			}
			break;
		case "shops":
			uniNavigateTo(`/pages/product/shopPage?id=${val.id}`);
			break;
			// 活动
		case "marketing":
			switch (val.___promotion) {
				// 猫币商品
				case "POINTS_GOODS":
					uniNavigateTo(`/pages/promotion/point/detail?id=${val.promotionId}`);
					break;
				// 砍价
				case "KANJIA":
					uniNavigateTo(`/pages/promotion/bargain/detail?id=${val.promotionId}`);
					break;
				// 优惠券商品
				case "COUPON":
					uniNavigateTo("/pages/product/goods?id=" + val.skuId + "&goodsId=" + val.goodsId);
					break;
				// 满减商品
				case "FULL_DISCOUNT":
					uniNavigateTo("/pages/product/goods?id=" + val.skuId + "&goodsId=" + val.goodsId);
					break;
				// 秒杀频道
				case "SECKILL":
					uniNavigateTo("/pages/product/goods?id=" + val.skuId + "&goodsId=" + val.goodsId);
					break;
			}
			break;
		case "pages":
			uniNavigateTo(val.___path + "?id=" + val.id + "&title=" + val.title);
			break;
		case "other":
			switch (val.title || item.title) {
				case "首页":
					uniSwitchTab(`/pages/tabbar/home/index`);
					break;
				case "购物车":
					uniSwitchTab(`/pages/tabbar/cart/cartList`);
					return;
				case "个人中心":
					uniSwitchTab(`/pages/tabbar/user/my`);
					break;
				case "收藏商品":
					uniNavigateTo(`/pages/mine/myCollect`);
					break;
				case "我的订单":
					uniNavigateTo(`/pages/order/myOrder?status=0`);
					break;
				case "领券中心":
					uniNavigateTo(`/pages/cart/coupon/couponCenter`);
					break;
				case "签到":
					uniNavigateTo(`/pages/mine/signIn`);
					break;
				case "秒杀频道":
					uniNavigateTo(`/pages/promotion/seckill`);
					break;
				case "拼团频道":
					uniNavigateTo(`/pages/promotion/joinGroup`);
					break;
				case "小程序直播":
					uniNavigateTo(`/pages/promotion/lives`);
					break;
				case "砍价":
					uniNavigateTo(`/pages/promotion/bargain/list`);
					break;
				case "猫币商城":
					uniNavigateTo(`/pages/promotion/point/pointList`);
					break;
				case "店铺列表":
					uniNavigateTo(`/pages/product/shopList`);
					break;
				case "活动":
				case "优惠券活动":
				case "券活动":
					uniNavigateTo(`/pages/cart/coupon/couponCenter`);
					break;
				default:
					// #ifdef H5
					window.location.href = val.url || item.link;
					// #endif
					// #ifdef APP-PLUS
					plus.runtime.openURL(val.url || item.link) //不需要拼接\
					// #endif
					break;
			}

			break;
	}
}


	

import config from "@/config/config";

async function scan() {
  // #ifdef APP-PLUS
  let isIos = plus.os.name == "iOS";
  // 判断是否是Ios
  if (isIos) {
    const iosFirstCamera = uni.getStorageSync("iosFirstCamera"); //是不是第一次开启相机
    if (iosFirstCamera !== "false") {
      uni.setStorageSync("iosFirstCamera", "false"); //设为false就代表不是第一次开启相机
      seacnCode();
    } else {
      if (permision.judgeIosPermission("camera")) {
        seacnCode();
      } else {
        // 没有权限提醒是否去申请权限
        tipsGetSettings();
      }
    }
  } else {
    /**
     * TODO 安卓 权限已经授权了，调用api总是显示用户已永久拒绝申请。人傻了
     * TODO 如果xdm有更好的办法请在 https://gitee.com/beijing_hongye_huicheng/maollar/issues 提下谢谢
     */
    seacnCode();
  }

  // #endif

  // #ifdef MP-WEIXIN
  seacnCode();
  // #endif
}
/**
 * 提示获取权限
 */
function tipsGetSettings() {
  uni.showModal({
    title: "提示",
    content: "您已经关闭相机权限,去设置",
    success: function (res) {
      if (res.confirm) {
        if (isIos) {
          plus.runtime.openURL("app-settings:");
        } else {
          permision.gotoAppPermissionSetting();
        }
      }
    },
  });
}

function seacnCode() {
  uni.scanCode({
    success: function (res) {
      let path = encodeURIComponent(res.result);

      // WX_CODE 为小程序码
      if (res.scanType == "WX_CODE") {
        console.log(res);
        uniNavigateTo(`/${res.path}`);
      } else {
        config.scanAuthNavigation.forEach((src) => {
          if (res.result.indexOf(src) != -1) {
            uniNavigateTo(`/${res.result.substring(src.length)}`);
          } else {
            setTimeout(() => {
              uniNavigateTo("/pages/tabbar/home/web-view?src=" + path);
            }, 100);
          }
        });
      }
    },
  });
	}
