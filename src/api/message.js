/**
 * 站内消息相关API (Refactored for Vue2/Vue3 Bridge)
 */
import { request, Method } from "@/api/base.js";

/**
 * 获取微信消息订阅
 */
export async function getWeChatMpMessage() {
  return request({
    url: 'passport/connect/miniProgram/subscribeMessage',
    method: Method.GET
  });
}

/**
 * 获取消息列表
 */
export async function getMessages(params = {}) {
  params.pageSize = params.pageSize || 5;
  return request({
    url: 'members/member-nocice-logs',
    method: Method.GET,
    needToken: true,
    params,
  });
}

/**
 * 标记消息为已读
 */
export async function messageMarkAsRead(ids) {
  return request({
    url: `/message/member/${ids}`,
    method: Method.PUT,
    needToken: true,
  });
}

/**
 * 修改站内消息状态
 */
export async function editMessages(message_id, params) {
  return request({
    url: `/message/member/${message_id}`,
    method: Method.PUT,
    needToken: true,
    params
  });
}

/**
 * 获取站内消息 (旧版本)
 */
export async function messages(params) {
  return request({
    url: "/message/member",
    method: Method.GET,
    needToken: true,
    params,
  });
}

/**
 * 获取物流消息列表
 */
export async function getLogisticsMessages(params = {}) {
  params.pageSize = params.pageSize || 5;
  return request({
    url: 'trade/logistics/message',
    method: Method.GET,
    needToken: true,
    params,
  });
}

/**
 * 获取 App 版本
 */
export async function getAppVersion(appType) {
  return request({
    url: `/other/appVersion/${appType}`,
    method: Method.GET,
    type: "manager"
  });
}

/**
 * 获取 App 版本列表
 */
export async function getAppVersionList(type, data) {
  return request({
    url: `/other/appVersion/appVersion/${type}`,
    method: Method.GET,
    type: "manager",
    data
  });
}
