/**
 * 收货地址相关API (Refactored for Vue2/Vue3 Bridge)
 */
import { request, Method } from "@/api/base.js";
import api from "@/config/api.js";

/**
 * 获取收货地址列表
 */
export async function getAddressList(pageNumber, pageSize) {
  return request({
    url: "/member/address",
    method: Method.GET,
    needToken: true,
    params: { pageNumber, pageSize },
  });
}

/**
 * 获取物流公司列表
 */
export async function getLogistics() {
  return request({
    url: "/other/logistics",
    method: Method.GET,
    needToken: true,
    params: { pageNumber: 1, pageSize: 200, disabled: "OPEN" },
  });
}

/**
 * 通过 cityCode 获取地区代码
 */
export async function getAddressCode(cityCode, townName) {
  return request({
    url: api.common + "/common/region/region",
    method: Method.GET,
    needToken: true,
    params: { cityCode, townName },
  });
}

/**
 * 添加收货地址
 */
export async function addAddress(data) {
  return request({
    url: "/member/address",
    method: Method.POST,
    needToken: true,
    header: { "content-type": "application/x-www-form-urlencoded" },
    data: data,
  });
}

/**
 * 编辑收货地址
 */
export async function editAddress(params) {
  return request({
    url: `/member/address`,
    method: Method.PUT,
    needToken: true,
    header: { "content-type": "application/x-www-form-urlencoded" },
    data: params,
  });
}

/**
 * 删除收货地址
 */
export async function deleteAddress(id) {
  return request({
    url: `/member/address/delById/${id}`,
    method: Method.DELETE,
    needToken: true,
  });
}

/**
 * 根据ID获取收货地址详情
 */
export async function getAddressDetail(id) {
  return request({
    url: `/member/address/get/${id}`,
    method: Method.GET,
    loading: false,
    needToken: true,
  });
}

/**
 * 获取默认收货地址
 */
export async function getAddressDefault() {
  return request({
    url: `/member/address/get/default`,
    method: Method.GET,
    loading: false,
    needToken: true,
  });
}
