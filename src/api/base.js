/**
 * API 适配层 (Bridge Layer)
 * 透传模式：直接返回完整 response 对象
 * 所有页面代码通过 res.data.success / res.data.result 访问数据（旧格式）
 */
import { http, Method } from '@/utils/request.js';

/**
 * 核心请求包装函数 —— 透传完整 response，不做裁剪
 * @param {Object} options 请求配置
 * @returns {Promise<any>} 返回完整 response（包含 statusCode, data, header 等）
 */
export const request = (options) => {
    return http.request(options);
};

export { Method };
