module.exports = {
  configureWebpack: {
    resolve: {
      alias: {
        assets: '@/assests',
        common: '@/common',
        components: '@/components',
        network: '@/network',
        views: '@/views'
      }
    }
  }
}
