/**
 * 登录/通行证相关API (Refactored for Vue2/Vue3 Bridge)
 */
import { request, Method } from "@/api/base.js";
import api from "@/config/api.js";

/**
 * 通过短信重置密码
 * @param {Object} params { mobile }
 */
export async function resetByMobile(params) {
  return request({
    url: `/passport/member/resetByMobile`,
    method: Method.POST,
    params,
  });
}

/**
 * 绑定手机号码
 */
export async function bindMobile(params) {
  return request({
    url: `/passport/member/bindMobile`,
    method: Method.POST,
    params,
  });
}

/**
 * 获取自动发券
 */
export async function getAutoCoup() {
  return request({
    url: `/promotion/coupon/activity`,
    method: Method.GET,
    needToken: true,
  });
}

/**
 * 账号密码登陆
 */
export async function userLogin(params, clientType) {
  return request({
    method: Method.POST,
    url: `/passport/member/userLogin`,
    data: params,
    header: {
      "content-type": "application/x-www-form-urlencoded",
      clientType: clientType,
    },
  });
}

/**
 * 发送验证码
 */
export async function sendMobile(mobile, type = 'LOGIN') {
  return request({
    url: `${api.common}/common/sms/${type}/${mobile}`,
    method: Method.GET,
  });
}

/**
 * 短信登录
 */
export async function smsLogin(params, clientType) {
  return request({
    url: `/passport/member/smsLogin`,
    method: Method.POST,
    data: params,
    header: {
      "content-type": "application/x-www-form-urlencoded",
      clientType: clientType,
    },
  });
}

/**
 * 注册
 */
export async function register(params, clientType) {
  return request({
    url: `/passport/member/register`,
    method: Method.POST,
    data: params,
    header: {
      "content-type": "application/x-www-form-urlencoded",
      clientType: clientType,
    },
  });
}

/**
 * 修改密码
 */
export async function modifyPass(params) {
  return request({
    url: `/passport/member/modifyPass`,
    method: Method.PUT,
    params,
  });
}

/**
 * 重置密码
 */
export async function resetPassword(params) {
  return request({
    url: `/passport/member/resetPassword`,
    method: Method.POST,
    params,
  });
}

/**
 * 刷新token
 */
export async function refreshTokenFn(refresh_token) {
  return request({
    url: `/passport/member/refresh/${refresh_token}`,
    method: Method.GET,
  });
}

/**
 * 登出
 */
export async function logout() {
  return request({
    url: '/passport/member/logout',
    method: Method.POST,
    needToken: true,
  });
}

/**
 * App 扫码登录
 */
export async function scannerCodeLogin(params) {
  return request({
    url: '/passport/member/app_scanner',
    method: Method.POST,
    params,
    needToken: true,
  });
}

/**
 * App 扫码确认
 */
export async function scannerCodeLoginConfirm(params) {
  return request({
    url: '/passport/member/app_confirm',
    method: Method.POST,
    params,
    needToken: true,
  });
}

/**
 * 注销用户
 */
export async function logoffConfirm() {
  return request({
    url: '/passport/member/cancellation',
    method: Method.PUT,
    needToken: true,
  });
}
