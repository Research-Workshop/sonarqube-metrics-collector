const path = require('path');

module.exports = {
    mode: 'development',
    entry: './src/app.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'app.js',
    },
    module: {
        rules: [{
            test: /\.js$/,
            exclude: /node_modules/,
            use: {
                loader: 'babel-loader',
                options: {
                    cacheDirectory: true,
                },
            }
        }],
    },
    target: 'node',
    watch: false,
    watchOptions: {
        ignored: /node_modules/,
        aggregateTimeout: 500,
        poll: 1000,
    },
    devtool: 'source-map',
};
