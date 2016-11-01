'use strict';

var proxyCheckObj = {

    // 允许未登陆（无 token）就能访问的 API
    allow: [{
                method: 'post',
                path: '^/token'
            }, {
                method: 'post',
                path: '^/log'
            }, {
                method: 'get',
                path: '^/app'
            }, {
                method: 'get',
                path: '^/autoLogin'
            }, {
                method: 'get',
                path: '^/_user/auto-login'
            }, {
                method: 'post',
                path: '^/_user/login'
            }, {
                method: 'get',
                path: '^/api/sign'
            }, {
                method: 'post',
                path: '^/hongbao-payment/.*notify.*'
	    }, {
                method: 'post',
                path: '^/tools/autoLogin'
	    }
	   ],

    // 可以这样对线上的 access.log 筛选接口
    // grep -v HEAD access.log  | awk '{print $6,$7}' | sed 's/\?.*//' | sort | uniq -c | sort -k 3 -k 2

    /**********************  需要通过代理验证的接口    *******************/
    validate:[
        {
           method: 'GET',
            url: '/user/verification/id-photo/list'
        },
        {
            method: 'PUT',
            url: '/user/verification/id-photo/(\\d+)'
        },
        // api 类请求在后端会根据 header 做验证，
        // 所以直接通过
        {
            method:'GET',
            url:'/api/*'
        },
        {
            method:'POST',
            url:'/api/*'
        },
        // 银行查询类接口
        {
            method:'GET',
            url:'/xy/bank/*'
        },

        // faq
        // index 列表
        {
            method: 'GET',
            url: '/faq'
        },
        //列表详情 /faq/:id
        {
            method: 'GET',
            url: '/faq/:id'
        },
        //faq/recommend  推荐列表
        {
            method: 'GET',
            url: '/faq/recommend'
        },

        // 零钱明细
        {
            method: 'GET',
            url: '/hongbao-payment/bills/(\\d+)',
            replaceBid: [
                '#1'
            ],
        },

        // 已注册用户的零钱余额（h5 示例用）
        {
            method: 'GET',
            url: '/payment/(\\d+)/wallet',
            replaceUid: [
                '#1'
            ]
        },

        // 环信 FAQ
        //question 问题反馈列表
        {
            method: 'GET',
            url: '/question',
            replaceUid: [
                'uid'
            ]
        },
        //question 问题反馈提交
        {
            method: 'POST',
            url: '/question',
            replaceUid: [
                'uid'
            ],
            replaceDid: [
                'dealerId'
            ]
        },
        // 提交的问题数
        {
            method: 'GET',
            url: '/question/number',
            replaceUid: [
                'uid'
            ]
        },
        // 问题类型
        {
            method: 'GET',
            url: '/question/types'
        },

        // 测试用户登录
        {
            method:'GET',
            url:'/tools/autoLogin'
        },

        // 支付宝充值到账
        {
            method:'POST',
            url:'/hongbao-payment/recharge-notify/alipay'
        },

    ]
    //  validate end
};

module.exports = proxyCheckObj;
