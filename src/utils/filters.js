import { logout, logoffConfirm } from "@/api/login";
import { getUserInfo } from "@/api/members";
import storage from "@/utils/storage.js";
import config from '@/config/config';
import Foundation from "./Foundation.js";

/**
 * 币种符号映射 (根据用户要求：仅显示符号，不带英文字母)
 */
const symbolMap = {
  CNY: "¥",
  USD: "$",
  JPY: "¥",
  EUR: "€",
  GBP: "£",
  KRW: "₩",
  THB: "฿",
  SAR: "SR",
  HKD: "$",
  MYR: "RM",
  SGD: "$",
  TWD: "NT$",
};

/**
 * 获取当前币种符号
 */
export function currencySymbol() {
  const currency = storage.getCurrency();
  return symbolMap[currency] || "¥";
}

/**
 * 获取支持的币种列表
 */
export function getCurrencyList() {
  return [
    { code: 'USD', name: 'US Dollar', symbol: '$' },
    { code: 'CNY', name: '简体中文', symbol: '¥' },
    { code: 'JPY', name: '日本語', symbol: '¥' },
    { code: 'EUR', name: 'Euro', symbol: '€' },
    { code: 'KRW', name: '한국어', symbol: '₩' },
    { code: 'THB', name: 'ภาษาไทย', symbol: '฿' },
    { code: 'SAR', name: 'العربية', symbol: 'SR' },
  ];
}

/**
 * 金钱格式化与转换
 * @param val 原始价格 (通常为 CNY)
 * @param unit 自定义符号
 * @param location 输出位置控制
 */
export function unitPrice(val, unit, location) {
  if (val === undefined || val === null) val = 0;

  const currency = storage.getCurrency();
  const rateData = storage.getExchangeRates() || {};
  
  // 极致防御：确保 rates 始终是一个有效的对象，且包含基础汇率
  let rates = { CNY: 7.24, JPY: 154, USD: 1.0 };
  if (rateData && typeof rateData === 'object' && !Array.isArray(rateData)) {
      // 兼容两种结构：直接是 {} 或者是 {rates: {}}
      const source = rateData.rates || rateData;
      if (source && typeof source === 'object' && source.CNY) {
          rates = source;
      }
  }

  let symbol = symbolMap[currency] || "¥";

  // 计算逻辑：CNY -> USD (基准) -> Target
  // 汇率格式：1 USD = X Local (例如 CNY: 7.24)
  const usdPrice = val / (rates.CNY || 7.24);
  let convertedPrice = usdPrice;
  if (currency !== 'USD') {
    const rate = rates[currency] || 1.0;
    convertedPrice = usdPrice * rate;
  }

  let price = Foundation.formatPrice(convertedPrice);
  
  if (location === "before") {
    return (unit || symbol) + price.substr(0, price.length - 3);
  }
  if (location === "after") {
    return price.substr(-2);
  }
  return (unit || symbol) + price;
}

/**
 * 格式化价格返回数组 [整数, 小数]
 */
export function goodsFormatPrice(val) {
  if (val === undefined || val === null) {
    return ["0", "00"];
  }

  const currency = storage.getCurrency();
  const rateData = storage.getExchangeRates() || {};
  
  let rates = { CNY: 7.24, JPY: 154, USD: 1.0 };
  if (rateData && typeof rateData === 'object' && !Array.isArray(rateData)) {
      const source = rateData.rates || rateData;
      if (source && typeof source === 'object' && source.CNY) {
          rates = source;
      }
  }

  const usdPrice = val / (rates.CNY || 7.24);
  let convertedPrice = usdPrice;
  if (currency !== 'USD') {
    const rate = rates[currency] || 1.0;
    convertedPrice = usdPrice * rate;
  }

  let valNum = new Number(convertedPrice);
  return valNum.toFixed(2).split(".");
}

/**
 * 将内容复制到粘贴板
 */
import { h5Copy } from "@/js_sdk/h5-copy/h5-copy.js";
export function setClipboard(val) {
  // #ifdef H5
  if (val === null || val === undefined) {
    val = "";
  } else val = val + "";
  const result = h5Copy(val);
  if (result === false) {
    uni.showToast({
      title: "不支持",
    });
  } else {
    uni.showToast({
      title: "复制成功",
      icon: "none",
    });
  }
  // #endif

  // #ifndef H5
  uni.setClipboardData({
    data: val,
    success: function () {
      uni.showToast({
        title: "复制成功!",
        duration: 2000,
        icon: "none",
      });
    },
  });
  // #endif
}

/**
 * 拨打电话
 */
export function callPhone(phoneNumber) {
  uni.makePhoneCall({
    phoneNumber: phoneNumber,
  });
}

/**
 * 脱敏姓名
 */
export function noPassByName(str) {
  if (null != str && str != undefined) {
    if (str.length <= 3) {
      return "*" + str.substring(1, str.length);
    } else if (str.length > 3 && str.length <= 6) {
      return "**" + str.substring(2, str.length);
    } else if (str.length > 6) {
      return str.substring(0, 2) + "****" + str.substring(6, str.length);
    }
  } else {
    return "";
  }
}

/**
 * 时间转换
 */
export function unixToDate(unix, format) {
  let _format = format || "yyyy-MM-dd hh:mm:ss";
  const d = new Date(unix * 1000);
  const o = {
    "M+": d.getMonth() + 1,
    "d+": d.getDate(),
    "h+": d.getHours(),
    "m+": d.getMinutes(),
    "s+": d.getSeconds(),
    "q+": Math.floor((d.getMonth() + 3) / 3),
    S: d.getMilliseconds(),
  };
  if (/(y+)/.test(_format))
    _format = _format.replace(
      RegExp.$1,
      (d.getFullYear() + "").substr(4 - RegExp.$1.length)
    );
  for (const k in o)
    if (new RegExp("(" + k + ")").test(_format))
      _format = _format.replace(
        RegExp.$1,
        RegExp.$1.length === 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length)
      );
  return _format;
}

/**
 * 人性化显示时间
 */
export function beautifyTime(datetime = "") {
  if (datetime == null || datetime == undefined || !datetime) {
    return "";
  }
  datetime = timestampToTime(datetime).replace(/-/g, "/");

  let time = new Date();
  let outTime = new Date(datetime);
  if (/^[1-9]\d*$/.test(datetime)) {
    outTime = new Date(parseInt(datetime) * 1000);
  }

  if (time.getTime() < outTime.getTime()) {
    return parseTime(outTime, "{y}/{m}/{d}");
  }

  if (time.getFullYear() != outTime.getFullYear()) {
    return parseTime(outTime, "{y}/{m}/{d}");
  }

  if (time.getMonth() != outTime.getMonth()) {
    return parseTime(outTime, "{m}/{d}");
  }

  if (time.getDate() != outTime.getDate()) {
    let day = outTime.getDate() - time.getDate();
    if (day == -1) {
      return parseTime(outTime, "昨天 {h}:{i}");
    }

    if (day == -2) {
      return parseTime(outTime, "前天 {h}:{i}");
    }

    return parseTime(outTime, "{m}-{d}");
  }

  if (time.getHours() != outTime.getHours()) {
    return parseTime(outTime, "{h}:{i}");
  }

  let minutes = outTime.getMinutes() - time.getMinutes();
  if (minutes == 0) {
    return "刚刚";
  }

  minutes = Math.abs(minutes);
  return `${minutes}分钟前`;
}
// 时间转换
function timestampToTime(timestamp) {
  var date = new Date(timestamp);
  var Y = date.getFullYear() + '-';
  var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
  var D = date.getDate() + ' ';
  var h = date.getHours() + ':';
  var m = date.getMinutes() + ':';
  var s = date.getSeconds();
  return Y + M + D + h + m + s;
}

/**
 * 脱敏手机号
 */
export function secrecyMobile(mobile) {
  mobile = String(mobile);
  if (!/\d{11}/.test(mobile)) {
    return mobile;
  }
  return mobile.replace(/(\d{3})(\d{4})(\d{4})/, "$1****$3");
}

/**
 * 人性化时间显示
 */
export function formatTime(datetime) {
  if (datetime == null) return "";

  datetime = datetime.replace(/-/g, "/");

  let time = new Date();
  let outTime = new Date(datetime);
  if (/^[1-9]\d*$/.test(datetime)) {
    outTime = new Date(parseInt(datetime) * 1000);
  }

  if (
    time.getTime() < outTime.getTime() ||
    time.getFullYear() != outTime.getFullYear()
  ) {
    return parseTime(outTime, "{y}-{m}-{d} {h}:{i}");
  }

  if (time.getMonth() != outTime.getMonth()) {
    return parseTime(outTime, "{m}-{d} {h}:{i}");
  }

  if (time.getDate() != outTime.getDate()) {
    let day = outTime.getDate() - time.getDate();
    if (day == -1) {
      return parseTime(outTime, "昨天 {h}:{i}");
    }

    if (day == -2) {
      return parseTime(outTime, "前天 {h}:{i}");
    }

    return parseTime(outTime, "{m}-{d} {h}:{i}");
  }

  if (time.getHours() != outTime.getHours()) {
    return parseTime(outTime, "{h}:{i}");
  }

  let minutes = outTime.getMinutes() - time.getMinutes();
  if (minutes == 0) {
    return "刚刚";
  }

  minutes = Math.abs(minutes);
  return `${minutes}分钟前`;
}

/**
 * 时间格式化方法
 */
export function parseTime(time, cFormat) {
  if (arguments.length === 0 || !time) {
    return null;
  }

  let date;
  const format = cFormat || "{y}-{m}-{d} {h}:{i}:{s}";

  if (typeof time === "object") {
    date = time;
  } else {
    if (typeof time === "string" && /^[0-9]+$/.test(time)) {
      time = parseInt(time);
    }
    if (typeof time === "number" && time.toString().length === 10) {
      time = time * 1000;
    }
    if (typeof time === "string") {
      date = new Date(time.replace(/-/g, "/"));
    } else {
      date = new Date(time);
    }
  }

  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay(),
  };

  const time_str = format.replace(/{([ymdhisa])+}/g, (result, key) => {
    const value = formatObj[key];
    if (key === "a") {
      return ["日", "一", "二", "三", "四", "五", "六"][value];
    }
    return value.toString().padStart(2, "0");
  });

  return time_str;
}

/**
 * 清除逗号
 */
export function clearStrComma(str) {
  str = str.replace(/,/g, "");
  return str;
}

/**
 * 判断用户是否登录
 */
export function isLogin(val) {
  let userInfo = storage.getUserInfo();
  if (val == "auth") {
    return userInfo && userInfo.id ? true : false;
  } else {
    return storage.getUserInfo();
  }
}

/**
 * 退出登录
 */
export function quiteLoginOut() {
  uni.showModal({
    title: "提示",
    content: "是否退出登录？",
    confirmColor: config.mainColor,
    async success(res) {
      if (res.confirm) {
        storage.setAccessToken("");
        storage.setRefreshToken("");
        storage.setUserInfo({});
        storage.setHasLogin(false)
        navigateToLogin("redirectTo");
        await logout();
      }
    },
  });
}

/**
 * 用户注销
 */
export function logoff() {
  uni.showModal({
    title: "提示",
    content: "确认注销用户么？注销用户将无法再次登录并失去当前数据。",
    confirmColor: config.mainColor,
    async success(res) {
      if (res.confirm) {
        await logoffConfirm();
        storage.setAccessToken("");
        storage.setRefreshToken("");
        storage.setUserInfo({});
        navigateToLogin("redirectTo");
      }
    },
  });
}


/**
 * 跳转im
 */
export function talkIm(storeId, goodsId, id) {
  if (isLogin('auth')) {
    let url = `/pages/mine/im/index?userId=${storeId}`
    if (goodsId && id) url = `/pages/mine/im/index?userId=${storeId}&goodsid=${goodsId}&skuid=${id}`
    uni.navigateTo({
      url
    });
  }
  else {
    tipsToLogin()
  }
}

export function tipsToLogin(type) {
  if (!isLogin("auth")) {
    uni.showModal({
      title: "提示",
      content: "当前用户未登录是否登录？",
      confirmText: "确定",
      cancelText: "取消",
      confirmColor: config.mainColor,
      success: (res) => {
        if (res.confirm) {
          navigateToLogin();
        } else if (res.cancel) {
          if (type !== 'normal') {
            uni.navigateBack();
          }
        }
      },
    });
    return false;
  }
  return true;
}

/**
 * 获取用户信息并重新添加到缓存里面
 */
export async function userInfo() {
  try {
    const result = await getUserInfo();
    storage.setUserInfo(result);
    return result;
  } catch (err) {
    console.error('Failed to get user info:', err);
  }
}

/**
 * 验证是否登录如果没登录则去登录
 */
export function forceLogin() {
  let userInfo = storage.getUserInfo();
  if (!userInfo || !userInfo.id) {
    // #ifdef MP-WEIXIN
    uni.navigateTo({
      url: "/pages/passport/wechatMPLogin",
    });
    // #endif

    // #ifndef MP-WEIXIN
    uni.navigateTo({
      url: "/pages/passport/login",
    });
    //  #endif
  }
}

/**
 * 获取当前加载的页面对象
 */
export function getPages(val) {
  const pages = getCurrentPages();
  const currentPage = pages[pages.length - 1];
  const url = currentPage.route;

  return val ? currentPage : url;
}

/**
 * 跳转到登录页面
 */
export function navigateToLogin(type) {
  const jumpType = (typeof type === "string" && type) || "navigateTo";
  // #ifdef MP-WEIXIN
  uni[jumpType]({
    url: "/pages/passport/wechatMPLogin",
  });
  // #endif
  // #ifndef MP-WEIXIN
  uni[jumpType]({
    url: "/pages/passport/login",
  });
  //  #endif
}

/**
 * 服务状态列表
 */
export function serviceStatusList(val) {
  let statusList = {
    APPLY: "申请售后",
    PASS: "通过售后",
    REFUSE: "拒绝售后",
    BUYER_RETURN: "买家退货，待卖家收货",
    SELLER_RE_DELIVERY: "商家换货/补发",
    SELLER_CONFIRM: "卖家确认收货",
    SELLER_TERMINATION: "卖家终止售后",
    BUYER_CONFIRM: "买家确认收货",
    BUYER_CANCEL: "买家取消售后",
    WAIT_REFUND: "等待平台退款",
    COMPLETE: "完成售后",
  };
  return statusList[val];
}

/**
 * 订单状态列表
 */
export function orderStatusList(val) {
  let orderStatusList = {
    UNDELIVERED: "待发货",
    UNPAID: "未付款",
    PAID: "已付款",
    PARTS_DELIVERED: "部分发货",
    DELIVERED: "已发货",
    CANCELLED: "已取消",
    COMPLETED: "已完成",
    COMPLETE: "已完成",
    TAKE: "待核验",
    STAY_PICKED_UP: "待自提",
  };
  return orderStatusList[val];
}
