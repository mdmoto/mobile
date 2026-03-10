/**
 * 订单相关API (Refactored for Vue2/Vue3 Bridge)
 */
import { request, Method } from "@/api/base.js";

/**
 * 获取可用发票列表
 */
export async function getReceipt(params) {
  return request({
    url: "/trade/carts/select/receipt",
    method: Method.GET,
    needToken: true,
    params,
  });
}

/**
 * 获取发票详情
 */
export async function getReceiptDetail(id) {
  return request({
    url: `/trade/receipt/${id}`,
    method: Method.GET,
    needToken: true,
  });
}

/**
 * 选择配送方式
 */
export async function selectedShipMethod(params) {
  return request({
    url: "/trade/carts/shippingMethod",
    method: Method.GET,
    needToken: true,
    params,
  });
}

/**
 * 获取订单列表
 */
export async function getOrderList(params) {
  return request({
    url: "/order/order",
    method: Method.GET,
    needToken: true,
    params,
  });
}

/**
 * 获取订单详情
 */
export async function getOrderDetail(orderSn) {
  return request({
    url: `/order/order/${orderSn}`,
    method: Method.GET,
    needToken: true,
  });
}

/**
 * 取消订单
 */
export async function cancelOrder(orderSn, reason) {
  return request({
    url: `/order/order/${orderSn}/cancel`,
    method: Method.POST,
    needToken: true,
    header: { "content-type": "application/x-www-form-urlencoded" },
    data: reason,
  });
}

/**
 * 确认收货
 */
export async function confirmReceipt(orderSn) {
  return request({
    url: `/order/order/${orderSn}/receiving`,
    method: Method.POST,
    needToken: true,
  });
}

/**
 * 获取拼团分享信息
 */
export async function getPinTuanShare(parentOrderSn, skuId) {
  return request({
    url: `promotion/pintuan/share`,
    method: Method.GET,
    needToken: true,
    params: { parentOrderSn, skuId }
  });
}

