const path = require('path');

module.exports = {
    publicPath: '/',
    // 允许对 node_modules 中的依赖进行编译，特别是 ES2020 语法的库
    transpileDependencies: [
        /@solana/,
        /rpc-websockets/,
        /jayson/,
        /superstruct/,
        /bs58/,
        /buffer/,
        /uview-ui/,
        /tweetnacl/,
        /@noble/
    ],
    /**
     *  此处为发行h5,微信小程序，app中删除console 
     *  如需显示console 需要注释此处重新运行
     */
    chainWebpack: (config) => {
        // 1. 核心修复：处理 .mjs 文件 (如 @solana/web3.js 用到的)
        config.module
            .rule('mjs')
            .test(/\.mjs$/)
            .include.add(/node_modules/).end()
            .type('javascript/auto')
            .use('babel-loader')
                .loader('babel-loader')
                .end();

        // 2. 新增修复：处理 .cjs 文件 (Solana SDK 很多入口是 .cjs)
        config.module
            .rule('cjs')
            .test(/\.cjs$/)
            .include.add(/node_modules/).end()
            .type('javascript/auto')
            .use('babel-loader')
                .loader('babel-loader')
                .end();

        // 3. 扩展现有 js 规则支持多种扩展名，确保 Babel 全覆盖
        config.module
            .rule('js')
            .test(/\.(js|mjs|cjs)$/);

        // 4. 路径别名修复：针对 rpc-websockets 7.5.0 的特殊路径
        // HBuilder 的 Webpack 可能在处理 import 'path' 时不会自动尝试 'path.js'
        config.resolve.alias
            .set('rpc-websockets/dist/lib/client$', path.resolve(__dirname, 'node_modules/rpc-websockets/dist/lib/client.js'))
            .set('rpc-websockets/dist/lib/client/websocket.browser$', path.resolve(__dirname, 'node_modules/rpc-websockets/dist/lib/client/websocket.browser.js'));

        // 5. Terser 配置：发行或运行时启用了压缩时会生效
        config.optimization.minimizer('terser').tap((args) => {
            if (args[0] && args[0].terserOptions && args[0].terserOptions.compress) {
                const compress = args[0].terserOptions.compress
                compress.drop_console = true
                compress.pure_funcs = ['__f__']
            }
            return args
        })
    }
}