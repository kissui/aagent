'use strict';

var _ = require('lodash');
import Auth from '../lib/auth';
var allow = require('./proxy_allows').allow;
var debug = require('debug')('sdk:auth');


const winston = require('winston');
const errorLogFile = __dirname + '/../logs/error.log';
const errorLogger = new (winston.Logger)({
    transports: [
        new (winston.transports.File)({ filename: errorLogFile })
    ]
});


var JsonWebTokenError = require('jsonwebtoken/lib/JsonWebTokenError');


/**
 *
 * 过滤代理（proxy）的影响，获取用户真实 IP，由于代理有 slb、nginx 多层，
 * 用 trust proxy 不合适。
 *
 * 需要与 nginx 配置配合使用
 *
 */
function middleware() {

    return function checkAuthMiddleware(req, res, next) {

        let accessToken = req.query['access-token'] || _.get(req, 'headers.x-auth-token', req.cookies.token);
        // 支持从 query 传 token（所以必须用 HTTPS），query 优先级最高

        // @TODO 确定并增强安全性

        errorLogger.error('token', {
            req: req.get('request-id'),
            ua: req.get('user-agent'),
            path: req.path,
            token: accessToken
        });

        let user = null;
        try {

            if (!accessToken) {
                throw new JsonWebTokenError();
            }

            user = Auth.verify(accessToken);

            errorLogger.error('user', {
                req: req.get('request-id'),
                token: user
            });


            if (!user.uid && !user.hb_uid) {
                throw new JsonWebTokenError();
            }

        }
        catch (err) {

            errorLogger.error('error', {
                req: req.get('request-id'),
                error: err
            });

            let allowAccessWithoutUser = allow.some((control) => {
                let reg = new RegExp(control.path);

                let t =  reg.test(req.path);

                debug(req.path, reg, t);

                return t;

            });


            if (allowAccessWithoutUser) {
                return next();
            }

            next(err);
        }

        // token: undefined
        // @todo token 需处理 token 异常的情况，异常时会跳到(Xiaopei Li@2016-05-09)
        // ####err { [JsonWebTokenError: jwt malformed] name: 'JsonWebTokenError', message: 'jwt malformed' }
        // ####err { [TokenExpiredError: jwt expired]
        //   name: 'TokenExpiredError',
        //   message: 'jwt expired',
        //   expiredAt: Sat May 07 2016 16:12:44 GMT+0800 (CST) }

        //debug('### jwt', user);

        if (user) {
            req.user = user;
            req.accessToken = accessToken;

            // 设置后端需要的 header
            req.headers['user-id'] = req.user.uid;

            req.headers['dealer-id'] = _.get(req.user, 'dealer_id', '');
            req.headers['dealer-code'] = _.get(req.user, 'dealer_code', '');
            req.headers['dealer-user-id'] = _.get(req.user, 'duid', '');

            req.headers['identifier'] = req.user.dealer_id + '-' + req.user.duid;

            req.headers['api-auth-method'] = 'token';

        }

        next();

    };

};


const lesErrorVersion = new RegExp('^LesParkFree\/5.0.6');

function errorHandler(err, req, res, next) {

    errorLogger.error('errorHandler', {
        req: req.get('request-id'),
        error: err
    });


    if (lesErrorVersion.test(req.get('user-agent'))) {
        return res.json({
            "code":"1000",
            "message":"登录信息失效了，请重新登录后再试吧",
        });
    }

    let errName = _.get(err, 'name');

    if (errName == 'JsonWebTokenError') {
        // token 解析出错
        res.status(401);
        return res.json({
            code: -1,
            message: 'Token 不合法',
            ext: err.message
        });
    }
    else if (errName == 'TokenExpiredError') {
        // token 解析出错
        res.status(401);
        return res.json({
            code: -2,
            message: 'Token 已过期',
            ext: err.message
        });
    }

    return next(err);
}

export default {
    middleware: middleware,
    errorHandler: errorHandler
};
