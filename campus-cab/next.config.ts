// next.config.js
module.exports = {
  async rewrites() {
    return [
      {
        source: '/.well-known/appspecific/com.chrome.devtools.json',
        destination: '/devtools-ignore.json', // optional dummy static file
      },
    ]
  },
}
