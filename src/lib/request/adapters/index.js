import buildURL from '../helpers/buildURL'
import buildFullPath from '../core/buildFullPath'
import settle from '../core/settle'

/**
 * 返回可选值存在的配置
 * @param {Array} keys - 可选值数组
 * @param {Object} config2 - 配置
 * @return {{}} - 存在的配置项
 */
const mergeKeys = (keys, config2) => {
  let config = {}
  keys.forEach(prop => {
    if (typeof config2[prop] !== 'undefined') {
      config[prop] = config2[prop]
    }
  })
  return config
}
export default (config) => {
  return new Promise((resolve, reject) => {
    const _config = {
      url: buildURL(buildFullPath(config.baseURL, config.url), config.params),
      header: config.header,
        complete: (response) => {
        response.config = config
        // 保存原始数据
        response.rawData = response.data;
        
        try {
          // 如果明确指定了dataType为text，保持为字符串，不解析为JSON
          if (config.dataType === 'text') {
            // 保持原始字符串，不进行JSON解析
            console.log('[request] dataType为text，保持原始响应为字符串，长度:', response.data ? response.data.length : 0);
          } else if (typeof response.data === 'string') {
            // 对可能字符串不是json 的情况容错
            // 检查是否是HTML内容（支付宝支付返回HTML）
            if (response.data.trim().startsWith('<') || 
                response.data.includes('<form') || 
                response.data.includes('alipay') ||
                response.data.includes('支付宝') ||
                response.data.includes('action=')) {
              // 是HTML内容，保持为字符串，不解析为JSON
              console.log('[request] 检测到HTML响应，保持为字符串，长度:', response.data.length);
              // 不修改response.data，保持为原始HTML字符串
            } else {
              // 尝试解析为JSON
              try {
                response.data = JSON.parse(response.data);
              } catch (parseError) {
                // 解析失败，可能是其他格式的字符串，保持原样
                console.log('[request] JSON解析失败，保持原始字符串:', parseError.message);
              }
            }
          }
          // eslint-disable-next-line no-empty
        } catch (e) {
          // 解析失败，保持原始字符串（可能是HTML）
          console.log('[request] 响应处理异常，保持原始响应:', e.message);
        }
        settle(resolve, reject, response)
      }
    }
    let requestTask
    if (config.method === 'UPLOAD') {
      let otherConfig = {
        // #ifdef MP-ALIPAY
        fileType: config.fileType,
        // #endif
        filePath: config.filePath,
        name: config.name
      }
      const optionalKeys = [
        // #ifdef APP-PLUS || H5
        'files',
        // #endif
        // #ifdef H5
        'file',
        // #endif
        'formData'
      ]
      requestTask = uni.uploadFile({..._config, ...otherConfig, ...mergeKeys(optionalKeys, config)})
    } else if (config.method === 'DOWNLOAD') {
      requestTask = uni.downloadFile(_config)
    } else {
      const optionalKeys = [
        'data',
        'method',
        // #ifdef MP-ALIPAY || MP-WEIXIN
        'timeout',
        // #endif
        'dataType',
        // #ifndef MP-ALIPAY || APP-PLUS
        'responseType',
        // #endif
        // #ifdef APP-PLUS
        'sslVerify',
        // #endif
        // #ifdef H5
        'withCredentials'
        // #endif
      ]
      requestTask = uni.request({..._config,...mergeKeys(optionalKeys, config)})
    }
    if (config.getTask) {
      config.getTask(requestTask, config)
    }
  })
}
