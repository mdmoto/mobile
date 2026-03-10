/**
 * 交易相关API (Refactored for Vue2/Vue3 Bridge)
 */
import { request, Method } from "@/api/base.js";

/**
 * 获取购物车列表
 */
export async function getCarts() {
  return request({
    url: `/trade/carts/all`,
    method: Method.GET,
    needToken: true,
    loading: false,
  });
}

/**
 * 获取购物车总数
 */
export async function getCartNum() {
  return request({
    url: `/trade/carts/count`,
    method: Method.GET,
    needToken: true,
    loading: false,
  });
}

/**
 * 获取购物车可用优惠券数量
 * @param {string} way
 */
export async function getCartCouponNum(way) {
  return request({
    url: `/trade/carts/coupon/num?way=${way}`,
    method: Method.GET,
    needToken: true,
    loading: false,
  });
}

/**
 * 添加货品到购物车
 */
export async function addToCart(data) {
  return request({
    url: "/trade/carts",
    method: Method.POST,
    needToken: true,
    header: { "content-type": "application/x-www-form-urlencoded" },
    data,
  });
}

/**
 * 更新购物车商品数量
 */
export async function updateSkuNum(skuId, num = 1) {
  return request({
    url: `/trade/carts/sku/num/${skuId}`,
    method: Method.POST,
    header: { "content-type": "application/x-www-form-urlencoded" },
    needToken: true,
    data: { num },
  });
}

/**
 * 更新购物车货品选中状态
 */
export async function updateSkuChecked(skuId, checked) {
  return request({
    url: `/trade/carts/sku/checked/${skuId}`,
    method: Method.POST,
    needToken: true,
    header: { "content-type": "application/x-www-form-urlencoded" },
    data: { checked },
  });
}

/**
 * 删除多个货品项
 */
export async function deleteSkuItem(skuIds) {
  return request({
    url: `/trade/carts/sku/remove?skuIds=${skuIds}`,
    method: Method.DELETE,
    needToken: true,
  });
}

/**
 * 设置全部货品为选中或不选中
 */
export async function checkAll(checked) {
  return request({
    url: "/trade/carts/sku/checked",
    method: Method.POST,
    needToken: true,
    params: { checked },
  });
}

/**
 * 设置店铺内全部货品选中状态
 */
export async function checkStore(storeId, checked) {
  return request({
    url: `/trade/carts/store/${storeId}`,
    method: Method.POST,
    needToken: true,
    header: { "content-type": "application/x-www-form-urlencoded" },
    data: { checked },
  });
}

/**
 * 获取结算参数
 */
export async function getCheckoutParams(way) {
  return request({
    url: "/trade/carts/checked?way=" + way,
    method: Method.GET,
    needToken: true,
  });
}

/**
 * 设置收货地址ID
 */
export async function setAddressId(addressId, way) {
  return request({
    url: `/trade/carts/shippingAddress?shippingAddressId=${addressId}&way=${way}`,
    method: Method.GET,
    needToken: true,
  });
}

/**
 * 设置店铺收货地址ID
 */
export async function setStoreAddressId(storeAddressId, way) {
  return request({
    url: `/trade/carts/storeAddress?storeAddressId=${storeAddressId}&way=${way}`,
    method: Method.GET,
    needToken: true,
  });
}

/**
 * 创建交易
 */
export async function createTrade(params) {
  return request({
    url: "/trade/carts/create/trade",
    method: Method.POST,
    needToken: true,
    message: false,
    data: params,
  });
}

/**
 * 根据交易编号或订单编号查询收银台数据
 */
export async function getCashierData(params) {
  return request({
    url: "payment/cashier/tradeDetail",
    method: Method.GET,
    needToken: true,
    params,
  });
}

/**
 * 发起支付
 */
export async function initiatePay(paymentMethod, paymentClient, params) {
  const isAlipayH5 = paymentMethod === 'ALIPAY' && paymentClient === 'H5';

  return request({
    url: `payment/cashier/pay/${paymentMethod}/${paymentClient}`,
    method: Method.GET,
    needToken: true,
    params,
    dataType: isAlipayH5 ? 'text' : 'json',
    // #ifndef MP-ALIPAY || APP-PLUS
    responseType: isAlipayH5 ? 'text' : undefined,
    // #endif
  });
}

/**
 * 查询物流
 */
export async function getExpress(orderSn) {
  return request({
    url: `/order/order/getTraces/${orderSn}`,
    method: Method.POST,
    needToken: true,
  });
}

/**
 * 获取当前会员可使用的优惠券列表
 */
export async function getMemberCanUse(data) {
  return request({
    url: `/promotion/coupon/canUse`,
    method: Method.GET,
    params: data,
  });
}

/**
 * 获取当前会员的优惠券列表
 */
export async function getMemberCouponList(data) {
  return request({
    url: `/promotion/coupon/getCoupons`,
    method: Method.GET,
    params: data,
  });
}

/**
 * 使用优惠券
 */
export async function useCoupon(params) {
  return request({
    url: `/trade/carts/select/coupon`,
    method: Method.GET,
    needToken: true,
    params: params,
  });
}

/**
 * 更换参与活动
 */
export async function changeActivity(params) {
  return request({
    url: "trade/promotion",
    method: Method.POST,
    needToken: true,
    data: params,
    header: { "content-type": "application/x-www-form-urlencoded" },
  });
}

/**
 * 根据单号重新购买
 */
export async function reBuy(sn) {
  return request({
    url: `trade/carts/rebuy/${sn}`,
    method: Method.POST,
    needToken: true,
  });
}

/**
 * 获取全部配送方式
 */
export async function shippingMethodList(params) {
  return request({
    url: `/trade/carts/shippingMethodList`,
    method: Method.GET,
    needToken: true,
    params: params,
  });
}

/**
 * 提交配送方式
 */
export async function setShipMethod(params) {
  return request({
    url: "/trade/carts/shippingMethod",
    method: Method.PUT,
    needToken: true,
    params,
  });
}

/**
 * 查看包裹列表
 */
export async function getPackage(orderSn) {
  return request({
    url: `/order/order/getPackage/${orderSn}`,
    method: Method.GET,
    needToken: true,
  });
}

/**
 * 加载 AI 推荐的草稿购物车
 */
export async function loadAiDraft(draftId) {
  return request({
    url: `/ai/cart/load_draft/${draftId}`,
    method: Method.GET,
    needToken: true,
  });
}