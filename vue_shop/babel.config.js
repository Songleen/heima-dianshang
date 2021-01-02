
// 1、这是项目发布阶段需要用到的babel插件
const prodPlugins = []

// 2、通过环境变量获取到运行状态值，如果是发布态，则将插件push到数组中
if(process.env.NODE_ENV === 'production'){
  prodPlugins.push('transform-remove-console')
}

module.exports = {
  presets: [
    '@vue/cli-plugin-babel/preset'
  ],
  plugins: [
    [
      'component',
      {
        libraryName: 'element-ui',
        styleLibraryName: 'theme-chalk'
      }
    ],
    // 3、直接通过展开运算符将数组展开
    ...prodPlugins,
    '@babel/plugin-syntax-dynamic-import'
  ]
}
