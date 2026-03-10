/**
 * 首页/内容相关API (Refactored for Vue2/Vue3 Bridge)
 */
import { request, Method } from "@/api/base.js";

/**
 * 获取专题
 */
export async function toSpecial(data) {
  return request({
    url: `/other/pageData/getSpecial`,
    method: Method.GET,
    data
  });
}

/**
 * 专题内容详情
 */
export async function getSpecial(id) {
  return request({
    url: `/other/pageData/get/${id}`,
    method: Method.GET,
  });
}

/**
 * 获取广告图
 */
export async function getAdvertisement() {
  return request({
    url: "/advertisement",
    method: Method.GET,
  });
}

/**
 * 获取首页商品分类
 */
export async function getCategory(parent_id = 0) {
  return request({
    url: `goods/categories/${parent_id}/children`,
    method: Method.GET,
    loading: false,
  });
}

/**
 * 获取热门关键词
 */
export async function getHotKeywords(count) {
  return request({
    url: "/goods/goods/hot-words",
    method: Method.GET,
    loading: false,
    params: { count },
  });
}

/**
 * 获取首页楼层数据
 */
export async function getFloorData(params) {
  return request({
    url: `/other/pageData/getIndex?clientType=H5`,
    method: Method.GET,
    params
  });
}

/**
 * 获取店铺楼层数据
 */
export async function getFloorStoreData(params) {
  return request({
    url: `/other/pageData?pageClientType=H5`,
    method: Method.GET,
    params
  });
}

/**
 * 获取首页分类层级数据
 */
export async function getCategoryIndexData(parentId = 0) {
  return request({
    url: `/goods/category/get/${parentId}`,
    method: Method.GET,
  });
}
