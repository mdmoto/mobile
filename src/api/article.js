/**
 * 文章相关API (Refactored for Vue2/Vue3 Bridge)
 */
import { request, Method } from '@/api/base.js';
import api from '@/config/api.js';

/**
 * 获取某个分类的文章列表
 * @param {string} category_type
 */
export async function getArticleCategory(category_type) {
  return request({
    url: `${api.base}/pages/article-categories`,
    method: Method.GET,
    params: { category_type },
  });
}

/**
 * 获取文章详情
 * @param {string} type
 */
export async function getArticleDetail(type) {
  return request({
    // 静态文章类接口在 common-api（与 buyer-api 解耦）
    baseURL: api.common,
    url: `/other/article/get/${type}`,
    method: Method.GET,
  });
}

/**
 * 获取根据类型获取文章详情 (适配特定商取引法等静态页逻辑)
 * @param {string} type
 */
export async function getArticleDetailByType(type, baseURL) {
  return request({
    // 默认走 common-api；如需兼容旧部署可传入 api.buyer 覆盖
    baseURL: baseURL || api.common,
    url: `/other/article/type/${type}`,
    method: Method.GET,
  });
}


