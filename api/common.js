/**
 * 公共API (Refactored for Vue2/Vue3 Bridge)
 */
import { request, Method } from "@/api/base.js";
import api from "@/config/api.js";

/**
 * 获取地区数据
 */
export async function getRegionsById(id = 0) {
  return request({
    url: `${api.common}/common/region/item/${id}`,
    method: Method.GET,
    message: false,
  });
}

/**
 * 获取IM接口前缀
 */
export async function getIMDetail() {
  return request({
    url: `${api.common}/IM`,
    method: Method.GET,
    message: false,
  });
}

/**
 * 文件上传地址
 */
export const upload = api.common + "/common/upload/file";

/**
 * 发送邮箱验证码
 */
export async function sendEmail(email, verificationEnums = 'REGISTER') {
  return request({
    url: `${api.common}/common/email/${verificationEnums}/${email}`,
    method: Method.GET,
    message: false,
  });
}

/**
 * 获取滑块验证码
 */
export async function getSlider(business, uuid) {
  return request({
    url: `${api.common}/common/slider/${business}`,
    method: Method.GET,
    header: { uuid },
  });
}

/**
 * 验证滑块
 */
export async function validSlider(business, uuid, xPos) {
  return request({
    url: `${api.common}/common/slider/${business}?xPos=${xPos}`,
    method: Method.POST,
    header: { uuid },
  });
}