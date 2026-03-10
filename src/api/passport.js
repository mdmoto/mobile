/**
 * 用户认证/找回密码相关API (Refactored for Vue2/Vue3 Bridge)
 */
import storage from '@/utils/storage.js';
import { request, Method } from "@/api/base.js";
import { md5 } from '@/utils/md5.js';

/**
 * 普通登录 (账号密码)
 */
export async function login(username, password, captcha) {
  return request({
    url: 'passport/login',
    method: Method.POST,
    params: {
      username,
      password: md5(password),
      captcha,
      uuid: storage.getUuid(),
    },
  });
}

/**
 * 验证账户信息
 */
export async function validAccount(captcha, account) {
  return request({
    url: 'passport/find-pwd',
    method: Method.GET,
    params: {
      uuid: storage.getUuid(),
      captcha,
      account,
    },
  });
}

/**
 * 发送找回密码短信
 */
export async function sendFindPasswordSms(uuid, captcha) {
  return request({
    url: 'passport/find-pwd/send',
    method: Method.POST,
    header: { 'content-type': "application/x-www-form-urlencoded" },
    data: {
      uuid: uuid,
      captcha,
    },
  });
}

/**
 * 校验找回密码验证码
 */
export async function validFindPasswordSms(uuid, sms_code) {
  return request({
    url: 'passport/find-pwd/valid',
    method: Method.GET,
    params: {
      uuid,
      sms_code,
    },
  });
}

/**
 * 修改密码【找回密码流程】
 */
export async function changePassword(password, uuid) {
  if (!uuid) {
    uuid = storage.getUuid();
  }
  return request({
    url: 'passport/find-pwd/update-password',
    method: Method.PUT,
    header: { 'content-type': "application/x-www-form-urlencoded" },
    data: {
      uuid,
      password: md5(password),
    },
  });
}

/**
 * 保存生物认证登录信息
 */
export async function setBiolofy(params) {
  return request({
    url: `passport/login/save/biology`,
    method: Method.POST,
    params
  });
}
