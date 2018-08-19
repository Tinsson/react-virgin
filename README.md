# react环境搭建

## 一、从零开始用webpack渐进式搭建环境

### 1.创建package.json说明json文件

`mkdir wizard & cd wizard`

`npm init -y`

-y 的意思是不填写相应的作者邮箱等信息

### 2.安装webpack

`npm i webpack -D`

npm i -D是npm install --save-dev的简写，如果使用webpack-cli,还得安装cli

`npm install -D webpack webpack-cli`

### 3.新建项目结构

`
    |- package.json  
   +|- /dist  
       |- index.html  
   +|- /src  
       |- index.js 
`

index.html

`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
</head>
<body>
<div id="root"></div>
<script src="bundle.js"></script>
</body>
</html>
`

index.js

`
    document.querySelector('#root').innerHTML = 'webpack使用';
`

非全局安装下的打包

`node_modules\.bin\webpack src\index.js --output dist\bundle.js --mode development`

## 二、配置webpack

`touch webpack.config.js`

### 1.使用配置文件

`
const path=require('path');
module.exports={
    entry:'./src/index.js',
    output:{
        filename:'bundle.js',
        path:path.resolve(__dirname,'dist')
    }
};
`
可以运行命令：
`node_modules\.bin\webpack --mode production`进行打包

### 2.添加npm脚本script

`"build": "webpack --mode production"`

npm run build 进行打包

## 三、使用webpack构建本地服务器

webpack-dev-server提供了一个web服务器

1.安装`npm i -D webpack-dev-server`后修改配置

`
const path=require('path');
module.exports={
    entry:'./src/index.js',
    output:{
        filename:'bundle.js',
        path:path.resolve(__dirname,'dist')
    },
    //以下是新增的配置
    devServer:{
        contentBase: "./dist",//本地服务器所加载的页面所在的目录
        historyApiFallback: true,//不跳转
        inline: true,//实时刷新
        port:3000,
        open:true,//自动打开浏览器
    }
};
`

运行webpack-dev-server --progress

添加script脚本

`"start": "webpack-dev-server --open --mode development"`

2.热更新（HMR）

配置一个webpack自带的插件并且在主要js文件检查是否有module.hot

`
    plugin: [
        new webpack.HotModuleReplacementPlugin()
    ]
`
主要的js文件里添加如下

`
if(module.hot){
    modult.hot.accept();
}
`
在webpack.config.js开启热更新
`
devServer:{
    contentBase: "./dist",//本地服务器所加载的页面所在的目录
    historyApiFallback: true,//不跳转
    inline: true,//实时刷新
    port:3000,
    open:true,//自动打开浏览器
    hot:true  //开启热更新
}
`
热更新运行时更新模块，无需进行完全更新

## 四、配置html模版

1.安装html-webpack-plugin插件

`npm i html-webpack-plugin -D`

2.引用插件

`
const path=require('path');
let webpack=require('webpack');
let HtmlWebpackPlugin=require('html-webpack-plugin');
module.exports={
    entry:'./src/index.js',
    output:{
        //添加hash可以防止文件缓存,每次都会生成4位hash串
        filename:'bundle.[hash:4].js',
        path:path.resolve('dist')
    },
    //以下是新增的配置
    devServer:{
        contentBase: "./dist",//本地服务器所加载的页面所在的目录
        historyApiFallback: true,//不跳转
        inline: true,//实时刷新
        port:3000,
        open:true,//自动打开浏览器
        hot:true  //开启热更新
    },
    plugins:[
        new HtmlWebpackPlugin({
            template:'./src/index.html',
            hash:true, //会在打包好的bundle.js后面加上hash串
        })
    ]
};

`

npm run build打包后会在dist目录上创建了很多包，可用clean-webpack-plugin插件进行清理

`
    plugins: [
        new CleanWebpackPlugin('dist'),
        new HtmlWebpackPlugin({
            template:'./src/index.html',
            hash:true, //会在打包好的bundle.js后面加上hash串
        })
    ]
`

## 五、编译es6和jsx

1.安装babel

`npm i babel-core babel-loader babel-preset-env babel-preset-react babel-preset-stage-0 -D`

babel-loader: babel加载器 babel-preset-env : 根据配置的 env 只编译那些还不支持的特性。 babel-preset-react: jsx 转换成js

2.添加.babellrc配置文件

`
{
    "presets": ["env", "stage-0", "react"] //从左往右解析
}
`

3.修改配置文件

`
const path=require('path');
module.exports={
    entry:'./src/index.js',
    output:{
        filename:'bundle.js',
        path:path.resolve(__dirname,'dist')
    },
    //以下是新增的配置
    devServer:{
        contentBase: "./dist",//本地服务器所加载的页面所在的目录
        historyApiFallback: true,//不跳转
        inline: true//实时刷新
    },
    module:{
        rules:[
            {
                test:/\.js$/,
                exclude:/(node_modules)/,  //排除掉nod_modules,优化打包速度
                use:{
                    loader:'babel-loader'
                }
            }
        ]
    }
};

`

## 六、开发环境和生产环境分离

1.安装webpack-merge

`npm install --save-dev webpack-merge`

2.新建webpack.common.js公共配置

`
const path=require('path');
let webpack=require('webpack');
let HtmlWebpackPlugin=require('html-webpack-plugin');
let CleanWebpackPlugin=require('clean-webpack-plugin');
module.exports={
    entry:['babel-polyfill','./src/index.js'],
    output:{
        //添加hash可以防止文件缓存,每次都会生成4位hash串
        filename:'bundle.[hash:4].js',
        path:path.resolve(__dirname,'dist')
    },
    plugins:[
        new HtmlWebpackPlugin({
            template:'./src/index.html',
            hash:true, //会在打包好的bundle.js后面加上hash串
        }),
        //打包前先清空
        new CleanWebpackPlugin('dist'),
        new webpack.HotModuleReplacementPlugin()  //查看要修补(patch)的依赖
    ],
    module:{
        rules:[
            {
                test:/\.js$/,
                exclude:/(node_modules)/,  //排除掉nod_modules,优化打包速度
                use:{
                    loader:'babel-loader'
                }
            }
        ]
    }
};
`

3.配置webpack.dev.js开发环境

`
const merge=require('webpack-merge');
const path=require('path');
let webpack=require('webpack');
const common=require('./webpack.common.js');
module.exports=merge(common,{
    devtool:'inline-soure-map',
    mode:'development',
    devServer:{
        historyApiFallback: true, //在开发单页应用时非常有用，它依赖于HTML5 history API，如果设置为true，所有的跳转将指向index.html
        contentBase:path.resolve(__dirname, '../dist'),//本地服务器所加载的页面所在的目录
        inline: true,//实时刷新
        open:true,
        compress: true,
        port:3000,
        hot:true  //开启热更新
    },
    plugins:[
        //热更新,不是刷新
        new webpack.HotModuleReplacementPlugin(),
    ],
});
`

4.新建webpack.prod.js生成环境

`
const merge = require('webpack-merge');
 const path=require('path');
 let webpack=require('webpack');
 const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
 const common = require('./webpack.common.js');
 module.exports = merge(common, {
     mode:'production',
     plugins: [
         new UglifyJSPlugin()
     ]
 });
`

## 七、配置react

1.安装react、react-dom

`npm i react react-dom -S`

2.新建App.js添加内容

```
import React from 'react';

class App extends React.Component{
    render(){
        return(
            <div>
                just do it
            </div>
        )
    }
}

export default App;
```

3.在index.js添加内容

```
import React from 'react';
import ReactDom from 'react-dom';
import {AppContainer} from 'react-hot-loader';
import App from './App';

if (module.hot) {
    module.hot.accept(() => {
      ReactDom.render(
          <AppContainer>
              <App />
          </AppContainer>,
          document.getElementById('root')
      )
    })
  }
  
  ReactDom.render(
      <AppContainer>
          <App />
      </AppContainer>,
      document.getElementById('root')
  )

```

4.安装react-hot-loader
`npm i -D react-hot-loader`

5.修改配置文件

# 八、处理sass

1.安装style-loader css-loader url-loader
`npm install style-loader css-loader url-loader --save-dev`

2.安装sass-loader node-sass
`npm install sass-loader node-sass --save-dev`

3.安装mini-css-extract-plugin, 提取单独打包css文件
`npm install --save-dev mini-css-extract-plugin`

4.配置config
webpack.common.js

```
{
    test:/\.(png|jpg|gif)$/,
    use:[
        "url-loader"
    ]
}
```
webpack.dev.js

```
{
    test:/\.scss$/,
    use:[
        "style-loader",
        "css-loader",
        "sass-loader"
    ]
}
```

webpack.prod.js

```
const merge = require('webpack-merge');
 const path=require('path');
 let webpack=require('webpack');
 const MiniCssExtractPlugin=require("mini-css-extract-plugin");
 const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
 const common = require('./webpack.common.js');
 module.exports = merge(common, {
     mode:'production',
     module:{
         rules:[
             {
                 test:/\.scss$/,
                 use:[
                     // fallback to style-loader in development
                     process.env.NODE_ENV !== 'production' ? 'style-loader' : MiniCssExtractPlugin.loader,
                     "css-loader",
                     "sass-loader"
                 ]
             }
         ]
     },
     plugins: [
         new UglifyJSPlugin(),
         new MiniCssExtractPlugin({
             // Options similar to the same options in webpackOptions.output
             // both options are optional
             filename: "[name].css",
             chunkFilename: "[id].css"
         })
     ]
 });
```