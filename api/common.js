/**
 * 公共API
 */
import { http, Method } from "@/utils/request.js";
import api from "@/config/api.js";

/**
 * 获取地区数据
 * @param id
 */
export function getRegionsById(id = 0) {
  return http.request({
    url: `${api.common}/common/region/item/${id}`,
    method: Method.GET,
    message: false,
  });
}

// 获取IM接口前缀
export function getIMDetail() {
  return http.request({
    url: `${api.common}/IM`,
    method: Method.GET,
    message: false,
  });
}

/**
 * 文件上传地址
 * @type {string}
 */
export const upload = api.common + "/common/upload/file";

/**
 * 发送邮箱验证码
 * @param email 邮箱地址
 * @param verificationEnums 验证场景 (REGISTER, LOGIN, etc.)
 */
export function sendEmail(email, verificationEnums = 'REGISTER') {
  return http.request({
    url: `${api.common}/common/email/${verificationEnums}/${email}`,
    method: Method.GET,
    message: false,
  });
}