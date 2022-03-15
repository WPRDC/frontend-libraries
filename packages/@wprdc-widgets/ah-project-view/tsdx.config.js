const postcss = require('rollup-plugin-postcss');
const path = require('path');

module.exports = {
  rollup(config, options) {
    config.plugins.push(
      postcss({
        config: {
          path: path.resolve(__dirname, 'postcss.config.js'),
          ctx: {
            extract: !!options.writeMeta,
          },
        },
      })
    );
    return config;
  },
};
