const path = require('path');

module.exports = {
    publicPath: './',
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
        // 发行或运行时启用了压缩时会生效
        config.optimization.minimizer('terser').tap((args) => {
            if (args[0] && args[0].terserOptions && args[0].terserOptions.compress) {
                const compress = args[0].terserOptions.compress
                compress.drop_console = true
                compress.pure_funcs = ['__f__']
            }
            return args
        })

        // 路径别名修复：针对 rpc-websockets 7.5.0 的特殊路径
        // HBuilder 的 Webpack 可能在处理 import 'path' 时不会自动尝试 'path.js'
        config.resolve.alias
            .set('rpc-websockets/dist/lib/client$', path.resolve(__dirname, 'node_modules/rpc-websockets/dist/lib/client.js'))
            .set('rpc-websockets/dist/lib/client/websocket.browser$', path.resolve(__dirname, 'node_modules/rpc-websockets/dist/lib/client/websocket.browser.js'));

        // 支持 .mjs 文件并强制通过 babel-loader
        config.module
            .rule('mjs')
            .test(/\.mjs$/)
            .include.add(/node_modules/).end()
            .type('javascript/auto')
            .use('babel-loader')
            .loader('babel-loader')
            .end();

        // 允许解析 .cjs 文件
        config.module
            .rule('cjs')
            .test(/\.cjs$/)
            .include.add(/node_modules/).end()
            .use('babel-loader')
            .loader('babel-loader')
            .end();
    }
}