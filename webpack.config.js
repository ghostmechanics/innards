'use strict';

module.exports = {
    cache: true,
    context: `${__dirname}/js`,
    entry: `./app`,
    mode: `development`,
    output: {
        filename: `dist/js/bundle.js`
    },
    devtool: `cheap-source-map`,
    optimization: {
        minimize: true
    },
    stats: {
        builtAt: true,
        cached: true
    }
};
