/**
 * IM 聊天相关API (Refactored for Vue2/Vue3 Bridge)
 */
import { request, Method } from "@/api/base.js";
import api from "@/config/api.js";

/**
 * 获取聊天详情
 */
export async function getTalk(talkId) {
  return request({
    url: `${api.im}/talk/${talkId}`,
    method: Method.GET,
  });
}

/**
 * 获取与用户的聊天详情
 */
export async function getTalkByUser(userId) {
  return request({
    url: `${api.im}/talk/by/user/${userId}`,
    method: Method.GET,
  });
}

/**
 * 获取聊天列表
 */
export async function getTalkList(params) {
  return request({
    url: `${api.im}/talk/list`,
    method: Method.GET,
    params
  });
}

/**
 * 获取聊天消息记录
 */
export async function getTalkMessage(params) {
  return request({
    url: `${api.im}/message`,
    method: Method.GET,
    params
  });
}

/**
 * 清除未读消息
 */
export async function cleanUnreadMessage(params) {
  return request({
    url: `${api.im}/message/clean/unred`,
    method: Method.PUT,
    params
  });
}

/**
 * 从商品页点击客服跳转获取商品详情
 */
export async function jumpObtain(skuId, goodsId) {
  return request({
    url: `/goods/goods/sku/${goodsId}/${skuId}`,
    method: Method.GET,
  });
}

/**
 * 清除所有消息未读状态
 */
export async function clearmeaager() {
  return request({
    url: `${api.im}/message/clean/unred`,
    method: Method.PUT,
  });
}

