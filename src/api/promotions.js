/**
 * 促销相关API (Refactored for Vue2/Vue3 Bridge)
 */
import { request, Method } from "@/api/base.js";

/**
 * 获取直播列表
 */
export async function getLiveList(params) {
  return request({
    url: `broadcast/studio`,
    method: Method.GET,
    params,
  });
}

/**
 * 获取拼团群组成员
 */
export async function getPromotionGroupMember(pintuanId) {
  return request({
    url: `promotion/pintuan/${pintuanId}/members`,
    method: Method.GET,
  });
}

/**
 * 获取拼团商品列表
 */
export async function getAssembleList(params) {
  return request({
    url: "promotion/pintuan",
    method: Method.GET,
    loading: false,
    params,
  });
}

/**
 * 获取猫币商城分类
 */
export async function getPointsCategory() {
  return request({
    url: "/promotion/pointsGoods/category",
    method: Method.GET,
  });
}

/**
 * 获取猫币商城商品
 */
export async function getPointsGoods(params) {
  return request({
    url: "/promotion/pointsGoods",
    method: Method.GET,
    params,
  });
}

/**
 * 获取猫币商城商品详情
 */
export async function getPointsGoodsDetail(id) {
  return request({
    url: "/promotion/pointsGoods/" + id,
    method: Method.GET,
  });
}

/**
 * 获取限时抢购时间线 (当天)
 */
export async function getSeckillTimeLine() {
  return request({
    url: "promotion/seckill",
    method: Method.GET,
  });
}

/**
 * 获取指定时刻的限时抢购商品
 */
export async function getSeckillTimeGoods(timeline) {
  return request({
    url: `promotion/seckill/${timeline}`,
    method: Method.GET,
  });
}

/**
 * 获取全部优惠券
 */
export async function getAllCoupons(params) {
  return request({
    url: "/promotion/coupon",
    method: Method.GET,
    params,
  });
}

/**
 * 分页获取砍价商品
 */
export async function getBargainList(params) {
  return request({
    url: "/promotion/kanjiaGoods",
    method: Method.GET,
    params,
  });
}

/**
 * 获取砍价商品详情
 */
export async function getBargainDetail(id) {
  return request({
    url: `/promotion/kanjiaGoods/${id}`,
    method: Method.GET,
  });
}

/**
 * 获取砍价活动详情
 */
export async function getBargainActivity(params) {
  return request({
    url: `/promotion/kanjiaGoods/getKanjiaActivity`,
    method: Method.POST,
    params,
  });
}

/**
 * 发起砍价活动
 */
export async function openBargain(params) {
  return request({
    url: `/promotion/kanjiaGoods`,
    method: Method.POST,
    header: { "content-type": "application/x-www-form-urlencoded" },
    data: params,
  });
}

/**
 * 获取砍价帮砍记录
 */
export async function getBargainLog(params) {
  return request({
    url: `/promotion/kanjiaGoods/getKanjiaActivity/logs`,
    method: Method.GET,
    params,
  });
}

/**
 * 帮砍一刀
 */
export async function helpBargain(kanJiaActivityId) {
  return request({
    url: `promotion/kanjiaGoods/help/${kanJiaActivityId}`,
    method: Method.POST,
  });
}

/**
 * 获取我参与的砍价活动
 */
export async function getMineBargainLog(params) {
  return request({
    url: `/promotion/kanjiaGoods/kanjiaActivity/mine/`,
    method: Method.GET,
    params
  });
}


