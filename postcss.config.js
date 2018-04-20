// const assetsPath = 'dist/static/'

module.exports = () => ({
  plugins: {
    /* 'postcss-url': [{
      url: 'inline',
      assetsPath,
      useHash: true,
    },
    {
      url: asset => asset.url.replace(assetsPath, ''),
      multi: true,
    }], */
    'css-mqpacker': {},
    // autoprefixer: { browsers: ['last 4 versions'] }
  },
})

