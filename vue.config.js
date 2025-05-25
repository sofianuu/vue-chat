const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    port: 90,
    host: '0.0.0.0'  // Permite accesul extern
  }
})