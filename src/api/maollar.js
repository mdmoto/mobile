/**
 * Maollar 系统相关API (Refactored for Vue2/Vue3 Bridge)
 */
import { request, Method } from "@/api/base.js";

/**
 * 获取兑换记录 (Exchange/Withdrawal history)
 */
export async function getExchangeList(params) {
    return request({
        url: "/maomall/exchange-list",
        method: "get",
        params,
    });
}

/**
 * 获取当前档位状态
 */
export async function getTierStatus() {
    return request({
        url: "/maomall/tier-status",
        method: "get",
    });
}

/**
 * 获取实时汇率列表
 */
export async function getMaoMallRates() {
    return request({
        url: "/maomall/rates",
        method: "get",
    });
}

/**
 * 发起 $MAO 兑换申请 (Points -> $MAO)
 */
export async function applyMaoMallExchange(data) {
    return request({
        url: "/maomall/exchange",
        method: "post",
        params: data // 使用 params 因为后端 Controller 接收的是 String/Long 参数
    });
}
