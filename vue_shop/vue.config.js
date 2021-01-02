
module.exports = {
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
            config.plugin('html').tap(args=>{
                // 这里是为args新增了一个参数isProd
                args[0].isProd = true
                return args
            })
        })
        // 开发模式
        config.when(process.env.NODE_ENV === 'development', config => {
            config.entry('app').clear().add('./src/main-dev.js')
            
            // 开发模式中，将这个isProd设置成false
            config.plugin('html').tap(args=>{
                args[0].isProd = false
                return args
            })
        })
    }
}