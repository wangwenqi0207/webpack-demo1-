//创建react文件尝试
// import React from 'react'
// import ReactDOM from 'react-dom'
// import timg1 from '../img/timg1.jpg'

const React = require('react');
const timg1 = require('../img/timg1.jpg');
// const ReactDOM = require('react-dom');

import {a} from './tree-shaking' //引入但没有用到的方法 不会被打包 用到哪个打包哪个 其他的也不会被打包


class Search extends React.Component{

    constructor(){
        super(...arguments);
        this.state={
            Text:null
        }
    }
    //点击图片 组件展示 import('./text.js')引入 import方法返回一个promise 所以要用then
    loadComponent(){
        import('./text.js').then((Text)=>{
            this.setState({
                Text:Text.default
            });
        });
    }
    render(){
        const {Text} = this.state;
        return <div className='search-text'>
            {/* Text组件存在时就展示 不存在时 就不展示 */}
            {
                Text ? <Text/> :null
            }
            搜索文字的内容
            <img src={timg1} onClick={this.loadComponent.bind(this)}/>
            </div>
    }
}

module.exports = <Search/>;

