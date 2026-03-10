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
    url: `/other/article/get/${type}`,
    method: Method.GET,
  });
}

/**
 * 获取根据类型获取文章详情 (适配特定商取引法等静态页逻辑)
 * @param {string} type
 */
export async function getArticleDetailByType(type) {
  return request({
    url: `/other/article/type/${type}`,
    method: Method.GET,
  });
}



