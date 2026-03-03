/**
 * Solana 钱包适配器封装 - 全平台一致性方案
 * 支持 H5 (插件), App (唤起), 小程序 (引导)
 */

import nacl from 'tweetnacl';
import bs58 from 'bs58';

// #ifdef H5
import { PhantomWalletAdapter } from '@solana/wallet-adapter-phantom';
let adapter = null;
const getPhantomAdapter = () => {
    if (!adapter) adapter = new PhantomWalletAdapter();
    return adapter;
};
// #endif

/**
 * 连接钱包核心逻辑
 * @param {Object} options 配置项
 * @returns {Promise<string>} 钱包公钥地址
 */
export const connectPhantom = async (options = {}) => {
    // 1. H5 环境优先使用插件
    // #ifdef H5
    try {
        const wallet = getPhantomAdapter();
        if (window.solana && window.solana.isPhantom) {
            if (!wallet.connected) {
                await wallet.connect();
            }
            return wallet.publicKey.toString();
        }
    } catch (e) {
        console.warn('H5 Adapter failed, trying deep link fallback...');
    }
    // #endif

    // 2. App 或 H5 降级处理：使用 Deep Link 唤起 Phantom
    // #ifdef APP-PLUS || H5
    const currentUrl = options.url || window.location.href;
    // 方案 A：在 Phantom 内部浏览器打开当前页面 (最稳妥的一致性方案)
    // 这样 H5 的逻辑在 Phantom 内部就能 100% 运行
    const phantomBrowserUrl = `https://phantom.app/ul/browse/${encodeURIComponent(currentUrl)}?ref=${encodeURIComponent(currentUrl)}`;

    // #ifdef APP-PLUS
    plus.runtime.openURL(phantomBrowserUrl, (err) => {
        uni.showToast({ title: '请安装 Phantom 钱包', icon: 'none' });
    });
    return null; // 跳转后当前 App 无法直接获取，需等待回调或让用户重新操作
    // #endif

    // #ifdef H5
    // 如果是手机浏览器访问 H5，引导去 App
    if (/Android|iPhone|iPad/i.test(navigator.userAgent)) {
        window.location.href = phantomBrowserUrl;
        return null;
    }
    // #endif
    // #endif

    // 3. 小程序环境
    // #ifdef MP
    uni.showModal({
        title: '提示',
        content: '小程序环境暂不支持直接连接，请点击“关于”查看官网，在 Phantom 内部浏览器中打开以获得最佳体验。',
        showCancel: false
    });
    return null;
    // #endif
};

/**
 * 断开连接
 */
export const disconnectPhantom = async () => {
    // #ifdef H5
    const wallet = getPhantomAdapter();
    if (wallet.connected) await wallet.disconnect();
    // #endif

    // App 端清空本地缓存即可
};

/**
 * 监听状态 (H5 特有)
 */
export const watchWalletStatus = (callback) => {
    // #ifdef H5
    const wallet = getPhantomAdapter();
    wallet.on('connect', (pk) => callback({ status: 'connected', publicKey: pk.toString() }));
    wallet.on('disconnect', () => callback({ status: 'disconnected' }));
    // #endif
};
