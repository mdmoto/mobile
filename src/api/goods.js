/**
 * 商品相关API (Refactored for Vue2/Vue3 Bridge)
 */
import { request, Method } from "@/api/base.js";

/**
 * 获取商品基础信息 (品牌、分类、属性)
 */
export async function getGoodsMessage(goodsId) {
  return request({
    url: `/goods/goods/get/${goodsId}`,
    method: Method.GET,
  });
}

/**
 * 获取相关商品 (推荐/关联)
 */
export async function getGoodsRelated(params) {
  return request({
    url: `/goods/goods/es/related`,
    method: Method.GET,
    params,
  });
}

/**
 * 获取商品 SKU 详情
 */
export async function getGoods(skuId, goodsId) {
  return request({
    url: `/goods/goods/sku/${goodsId}/${skuId}`,
    method: Method.GET,
  });
}

/**
 * 获取商品分销绑定信息
 */
export async function getGoodsDistribution(distributionId) {
  return request({
    url: `/distribution/distribution/bindingDistribution/${distributionId}`,
    method: Method.GET,
  });
}

/**
 * 分页搜索商品列表
 */
export async function getGoodsList(params) {
  return request({
    url: "/goods/goods/es",
    method: Method.GET,
    params,
  });
}

/**
 * 获取上新商品列表
 */
export async function getGoodsListUplog(params) {
  return request({
    url: "goods/search/uplog",
    method: Method.GET,
    params,
  });
}

/**
 * 获取标签商品 (热卖/新品/推荐)
 */
export async function getTagGoods(storeId, mark = "hot", num = 5) {
  return request({
    url: `goods/tags/${mark}/goods`,
    method: Method.GET,
    loading: false,
    params: {
      storeId,
      mark,
      num,
    },
  });
}

/**
 * 根据标签ID获取商品
 */
export async function getPlateformTagGoods(tag_id) {
  return request({
    url: `goods/tags/byid/${tag_id}`,
    method: Method.GET,
    loading: false,
  });
}

/**
 * 获取商品分类详情
 */
export async function getCategoryList(id) {
  return request({
    url: `/goods/category/get/${id}`,
    method: Method.GET,
    loading: false,
  });
}

/**
 * 获取当前会员的分销信息
 */
export async function distribution() {
  return request({
    url: `/distribution/distribution`,
    method: Method.GET,
  });
}

/**
 * 申请成为分销商
 */
export async function applyDistribution(params) {
  return request({
    url: `/distribution/distribution`,
    method: Method.POST,
    params,
  });
}

/**
 * 分销结算提现
 */
export async function cash(params) {
  return request({
    url: `/distribution/cash`,
    method: Method.POST,
    params,
  });
}

/**
 * 分销提现历史
 */
export async function cashLog(params) {
  return request({
    url: `/distribution/cash`,
    method: Method.GET,
    params
  });
}

/**
 * 分销订单列表
 */
export async function distributionOrderList(params) {
  return request({
    url: `/distribution/distribution/distributionOrder`,
    method: Method.GET,
    params
  });
}

/**
 * 获取分销商品列表
 */
export async function distributionGoods(params) {
  return request({
    url: `/distribution/goods`,
    method: Method.GET,
    params,
  });
}

/**
 * 选择/检查分销商品
 */
export async function checkedDistributionGoods(params) {
  return request({
    url: `/distribution/goods/checked/${params.id}`,
    method: Method.GET,
    params
  });
}

/**
 * 获取小程序码
 */
export async function getMpCode(params) {
  return request({
    url: `/passport/connect/miniProgram/mp/unlimited`,
    method: Method.GET,
    params
  });
}

/**
 * 解析小程序场景码 (Shortlink)
 */
export async function getMpScene(id) {
  return request({
    url: `/passport/connect/miniProgram/mp/unlimited/scene?id=${id}`,
    method: Method.GET,
  });
}
