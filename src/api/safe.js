/**
 * 安全中心相关API (Refactored for Vue2/Vue3 Bridge)
 */
import { request, Method } from "@/api/base.js";
import storage from "@/utils/storage.js"
import { md5 } from '@/utils/md5.js'

/**
 * 发送绑定手机短信验证码
 */
export async function sendBindMobileSms(mobile, captcha) {
  return request({
    url: `members/security/bind/send/${mobile}`,
    method: Method.POST,
    needToken: true,
    header: { 'content-type': "application/x-www-form-urlencoded" },
    data: {
      uuid: storage.getUuid(),
      captcha,
    },
  });
}

/**
 * 绑定手机号码
 */
export async function bindMobile(mobile, sms_code) {
  return request({
    url: `members/security/bind/${mobile}`,
    method: Method.PUT,
    needToken: true,
    data: { sms_code },
  });
}

/**
 * 发送安全验证短信 (修改手机/更改密码通用)
 */
export async function sendMobileSms(captcha) {
  return request({
    url: 'members/security/send',
    method: Method.POST,
    needToken: true,
    header: { 'content-type': "application/x-www-form-urlencoded" },
    data: {
      uuid: storage.getUuid(),
      captcha,
    },
  });
}

/**
 * 验证更换手机号短信原手机号
 */
export async function validChangeMobileSms(sms_code) {
  return request({
    url: 'members/security/exchange-bind',
    method: Method.GET,
    needToken: true,
    params: { sms_code },
  });
}

/**
 * 更换绑定手机号
 */
export async function changeMobile(mobile, sms_code) {
  return request({
    url: `members/security/exchange-bind/${mobile}`,
    method: Method.PUT,
    header: { 'content-type': "application/x-www-form-urlencoded" },
    needToken: true,
    data: { sms_code },
  });
}

/**
 * 修改登录密码
 */
export async function changePassword(captcha, password) {
  return request({
    url: 'members/security/password',
    method: Method.PUT,
    header: { 'content-type': "application/x-www-form-urlencoded" },
    needToken: true,
    data: {
      uuid: storage.getUuid(),
      captcha,
      password: md5(password),
    },
  });
}

/**
 * 获取实名认证进度状态
 */
export async function contractStep() {
  return request({
    url: `members/contract/step`,
    method: Method.GET,
    needToken: true
  })
}

/**
 * 提交实名认证申请
 */
export async function authentication(params) {
  return request({
    url: `members/contract/authentication`,
    method: Method.POST,
    needToken: true,
    header: { 'content-type': "application/x-www-form-urlencoded" },
    data: params
  })
}
