const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,

  devServer: {
    // port: 8080  // 默认为8080
    open: true // 启动项目时，自动打开浏览器
  }
})
