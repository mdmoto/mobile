/**
 * 店铺相关API (Refactored for Vue2/Vue3 Bridge)
 */
import { request, Method } from "@/api/base.js";

/**
 * 获取店铺列表
 */
export async function getStoreList(params) {
  return request({
    url: '/store/store',
    method: Method.GET,
    params,
  });
}

/**
 * 获取店铺基本信息
 */
export async function getStoreBaseInfo(storeId) {
  return request({
    url: `/store/store/get/detail/${storeId}`,
    method: Method.GET,
    loading: false,
  });
}

/**
 * 获取店铺分门别类列表
 */
export async function getStoreCategory(id) {
  return request({
    url: `/store/store/label/get/${id}`,
    method: Method.GET,
  });
}

/**
 * 获取店铺营业执照图片
 */
export async function getLicencePhoto(id) {
  return request({
    url: `/store/store/get/licencePhoto/${id}`,
    method: Method.GET,
  });
}

/**
 * 获取店铺自提点分页列表
 */
export async function getStoreAddress(storeId, params) {
  return request({
    url: `/store/address/page/${storeId}`,
    method: Method.GET,
    params
  });
}


