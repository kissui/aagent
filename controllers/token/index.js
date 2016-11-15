'use strict';

var _ = require('lodash'),
    debug = require('debug')('sdk'),
    be = require('../../lib/be')({clientType: 'sdk'}),

    // 开发环境
    // validator = require('../../lib/middleware/validator_memory');
    // 生产环境
    // validator = require('../../lib/middleware/validator_redis'),
    fillUser = require('../../lib/fill_user');

import Auth from '../../lib/auth';
import md5 from 'md5';

// 加载动态自定义白名单的 CORS
import CORS from '../../lib/cors';

module.exports = function(router) {

    // 关于 app 接入 html 页面的说明：
    //
    // 1. 获取 token 的接口修改如下，参数不变：
    // POST /api/auth-token -> POST /token/sign
    // POST /api/hx-auth-token -> POST /token/easemob
    //
    // 2. App 进入 html 的入口修改如下：
    // 从 GET /autoLogin/entrance 改为直接访问目的路由，如
    // 零钱明细 /app/bills，问题列表 /app/qa
    // 访问时需要在 cookie 的 token 中带上之前获取的 token，
    // 可以看 webview 有没有直接管理 token 的参数；如果没有，
    // 可以用 header 设置 Cookie:token=$token

    // 即 POST /api/auth-token
    //
    // e.g.
    // http post localhost:3000/token/sign partner=123456 reg_hongbao_user=1 user_id=1 timestamp=1462544109 sign=64db930227c9283e8ed2a97643a1a218818cee13a1dce2f5b216d4e6eaabf3b7
    router.post('/sign', function(req, res, next) {

        var data = _.assign(req.query, req.body);

        validateUser(data)
            .then(getToken(req))
            .then(sendToken(res))
            .catch(next);

    });

};

