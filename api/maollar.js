import request from "@/utils/request";

/**
 * 获取兑换记录 (Exchange/Withdrawal history)
 */
export function getExchangeList(params) {
    return request({
        url: "/api/v1/maollar/exchange-list",
        method: "GET",
        params,
    });
}

/**
 * 获取当前档位状态
 */
export function getTierStatus() {
    return request({
        url: "/api/v1/maollar/tier-status",
        method: "GET",
    });
}

/**
 * 获取实时汇率列表
 */
export function getMaoMallRates() {
    return request({
        url: "/api/v1/maollar/rates",
        method: "GET",
    });
}

/**
 * 发起 $MAO 兑换申请 (Points -> $MAO)
 */
export function applyMaoMallExchange(data) {
    return request({
        url: "/api/v1/maollar/exchange",
        method: "POST",
        params: data // 使用 params 因为后端 Controller 接收的是 String/Long 参数
    });
}
