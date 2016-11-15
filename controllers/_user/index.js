'use strict';

import qs from 'querystring';
import _ from 'lodash';
import Auth from '../../lib/auth';
import BE from '../../lib/be';
import md5 from 'md5';
import Debug from 'debug';

let be = BE({clientType: 'sdk'});
let debug = Debug('sdk');

module.exports = function (router) {

    router.get('/refresh', function(req, res) {
        console.log('user121223324d34234223234', req.user);
        req.user = 'admin';
        return res.json(req.user);
    });

    router.get('/auto-login', function(req, res) {
    });

    // api
    router.post('/login', function(req, res) {

        console.log(req.body.username,req.body.password,'----------------------------------------')
        // 参数检查，出错则返回
        if (!req.body.username || !req.body.password) {
            return res.status(400).json({
                code: 1,
                message: '参数错误'
            });
        }

        let ret = Auth.authenticate(req.body.username, req.body.password);
        console.log(ret,'----------------------------------------')
        if (_.isObject(ret) && ret.token) {
            // 设置 cookie
            res.cookie('token', ret.token, {
                httpOnly: true,

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

};
