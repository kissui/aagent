'use strict';

import qs from 'querystring';
import _ from 'lodash';
import Auth from '../../lib/auth';
import fillUser from '../../lib/fill_user';
import BE from '../../lib/be';
import bills from '../../bills.json';
import md5 from 'md5';
import Debug from 'debug';

let be = BE({clientType: 'sdk'});
let debug = Debug('sdk');

module.exports = function (router) {

    router.get('/refresh', function(req, res) {
        console.log('user', req.user);
        return res.json(req.user);
    });

    router.get('/auto-login', function(req, res) {
        // 其实可以任何要到达的地址 + header 来达到
        // auto login 的效果

        // http://localhost:3000/autoLogin?
        // partner=123456
        // user_id=563df436c5bcc
        // mobile=18914066032
        // channel=1a2b3c
        // timestamp=1462360674
        // sign=b30595493a044c3806760ae637fa0d531c12308b8ff2cff58dbc42066ff8a8e5


        // http://localhost:3000/autoLogin?partner=123456&user_id=563df436c5bcc&mobile=18914066032&channel=1a2b3c&timestamp=1462370935&sign=1c826d45334751e024af7a0d747eab32be42c24cab6c6cf4a7fc8b6d10d81d0e
        var queryString = qs.stringify(req.query),
            ipAddress = req.clientIP,
            token;

        console.log('@ip=====:',ipAddress);
        console.log(req.headers['device-id'],'13894545456456');

        be.get('/dealer/user/id?' + queryString).then(function (result) {

            debug(result);

            if (!result.message) {
                var user = fillUser(result, req);

                debug(user);

                var tokenObj = Auth.sign(user);
                token = tokenObj.token;

                // @todo “session 中记录的 user”和“浏览器记录的 user”属性可以不同

                // 请求创建[查询设备指纹]任务
                // 现在实际是没有 session id 的，使用 md5(token) 代替
                var sessionId = md5(token),
                    data = {
                        uid: user.uid,
                        sessionId: sessionId,
                        ip_address: ipAddress,
                        refer: 'huanxin',
                        did: user.dealer_id,
                        duid: user.duid,
                        deviceId: req.headers['device-id']
                    };


                be.post('/user/task/fingerprint-request', data);
                // 不期望返回，所以没有 then

                res.cookie('token', token, {
                    httpOnly: true,

                    // @TODO 设置与 token 相同的 expires（有必要吗？FE 没法拿 cookie、
                    // 用 cookie 判断登陆状态及登陆是否过期）
                    // expires: Date, Expiry date of the cookie in GMT. If not
                    //          specified or set to 0, creates a session cookie.
                    // maxAge: String, Convenient option for setting the expiry time
                    //         relative to the current time in milliseconds.

                    // @TODO 还有一些安全设置可参考：
                    // https://stormpath.com/blog/where-to-store-your-jwts-cookies-vs-html5-web-storage/

                });

                return res.redirect('/');

                /*
                // 设置登录后的跳转路径。
                // 为避免 xss 使用了 encodeURIComponent
                if (req.query.jump) {
                user.jump = encodeURIComponent(req.query.jump);
                }

                var gotoQuery = qs.stringify(user);
                return res.redirect('/#/app/autoLogin?' + gotoQuery);
                */
            }

            //TODO 自动登录友好报错
            return res.json(result);


        }).catch(function (err) {

            console.log(err);

            return res.json({
                error: {
                    code: 4,
                    message: '服务器错误'
                }
            });

        });

    });

    // api
    router.post('/login', function(req, res) {

        // 参数检查，出错则返回
        if (!req.body.username || !req.body.password) {
            return res.status(400).json({
                code: 1,
                message: '参数错误'
            });
        }

        let ret = Auth.authenticate(req.body.username, req.body.password);

        if (_.isObject(ret) && ret.token) {
            // 设置 cookie
            res.cookie('token', ret.token, {
                httpOnly: true,

                // @TODO 设置与 token 相同的 expires（有必要吗？FE 没法拿 cookie、
                // 用 cookie 判断登陆状态及登陆是否过期）
                // expires: Date, Expiry date of the cookie in GMT. If not
                //          specified or set to 0, creates a session cookie.
                // maxAge: String, Convenient option for setting the expiry time
                //         relative to the current time in milliseconds.

                // @TODO 还有一些安全设置可参考：
                // https://stormpath.com/blog/where-to-store-your-jwts-cookies-vs-html5-web-storage/

            });

            return res.json(ret.user);
            // 返回
        }

        // 返回“用户名与密码不匹配”
        return res.status(400).json({
            code: 2,
            message: '用户名与密码不匹配'
        });

    });

}
