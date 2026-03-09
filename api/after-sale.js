/**
 * 申请售后相关API (Refactored for Vue2/Vue3 Bridge)
 */
import { request, Method } from "@/api/base.js";

/**
 * 获取售后列表
 */
export async function getAfterSale(params) {
  return request({
    url: "after-sales/refunds",
    method: Method.GET,
    needToken: true,
    loading: false,
    params,
  });
}

/**
 * 申请取消订单
 */
export async function applyCancelOrder(params) {
  return request({
    url: "after-sales/apply/cancel/order",
    method: Method.POST,
    needToken: true,
    params,
  });
}

/**
 * 获取商家售后收件地址
 */
export async function getStoreAfterSaleAddress(sn) {
  return request({
    url: `/order/afterSale/getStoreAfterSaleAddress/${sn}`,
    method: Method.GET,
    needToken: true,
  });
}

/**
 * 取消售后
 */
export async function cancelAfterSale(afterSaleSn) {
  return request({
    url: `/order/afterSale/cancel/${afterSaleSn}`,
    method: Method.POST,
    needToken: true,
  });
}

/**
 * 获取售后服务记录相关数据
 */
export async function getAfterSaleList(params) {
  return request({
    url: `/order/afterSale/page`,
    method: Method.GET,
    needToken: true,
    params,
  });
}

/**
 * 查看售后服务详情
 */
export async function getServiceDetail(sn) {
  return request({
    url: `/order/afterSale/get/${sn}`,
    method: Method.GET,
    needToken: true,
  });
}

/**
 * 添加投诉
 */
export async function addComplain(params) {
  return request({
    url: `/order/complain`,
    method: Method.POST,
    needToken: true,
    header: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    data: params,
  });
}

/**
 * 取消投诉
 */
export async function clearComplain(id, params) {
  return request({
    url: `/order/complain/status/${id}`,
    method: Method.PUT,
    needToken: true,
    params,
  });
}

/**
 * 获取售后日志
 */
export async function getAfterSaleLog(sn) {
  return request({
    url: `/order/afterSale/get/getAfterSaleLog/${sn}`,
    method: Method.GET,
    needToken: true,
  });
}

/**
 * 投诉列表
 */
export async function getComplain(params) {
  return request({
    url: `/order/complain`,
    method: Method.GET,
    needToken: true,
    params,
  });
}

/**
 * 获取申请原因
 */
export async function getAfterSaleReason(serviceType) {
  return request({
    url: `/order/afterSale/get/afterSaleReason/${serviceType}`,
    method: Method.GET,
    needToken: true,
  });
}

/**
 * 获取取消原因
 */
export async function getClearReason() {
  return request({
    url: `/order/afterSale/get/afterSaleReason/CANCEL`,
    method: Method.GET,
    needToken: true,
  });
}

/**
 * 获取投诉原因
 */
export async function getComplainReason() {
  return request({
    url: `/order/afterSale/get/afterSaleReason/COMPLAIN`,
    method: Method.GET,
    needToken: true,
  });
}

/**
 * 获取投诉详情
 */
export async function getComplainDetail(id) {
  return request({
    url: `/order/complain/${id}`,
    method: Method.GET,
    needToken: true,
  });
}

/**
 * 获取申请售后页面信息
 */
export async function getAfterSaleInfo(sn) {
  return request({
    url: `/order/afterSale/applyAfterSaleInfo/${sn}`,
    method: Method.GET,
    needToken: true,
  });
}

/**
 * 申请退货服务
 */
export async function applyReturn(orderItemSn, params) {
  return request({
    url: `/order/afterSale/save/${orderItemSn}`,
    method: Method.POST,
    header: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    data: params,
  });
}

/**
 * 填充物流信息
 */
export async function fillShipInfo(afterSaleSn, params) {
  return request({
    url: `/order/afterSale/delivery/${afterSaleSn}`,
    method: Method.POST,
    header: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    data: params,
  });
}

/**
 * 添加交易投诉对话
 */
export async function communication(params) {
  return request({
    url: `/order/complain/communication`,
    method: Method.POST,
    needToken: true,
    params
  });
}