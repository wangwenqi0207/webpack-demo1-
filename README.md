用webpack可构建项目 用loader可打包其他类型的文件 使项目模块化 工程化

一：为什么需要webpack？  webpack是模块打包器
它可以转换es6语法
转换JSX
css前缀补全/预处理器
压缩混淆
图片压缩

所有的静态资源都会默认打包在dist目录下

二：webpack配置文件名称
webpack.config.js


三：环境搭建
依赖node.js 和 npm
可安装nvm对node版本进行管理、
检查是否安装好 nvm -v  node -v  npm -v


四：创建目录 在目录下安装webpack
1.创建项目文件 如study-webpack
2.在项目文件下 npm init -y
安装webpack和webpack-cli
1.npm install webpack webpack-cli --save-dev
检查是否安装成功：./node_modules/.bin/webpack -v


五：写webpack脚本
项目文件夹下新建webpack.config.js文件
初始打包方法 在项目终端 ./node_modules/.bin/webpack


六：配置打包命令
package.json中：
"scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "build":"webpack"     //此处配置
  },


七：entry的用法  
单入口 entry:'xxx.js'
多入口 entry:{
    app:'xxx.js',
    app2:'xxx2.js'
}
多入口适用于多页应用


八：output的用法
output:{                    
        path:path.join(__dirname,'dist'), 
        filename:'bundle.js' 
}, 
当有多个entry入口时 filename需要区分 写法如下
output:{                    
        path:path.join(__dirname,'dist'), 
        filename:'[name].js' 
},


九：loader使用
module:{     
        rules:[
            {
                test:/\.css$/,
                loader:'style-loader!css-loader' 
            }
        ]
}
完后记得下载对应loader
cnpm i css-loader style-loader --save-dev
import './style/helloworld.css'   即可使用


十：支持es6配置
npm i @babel/core @babel/preset-env babel-loader -D


十一：支持react配置
npm i react-dom react @babel/preset-react -D


十二：less使用
npm i less less-loader -D


十三：图片字体的使用
npm i file-loader -D
url-loader 可以自动将小图片或者小字体做base64的转换


十四：文件监听
第一种：
"scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "build": "webpack",
    "watch":"webpack --watch"  //此处 缺点 必须手动刷新浏览器
  },
设置完之后，运行：npm run watch
第二种
module.exports={
    watch:true, //文件监听
    //只有开启监听模式时，watchOptions才有意义
    watchOptions:{
        //默认为空，不监听的文件或者文件夹，支持正则匹配
        ignored:/node_modules/,
        //监听到变化发生后会等300ms再去执行，默认300ms
        aggregateTimeout:300,
        poll:1000
    },
}


十五：热更新
npm install webpack-dev-server --save-dev
WDS 不用刷新浏览器
WDS 不输出文件，而是放在内存中
使用HotModuleReplacementPlugin插件

const webpack = require('webpack')
plugins:[
        new webpack.HotModuleReplacementPlugin()
    ],
    devServer:{
        contentBase:'./dist',
        hot:true
    }


十六：文件指纹
文件指纹打包后自动生成的文件名后缀，可用来进行版本管理
chunkhash是不能和热更新一起使用的
js文件指纹：[chunkhash:8]
output:{                   
        path:path.join(__dirname,'dist'),  
        filename:'[name][chunkhash:8].js'   
},
css文件指纹：
npm i mini-css-extract-plugin -D  安装插件
此插件与css-loader是互斥的


十七：js css html 压缩
js打包后webpack会自动压缩:
也可手动下载 uglifyjs-webpack-plugin 进行参数配置
css文件压缩:
optimize-css-assets-webpack-plugin
npm i optimize-css-assets-webpack-plugin
同时使用 cssnano
npm i cssnano -D
html文件压缩:
修改 html-webpack-plugin 设置压缩参数
npm i html-webpack-plugin -D


十八：自动清理构建目录
每次打包之后，output出的文件目录越来越多，可设置自动清理
用clean-webpack-plugin 插件
npm i clean-webpack-plugin -D


十九：css自动补全前缀 兼容
autoprefixer插件
npm i postcss-loader autoprefixer -D


二十：px自动转换rem
npm i px2rem-loader -D
npm i lib-flexible -S
[目前报错]


二十一：静态资源内联
提高性能，减少http请求次数
例如将页面所有meta封装打包起来


二十二：多页面应用打包
1.摇树优化 将一个模块里用到的方法打包 没有用到的方法清除掉
不开启 tree-shaking  mode:"none", 
mode:"production"时，默认开启tree-shaking


二十三：sourcemap
多页面打包
entry:{
        index:'./src/index.js',
        search:'./src/search.js'
    },  
页面多的便捷方法 将每个src下的模块首页都设为index.js
利用glob.sync
entry:glob.sync(path.join(__dirname,'./src/*/index.js')),
npm i glob -D


二十四：提取页面公共资源
module.exports={
    devtool:'source-map'
}
会在dist目录下单独打包出map资源 map和js分离
source-map开启后 打断点调试可开启源代码 还有好多参数可以自己配

npm i html-webpack-externals-plugin -D


二十五：代码分割
代码懒加载 按需加载
动态import：
npm install @babel/plugin-syntax-dynamic-import --save-dev


二十六：打包库和组件
webpack除了可以用来打包应用，也可以用来js库
实现一个大整数加法库的打包


二十七：服务端渲染
减少白屏和等待 渲染速度更快 将html+css+js+data数据一起渲染的
所有资源都放在服务端
核心是减少请求
对seo更加友好
package.json里配置：
"scripts": {
    "build:ssr":"webpack --config webpack.ssr.js"
  },
npm i express -D
配置好后 npm run build:ssr  打包
如出现ReferenceError: window is not defined 错误
[目前报错]