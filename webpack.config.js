const path = require('path');
const webpack = require('webpack');
let HtmlWebpackPlugin = require('html-webpack-plugin');
let CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports={
    entry:[
        'react-hot-loader/patch',
        path.resolve(__dirname, './src/index.js')
    ],
    output:{
        filename:'bundle.[hash:4].js',
        path:path.resolve(__dirname, 'dist')
    },
    devServer:{
        contentBase: "./dist",
        historyApiFallback: true,
        inline: true,
        port: 3000,
        open: true,
        hot: true
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /(node_modules)/,
                use:{
                    loader: 'babel-loader'
                }
            }
        ]
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new HtmlWebpackPlugin({
            template: './src/index.html',
            hash: true
        }),
        new CleanWebpackPlugin('dist')
    ]
};

