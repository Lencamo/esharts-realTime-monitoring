const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,

  devServer: {
    https: false,
    host: '127.0.0.1',
    port: 8080, // 默认为8080

    open: true // 启动项目时，自动打开浏览器
  }
})
