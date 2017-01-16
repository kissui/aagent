'use strict';
import Auth from './auth';
import _isEmpty from 'lodash/isEmpty';


const crypto = require('crypto');
const yyPassSalt = 'YzhHb712';

/*
    项目中一些公用的方法
*/




const YUNZH_STR = /s/g;
let proxyName;

export function yyHashPwd(pwd) {
    // 关于客户端支付密码更改为密文规则：

    // sha256($plainText + $salt)  // 此处加盐，盐值固定为：YzhHb712

    // 示例：

    // <?php

    // $plainText = 123456;
    // $salt = 'YzhHb712';

    // echo "加密原串: {$plainText}{$salt}\n";
    // $enhancedPassword = hash('sha256', $plainText . $salt);
    // echo "加密结果: {$enhancedPassword}\n";

    // ?>

    // 加密原串: 123456YzhHb712
    // 加密结果: 994dfea3e5e78deb1fcf77ebd59692199ed0eed5a34da94182bf7a29f360597b

    var passWithSalt = pwd + yyPassSalt;
    var hash = crypto.createHash('sha256').update(passWithSalt).digest('hex');

    console.log('@hash', pwd, passWithSalt, hash);

    return hash

}

export function isEmpty(obj) {
    return _isEmpty(obj);
}

export function isServerRender(app) {
    return app.props.serverSide             // 是 serverSide render
        && !_isEmpty(app.props.initialState) // 且设置了初始数据
}

export function isBrowserSide() {
    try {
        return !_isEmpty(window)
    }
    catch (e) {
        return false;
    }
}

export default {

    inIframe() {
        try {
            return window.self !== window.top;
        } catch (e) {
            return true;
        }
    },

    // author:mancoxu,date:160606; 替换字符串（针对faq列表页面和详情页面）
    proxyReplaceYunStr(tag){
        // proxyName => 商户名称（如果有的话则为替换对象）
        // tag => 替换的字符
        // reg => 匹配替换的字符

        proxyName = Auth.getDealerProxy();
        if (proxyName != "") {
            return tag.replace(YUNZH_STR,proxyName)
        }else{
            return tag;
        }
    },

    // author:mancoxu,date:160606; 简易modal (针对一些简单的提示 eg: 验证银行卡页面)
    delayPop(txt,delay,callback){
        let body = document.body;
        let popBox = document.createElement("div"),
            txtHtml = "",
            idName = "yyDelayPop";

        popBox.id = idName;
        txtHtml += '<p>'+txt+'</p>';
        popBox.innerHTML = txtHtml;

        if (!document.getElementById(idName)) {
            return (function(){
                    body.appendChild(popBox);
                    setTimeout(function(){
                        body.removeChild(popBox);

                        if(callback){
                            callback();
                        }
                    },delay);

            })();
        }

    }
}
