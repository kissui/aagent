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

    // 1. 先获得 access token
    // http https://a1.easemob.com/easemob-demo/chatdemoui/token grant_type=password username=toksea password=12345678
    // {
    //     "access_token": "YWMt7XLOFO2cEeW0MvESjKUUEgAAAVTClIzDUaA5fNsCp4qogRiPoOtaA9M7BfI",
    //     "expires_in": 5184000,
    //     "user": {
    //         "activated": true,
    //         "created": 1457927757520,
    //         "device_token": "4178a5de27ae845666b048aa1d7746595e92863c96d7d0df1c5934c564b4a2e0",
    //         "modified": 1462353049419,
    //         "notifier_name": "chatdemoui",
    //         "type": "user",
    //         "username": "toksea",
    //         "uuid": "a874dd0a-e998-11e5-b942-4fc1d6c261cf"
    //     }
    // }
    // 2. 再调该接口
    // http post localhost:3000/token/saas orgName=easemob-demo appName=chatdemoui imUserId=toksea imToken=YWMt7XLOFO2cEeW0MvESjKUUEgAAAVTClIzDUaA5fNsCp4qogRiPoOtaA9M7BfI userId=123
    //
    // @TODO 目前只对明确要用 CORS 的接口做 CORS
    router.post(['/easemob', '/saas'], CORS(), function(req, res, next) {

        if (!_.get(req.body, 'userId')) {
            // ios 线上版本未设 userId，用的还是 duid，
            // 所以这样设置以作兼容
            req.body.userId = _.get(req.body, 'duid');
        }


        hxGetSign(req)
            .then(validateUser)
            .then(getToken(req))
            .then(sendToken(res))
            .catch(next);
    });

    router.post(['/easemob-kefu'], CORS(), function(req, res, next) {

        hxKefuGetSign(req)
            .then(validateUser)
            .then(getToken(req))
            .then(sendToken(res))
            .catch(next);
    });

    router.post(['/easemob-kefu-customer'], CORS(), function(req, res, next) {

        hxKefuCustomerGetSign(req)
            .then(validateUser)
            .then(getToken(req))
            .then(sendToken(res))
            .catch(next);
    });

}

/**
 * 调用后端接口验证 IM token，若商户不存在，则创建商户，
 * 返回签名过的内容，供继续调用通用的 get /dealer/user/id
 *
 * return Promise
 */
function hxGetSign(req) {

    return be.post('/api/hx-verify-token', {
        orgName: _.get(req.body, 'orgName'),
        appName: _.get(req.body, 'appName'),
        imUserId: _.get(req.body, 'imUserId'),
        imToken: _.get(req.body, 'imToken'),
        userId: _.get(req.body, 'userId')
    })
        .then(function(result) {
            debug('hxGetSign', req.body, result);

            if (_.isEmpty(result) || result.message) {
                // 出错
                return Promise.reject(result);
            }

            return Promise.resolve(result);
        });

}

function hxKefuGetSign(req) {

    return be.post('/api/hx-kefu-verify-token', {
        tenantId: _.get(req.body, 'tenantId'),
        agentUserId: _.get(req.body, 'agentUserId'),
        tokenName: _.get(req.body, 'tokenName'),
        tokenValue: _.get(req.body, 'tokenValue'),
    })
        .then(function(result) {
            debug('hxKefuGetSign', result);

            if (_.isEmpty(result) || result.message) {
                // 出错
                return Promise.reject(result);
            }

            return Promise.resolve(result);
        });

}

function hxKefuCustomerGetSign(req) {

    // @todo pick req.body
    return be.post('/api/hx-kefu-customer-verify-token', req.body)
        .then(function(result) {
            console.log('hxKefuCustomerGetSign', result);

            if (_.isEmpty(result) || result.message) {
                // 出错
                return Promise.reject(result);
            }

            return Promise.resolve(result);
        });

}

// return Promise
function validateUser(data) {

    return be.get('/dealer/user/id', data)
        .then(function(result) {
            debug('validateUser', result);

            if (result.message) {
                // 出错
                return Promise.reject(result);
            }
            return Promise.resolve(result);
        });
}

// return Promise
function getToken(req) {

    return function(result) {
        debug('getToken', result);

        // req 用来拿 device id
        let user = fillUser(result, req);

        let token = Auth.sign(user);

        let ipAddress = req.clientIP;

        // fqz(user, token, ipAddress);

        return Promise.resolve(token);

    }
}

function sendToken(res) {
    return function(token) {
        debug('sendToken', token);

        res.json({
            code: "0000",
            message: "操作成功",
            data: {
                token: token.token,
                expiresIn: token.expiresIn
            }
        });
        return Promise.resolve(token);
    }
}


function fqz(user, token, ipAddress) {

    //请求创建[查询设备指纹]任务
    var sessionId = md5(token),
        data = {
            uid: user.uid,
            sessionId: sessionId,
            ip_address: ipAddress
        };

    be.post('/user/task/fingerprint-request', data);

}
