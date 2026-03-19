/**
 * API 适配层 (Bridge Layer)
 * 作用：统一 Vue2 与 Vue3 分支的请求行为，解耦业务逻辑与请求库实现。
 * 为后续迁移至 Vite + Vue3 提供平滑过渡。
 */
import { http, Method } from '@/utils/request.js';

/**
 * 核心请求包装函数
 * @param {Object} options 请求配置
 * @returns {Promise<any>} 返回业务需要的 result 数据
 */
export const request = async (options) => {
    try {
        const response = await http.request(options);

        // 重要：必须返回完整的 response 容器。
        // 因为全站旧代码都在使用 res.data.success 这种写法。
        return response;
    } catch (error) {
        console.error('[API Bridge Error]:', error);
        // 转发异常，交由业务逻辑处理或 UI 提示
        throw error;
    }
};

export { Method };
