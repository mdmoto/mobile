module.exports = {
    // 允许对 node_modules 中的依赖进行编译，特别是 Solana 这种使用 ES2020 语法的库
    transpileDependencies: [
        '@[/\\\\]solana[/\\\\]',
        'bs58',
        'buffer',
        'uview-ui'
    ],
    /**
     *  此处为发行h5,微信小程序，app中删除console 
     *  如需显示console 需要注释此处重新运行
     */
    chainWebpack: (config) => {
        // 发行或运行时启用了压缩时会生效
        config.optimization.minimizer('terser').tap((args) => {
            const compress = args[0].terserOptions.compress
            // 非 App 平台移除 console 代码(包含所有 console 方法，如 log,debug,info...)
            compress.drop_console = true
            compress.pure_funcs = [
                '__f__', // App 平台 vue 移除日志代码
            ]
            return args
        })

        // 增加对 modern JS 语法的支持处理（针对一些库可能没被 transpileDependencies 覆盖全的情况）
        config.module
            .rule('js')
            .test(/\.m?js$/)
            .use('babel-loader')
            .loader('babel-loader')
            .end();
    }
}