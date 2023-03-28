
module.exports = {

    // 是一个函数，会接收一个基于 webpack-chain 的 ChainableConfig 实例。允许对内部的 webpack 配置进行更细粒度的修改。
    // 通过chainWebpack自定义打包入口
    chainWebpack: config => {
        // 部署模式
        config.when(process.env.NODE_ENV === 'production', config => {
            config.entry('app').clear().add('./src/main-prod.js')

            config.set('externals', {
                vue: 'Vue',
                'vue-router': 'VueRouter',
                axios: 'axios',
                lodash: '_',
                echarts: 'echarts',
                nprogress: 'NProgress',
                'vue-quill-editor': 'VueQuillEditor',
                moment: 'Moment'
            })

            // 1、找到html插件，修改插件中的相关参数，args是指html插件中的参数项
            config.plugin('html').tap(args => {
                // 这里是为args新增了一个参数isProd
                args[0].isProd = true
                return args
            })
        })
        // 开发模式
        config.when(process.env.NODE_ENV === 'development', config => {
            config.entry('app').clear().add('./src/main-dev.js')

            // 开发模式中，将这个isProd设置成false
            config.plugin('html').tap(args => {
                args[0].isProd = false
                return args
            })
        })
    },

    // 部署应用包时的基本 URL。用法和 webpack 本身的 output.publicPath 一致。默认是根路径'/'
    publicPath: process.env.NODE_ENV === 'production' ? '/production-sub-path/' : '/',

    // 当运行 vue-cli-service build 时生成的生产环境构建文件的目录，默认值 'dist'
    outputDir: './dist' + process.env.VUE_APP_BASE_API,

    // 放置生成的静态资源 (js、css、img、fonts) 的 (相对于 outputDir 的) 目录。默认值 ''
    assetsDir: 'static',

    // 指定生成的 index.html 的输出路径 (相对于 outputDir)。也可以是一个绝对路径。 默认值 'index.html'
    indexPath: 'index.html',

    // 默认情况下，生成的静态资源在它们的文件名中包含了 hash 以便更好的控制缓存。
    // 然而，这也要求 index 的 HTML 是被 Vue CLI 自动生成的。如果你无法使用 Vue CLI 生成的 index HTML，
    // 你可以通过将这个选项设为 false 来关闭文件名哈希。默认值 true
    filenameHashing: false,

    // 在 multi-page 模式下构建应用 默认值 undefined
    pages,

    // 是否在开发环境下通过 eslint-loader 在每次保存时 lint 代码。这个值会在 @vue/cli-plugin-eslint 被安装之后生效。默认值 'default'
    // 设置为 true 或 'warning' 时，eslint-loader 会将 lint 错误输出为编译警告。默认情况下，警告仅仅会被输出到命令行，且不会使得编译失败。
    lintOnSave: process.env.NODE_ENV !== 'production', // 在生产构建时禁用 eslint-loader

    // 是否使用包含运行时编译器的 Vue 构建版本。设置为 true 后你就可以在 Vue 组件中使用 template 选项了，但是这会让你的应用额外增加 10kb 左右。默认值 false
    runtimeCompiler: false,

    // 默认情况下 babel-loader 会忽略所有 node_modules 中的文件。你可以启用本选项，以避免构建后的代码中出现未转译的第三方依赖。
    // 可以只转译部分特定的依赖：给本选项传一个数组，列出需要转译的第三方包包名或正则表达式即可 默认值 false
    transpileDependencies: false,

    // 如果你不需要生产环境的 source map，可以将其设置为 false 以加速生产环境构建。默认值 true
    productionSourceMap: false,

    // 如果这个值是一个对象，则会通过 webpack-merge 合并到最终的配置中。
    // 如果这个值是一个函数，则会接收被解析的配置作为参数。该函数既可以修改配置并不返回任何东西，也可以返回一个被克隆或合并过的配置版本。
    configureWebpack,

    // 所有 webpack-dev-server 的选项都支持。 有些值像 host、port 和 https 可能会被命令行参数覆写。
    // 有些值像 publicPath 和 historyApiFallback 不应该被修改，因为它们需要和开发服务器的 publicPath 同步以保障正常的工作。
    devServer: {
        port: 8080,
        open: true,
        https: true,
        hot: true,
        // 让浏览器 overlay 同时显示警告和错误
        overlay: {
            warnings: true,
            errors: true
        },
        proxy: {
            // 如果你的前端应用和后端 API 服务器没有运行在同一个主机上，你需要在开发环境下将 API 请求代理到 API 服务器
        }
    },


    css: {
        // 从 v4 起已弃用，请使用css.requireModuleExtension。 在 v3 中，这个选项含义与 css.requireModuleExtension 相反。
        modules,

        // 默认情况下，只有 *.module.[ext] 结尾的文件才会被视作 CSS Modules 模块。
        // 设置为 false 后你就可以去掉文件名中的 .module 并将所有的 *.(css|scss|sass|less|styl(us)?) 文件视为 CSS Modules 模块。默认值 true
        requireModuleExtension: false,

        // 是否将组件中的 CSS 提取至一个独立的 CSS 文件中 (而不是动态注入到 JavaScript 中的 inline 代码)。
        // 默认值 生产环境下是 true，开发环境下是 false
        extract,

        // 是否为 CSS 开启 source map。设置为 true 之后可能会影响构建的性能。默认值 false
        sourceMap: true,

        // 向 CSS 相关的 loader 传递选项 支持的 loader 有：css-loader postcss-loader sass-loader less-loader stylus-loader
        loaderOptions: {
            css: {
                // 这里的选项会传递给 css-loader
            },
            postcss: {
                // 这里的选项会传递给 postcss-loader
            }
        }
    }
}