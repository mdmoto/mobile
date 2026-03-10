/**
 * 店铺入驻相关API (Refactored for Vue2/Vue3 Bridge)
 */
import { request, Method } from "@/api/base.js";

/**
 * 获取当前用户的店铺入驻申请详情
 */
export async function getCompanyDetail(params) {
  return request({
    url: "/store/store/apply",
    method: Method.GET,
    params,
  });
}

/**
 * 申请店铺第一步-填写企业信息
 */
export async function applyFirst(params) {
  return request({
    url: "/store/store/apply/first",
    method: Method.PUT,
    params,
  });
}

/**
 * 申请店铺第二步-填写银行信息
 */
export async function applySecond(params) {
  return request({
    url: "/store/store/apply/second",
    method: Method.PUT,
    params,
  });
}

/**
 * 申请店铺第三步-确认信息
 */
export async function applyThird(params) {
  return request({
    url: "/store/store/apply/third",
    method: Method.PUT,
    params,
  });
}
