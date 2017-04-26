'use strict';

const webpack = require('webpack');

module.exports = {
    cache: true,
    context: `${__dirname}/js`,
    entry: `./app`,
    output: {
        filename: `dist/js/bundle.js`
    },
    devtool: `cheap-source-map`,
    plugins: [
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: true
            }
        })
    ]
};
