//webpack文件
// Users/admin/Desktop/webpack/src/index/index.js
const glob = require('glob')  //多页面打包
const path = require('path')
// const webpack = require('webpack')
const miniCssExtractPlugin=require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

//编写一个匹配打包规则的函数
const setMPA =()=>{
    const entry = {};
    const htmlWebpackPlugins=[];

    const entryFiles = glob.sync(path.join(__dirname,'./src/*/index-server.js'));
    // console.log('entryFiles',entryFiles)  //路径
    Object.keys(entryFiles)
        .map((index) => {
            const entryFile = entryFiles[index];
            const match = entryFile.match(/src\/(.*)\/index\.js/);  

            // console.log('match', match)  //匹配后的

            const pageName = match && match[1];
            if(pageName){
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
        } 
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
        filename:'[name]-server.js',   //打包后的文件名
        libraryTarget:"umd"
    },
    mode:"none",   //production 环境配置  生产环境  一般情况下最好设置一下mode
    module:{     //loader使用
        rules:[
            {
                test:/\.js$/,
                use:'babel-loader' 
            },
            {
                test:/\.css$/,        
                use:[
                    miniCssExtractPlugin.loader,  //css文件指纹  此插件与style-loader不兼容  生产环境可以删去style-loader
                    'css-loader',
                ]
            },
            {
                test:/\.less$/,             //less是在css的基础之上增加一个less-loader
                use:[
                    miniCssExtractPlugin.loader,  //文件指纹
                    'css-loader',
                    'less-loader',
                    {
                        loader:'postcss-loader',  //css补全前缀
                        options:{
                            plugins:()=>[
                                require('autoprefixer')({
                                    browsers:['last 2 version','>1%','ios 7'] 
                                })
                            ]
                        }
                    }
                ]
            },
            {
                test:/\.(png|svg|jpg|gif)$/,
                use:[
                    {
                        loader: 'file-loader',
                        options:{
                            name:'[name]_[hash:8][ext]'  //图片文件指纹
                        }
                    }                    
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
                    {
                        loader: 'file-loader',
                        options:{
                            name:'[name]_[hash:8][ext]'  //字体文件指纹
                        }
                    }   
                ]
            },
            // {
            //     loader:'px2rem-loader',  //px转换rem
            //     options:{
            //         remUnit:75,     //代表一个rem是75px 750设计稿
            //         remPrecision:8  //px转换成rem小数点后面的位数
            //     }
            // }
        ]
    },
    // 安装好的插件添加到plugins里面去
    plugins:[
        new miniCssExtractPlugin({
            filename:'[name]_[contenthash:8].css'
        }),
        new OptimizeCSSAssetsPlugin({   //压缩css
            cssProcessor: require('cssnano'), //引入cssnano配置压缩选项
            cssProcessorOptions: { 
             discardComments: { removeAll: true } 
            },
            canPrint: true //是否将插件信息打印到控制台
        }),
        // new HtmlWebpackPlugin ({       //压缩html  一个页面对应一个HtmlWebpackPlugin
        //     template:path.join(__dirname,'src/search.html'),
        //     filename:'search.html',
        //     chunks:['search'],
        //     inject:true,
        //     minify:{
        //         html5:true,
        //         collapseWhitespace:true,
        //         preserveLineBreaks:false,
        //         minifyCSS:true,
        //         minifyJS:true,
        //         removeComments:false,
        //     }
        // }),
        // new HtmlWebpackPlugin ({       
        //     template:path.join(__dirname,'src/index.html'),
        //     filename:'index.html',
        //     chunks:['index'],
        //     inject:true,
        //     minify:{
        //         html5:true,
        //         collapseWhitespace:true,
        //         preserveLineBreaks:false,
        //         minifyCSS:true,
        //         minifyJS:true,
        //         removeComments:false,
        //     }
        // }),
        new CleanWebpackPlugin(), //自动清理每次打包的插件
    ].concat(htmlWebpackPlugins),  //将写好的多页面打包插件安装进来
    devtool:'source-map'
};