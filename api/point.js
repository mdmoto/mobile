/**
 * 积分/签到相关API (Refactored for Vue2/Vue3 Bridge)
 */
import { request, Method } from "@/api/base.js";

/**
 * 签到
 */
export async function sign() {
  return request({
    url: '/members/sign',
    method: Method.POST,
    needToken: true,
  });
}

/**
 * 获取签到记录
 */
export async function signTime(time) {
  return request({
    url: '/members/sign?time=' + time,
    method: Method.GET,
    needToken: true,
  });
}
