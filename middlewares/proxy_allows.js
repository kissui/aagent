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
            }
	   ],

    // 可以这样对线上的 access.log 筛选接口
    // grep -v HEAD access.log  | awk '{print $6,$7}' | sed 's/\?.*//' | sort | uniq -c | sort -k 3 -k 2

    /**********************  需要通过代理验证的接口    *******************/
    validate:[
        {
            method:'GET',
            url:'/api/*'
        },
        {
            method:'POST',
            url:'/api/*'
        },
        {
            method:'POST',
            url:'/api/ss/'
        }

    ]
    //  validate end
};

module.exports = proxyCheckObj;
