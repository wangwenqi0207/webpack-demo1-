//webpack文件
const glob = require('glob')  //多页面打包
const path = require('path')
const webpack = require('webpack')
const { CleanWebpackPlugin } = require('clean-webpack-plugin');



//编写一个匹配打包规则的函数
const setMPA =()=>{
    const entry = {};
    const htmlWebpackPlugins=[];

    const entryFiles = glob.sync(path.join(__dirname,'./src/*/index.js'));
    // console.log('entryFiles',entryFiles)  //路径
    Object.keys(entryFiles)
        .map((index) => {
            const entryFile = entryFiles[index];
            const match = entryFile.match(/src\/(.*)\/index\.js/);  

            // console.log('match', match)  //匹配后的

            const pageName = match && match[1];
            entry[pageName] = entryFile;
            htmlWebpackPlugins.push(
                new HtmlWebpackPlugin ({       
                    template:path.join(__dirname,`src/${pageName}/index.html`),
                    filename:`${pageName}.html`,
                    chunks:[pageName],
                    inject:true,
                    minify:{
                        html5:true,
                        collapseWhitespace:true,
                        preserveLineBreaks:false,
                        minifyCSS:true,
                        minifyJS:true,
                        removeComments:false,
                    }
                }),
            );
        })
    return {
        entry,
        htmlWebpackPlugins
    }
}

const {entry,htmlWebpackPlugins} =setMPA();

module.exports={
    entry:entry,  //打包入口
    watch:true, //文件监听
    //只有开启监听模式时，watchOptions才有意义
    watchOptions:{
        //默认为空，不监听的文件或者文件夹，支持正则匹配
        ignored:/node_modules/,
        //监听到变化发生后会等300ms再去执行，默认300ms
        aggregateTimeout:300,
        poll:1000
    },
    // entry:{
    //     index:'./src/index.js',
    //     search:'./src/search.js'
    // },  //入口文件配置
    output:{                    //导出文件配置
        path:path.join(__dirname,'dist'),  //目录文件夹
        filename:'[name].js'   //打包后的文件名
    },
    mode:"development",   //环境配置  开发环境  一般情况下最好设置一下mode
    module:{     //loader使用
        rules:[
            {
                test:/\.css$/,
                loader:'style-loader!css-loader'  //必须要先写style后写css
            },
            {
                test:/\.js$/,
                use:'babel-loader' 
            },
            {
                test:/\.less$/,             //less是在css的基础之上增加一个less-loader
                use:[
                    'style-loader',
                    'css-loader',
                    'less-loader'
                ]
            },
            {
                test:/\.(png|svg|jpg|gif)$/,
                use:[
                    'file-loader'
                ]
                // use:[
                //     {
                //         loader:'url-loader',
                //         options:{
                //             limit:10240  //如果图片大小小于10k webpack打包时会自动做一个base64转码
                //         }
                //     }
                // ]
            },
            {
                test:/\.(woff|woff2|eot|ttf|otf)$/,
                use:[
                    'file-loader'
                ]
            }
        ]
    },
    plugins:[
        new webpack.HotModuleReplacementPlugin(),  //热更新插件
        new CleanWebpackPlugin(),  //自动清理每次打包的插件
    ].concat(htmlWebpackPlugins),  //将写好的多页面打包插件安装进来
    devServer:{
        contentBase:'./dist',
        hot:true
    },
    devtool:'source-map' //开启之后 打断点调试时可以开启源代码 比较方便 
};