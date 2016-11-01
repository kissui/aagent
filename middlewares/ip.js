'use strict';

var _ = require('lodash');


/**
 *
 * 过滤代理（proxy）的影响，获取用户真实 IP，由于代理有 slb、nginx 多层，
 * 用 trust proxy 不合适。
 *
 * 需要与 nginx 配置配合使用
 *
 */
module.exports = function() {

    return function(req, res, next) {

        req.clientIP = req.headers['x-slb-forwarded-for'] ||
            req.headers['x-nginx-forwarded-for'] ||
            req.ip;

        next();

    };

};
