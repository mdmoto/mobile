module.exports = {
    // 允许对 node_modules 中的依赖进行编译，特别是 Solana 这种使用 ES2020 语法的库
    transpileDependencies: [
        '@solana',
        'bs58',
        'buffer',
        'uview-ui',
        'tweetnacl'
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

        // 支持 .mjs 文件以及针对 Solana 的编译优化
        config.module
            .rule('mjs')
            .test(/\.mjs$/)
            .include.add(/node_modules/).end()
            .type('javascript/auto');

        // 核心修复：确保 Babel 包含所有相关的 node_modules
        config.module
            .rule('js')
            .include.add(/node_modules[/\\](@solana|bs58|buffer|tweetnacl)/)
            .end();
    }
}