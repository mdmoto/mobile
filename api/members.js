/**
 * 会员相关API (Refactored for Vue2/Vue3 Bridge)
 */
import { request, Method } from "@/api/base.js";

/**
 * 意见反馈
 */
export async function feedBack(params) {
  return request({
    url: "/other/feedback",
    method: Method.POST,
    needToken: true,
    params,
  });
}

/**
 * 提现
 */
export async function withdrawalApply(params) {
  return request({
    url: "/wallet/wallet/withdrawal",
    method: Method.POST,
    needToken: true,
    params,
  });
}

/**
 * 支付结果查询
 * @param {Object} params { orderType, sn }
 */
export async function payCallback(params) {
  return request({
    url: `/payment/cashier/result`,
    method: Method.GET,
    params,
  });
}

/**
 * 在线充值
 */
export async function recharge(params) {
  return request({
    url: "/trade/recharge",
    method: Method.POST,
    params,
  });
}

/**
 * 分页获取预存款充值记录
 */
export async function getUserRecharge(params) {
  return request({
    url: "/member/recharge",
    method: Method.GET,
    needToken: true,
    params,
  });
}

/**
 * 分页获取预存款充值记录 (钱包记录)
 */
export async function getWalletLog(params) {
  return request({
    url: "/wallet/log",
    method: Method.GET,
    needToken: true,
    params,
  });
}

/**
 * 获取优惠券列表
 */
export async function getCoupons(params) {
  return request({
    url: "/promotion/coupon/getCoupons",
    method: Method.GET,
    needToken: true,
    params,
  });
}

/**
 * 领取优惠券
 */
export async function receiveCoupons(couponId) {
  return request({
    url: `/promotion/coupon/receive/${couponId}`,
    method: Method.GET,
    needToken: true,
  });
}

/**
 * 获取猫币明细数据
 */
export async function getPointsData(params) {
  return request({
    url: "member/memberPointsHistory/getByPage",
    method: Method.GET,
    needToken: true,
    params,
  });
}

/**
 * 获取我的评论列表
 */
export async function getComments(params) {
  return request({
    url: "/member/evaluation",
    method: Method.GET,
    needToken: true,
    params,
  });
}

/**
 * 获取当前会员的浏览数量
 */
export async function getFootprintNum(params) {
  return request({
    url: "/member/footprint/getFootprintNum",
    method: Method.GET,
    needToken: true,
    params,
  });
}

/**
 * 订单评论
 */
export async function commentsMemberOrder(params) {
  return request({
    url: "/member/evaluation",
    method: Method.POST,
    needToken: true,
    header: { "content-type": "application/x-www-form-urlencoded" },
    data: params,
  });
}

/**
 * 追加评论
 */
export async function AppendCommentsOrder(params) {
  return request({
    url: "members/comments/additional",
    method: Method.POST,
    needToken: true,
    header: { "content-type": "application/x-www-form-urlencoded" },
    data: params,
  });
}

/**
 * 商品咨询
 */
export async function consultating(goods_id, ask_content, anonymous) {
  return request({
    url: "members/asks",
    method: Method.POST,
    header: { "content-type": "application/x-www-form-urlencoded" },
    needToken: true,
    data: {
      goods_id,
      ask_content,
      anonymous,
    },
  });
}

/**
 * 获取商品收藏
 */
export async function getGoodsCollection(params, type) {
  return request({
    url: `/member/collection/${type}`,
    method: Method.GET,
    needToken: true,
    loading: false,
    message: false,
    params,
  });
}

/**
 * 获取店铺收藏
 */
export async function getStoreCollection(params, type) {
  return request({
    url: `/member/storeCollection/${type}`,
    method: Method.GET,
    needToken: true,
    loading: false,
    message: false,
    params,
  });
}

/**
 * 收藏商品
 */
export async function collectionGoods(type, id) {
  return request({
    url: `/member/collection/add/${type}/${id}`,
    method: Method.POST,
    needToken: true,
  });
}

/**
 * 删除商品收藏
 */
export async function deleteGoodsCollection(ids) {
  if (Array.isArray(ids)) {
    ids = ids.join(",");
  }
  return request({
    url: `/member/collection/delete/GOODS/${ids}`,
    method: Method.DELETE,
    needToken: true,
  });
}

/**
 * 删除店铺收藏
 */
export async function deleteStoreCollection(store_id) {
  return request({
    url: `/member/storeCollection/delete/STORE/${store_id}`,
    method: Method.DELETE,
    needToken: true,
  });
}

/**
 * 获取商品是否被收藏
 */
export async function getGoodsIsCollect(type, good_id) {
  return request({
    url: `/member/collection/isCollection/${type}/${good_id}`,
    method: Method.GET,
    needToken: true,
    loading: false,
  });
}

/**
 * 获取店铺是否被收藏
 */
export async function getStoreIsCollect(type, store_id) {
  return request({
    url: `/member/storeCollection/isCollection/${type}/${store_id}`,
    method: Method.GET,
    needToken: true,
    loading: false,
  });
}

/**
 * 收藏店铺
 */
export async function collectionStore(store_id) {
  return request({
    url: `/member/storeCollection/add/STORE/${store_id}`,
    method: Method.POST,
    needToken: true,
  });
}

/**
 * 获取当前登录的用户信息
 */
export async function getUserInfo() {
  return request({
    url: "/passport/member",
    method: Method.GET,
    needToken: true,
  });
}

/**
 * 获取当前用户的预存款
 */
export async function getUserWallet() {
  return request({
    url: "/wallet/wallet",
    method: Method.GET,
    needToken: true,
  });
}

/**
 * 保存用户信息
 */
export async function saveUserInfo(params) {
  return request({
    url: "/passport/member/editOwn",
    method: Method.PUT,
    header: { "content-type": "application/x-www-form-urlencoded" },
    needToken: true,
    data: params,
  });
}

/**
 * 添加发票
 */
export async function addReceipt(params) {
  return request({
    url: "/trade/receipt",
    method: Method.POST,
    needToken: true,
    params,
  });
}

/**
 * 获取商品评论列表
 */
export async function getGoodsComments(goodsId, params) {
  return request({
    url: `/member/evaluation/${goodsId}/goodsEvaluation`,
    method: Method.GET,
    loading: false,
    params,
  });
}

/**
 * 获取商品评论数量统计
 */
export async function getGoodsCommentsCount(goodsId) {
  return request({
    url: `/member/evaluation/${goodsId}/evaluationNumber`,
    method: Method.GET,
    loading: false,
  });
}

/**
 * 获取未读消息数量信息
 */
export async function getNoReadMessageNum() {
  return request({
    url: `members/member-nocice-logs/number`,
    method: Method.GET,
    needToken: true,
  });
}

/**
 * 我的足迹列表
 */
export async function myTrackList(params) {
  return request({
    url: `/member/footprint`,
    method: Method.GET,
    needToken: true,
    params,
  });
}

/**
 * 根据id删除会员足迹
 */
export async function deleteHistoryListId(ids) {
  return request({
    url: `/member/footprint/delByIds/${ids}`,
    method: Method.DELETE,
    needToken: true,
  });
}

/**
 * 获取当前会员优惠券列表
 */
export async function getMemberCoupons(data) {
  return request({
    url: `/promotion/coupon/getCoupons`,
    method: Method.GET,
    needToken: true,
    params: data,
  });
}

/**
 * 获取当前会员可使用的优惠券数量
 */
export async function getCouponsNum() {
  return request({
    url: `/promotion/coupon/getCouponsNum`,
    method: Method.GET,
    needToken: true,
  });
}

/**
 * 获取会员猫币总计详情
 */
export async function getMemberPointSum() {
  return request({
    url: `member/memberPointsHistory/getMemberPointsHistoryVO`,
    method: Method.GET,
  });
}

/**
 * 获取提现设置
 */
export async function withdrawalSettingVO() {
  return request({
    url: `/wallet/wallet/withdrawalSettingVO`,
    method: Method.GET,
    needToken: true,
  });
}

