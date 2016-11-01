'use strict';

var proxyAllows = require('./proxy_allows').validate,
    debug = require('debug')('proxy'),
    url = require('url');

const winston = require('winston');
const logfile = __dirname + '/../logs/api.log';

var logger = new (winston.Logger)({
    transports: [
        new (winston.transports.File)({ filename: logfile })
    ]
});

module.exports = function() {

    // 1. 检查请求是否被允许；
    // 2. 将请求中的 uid、did、duid、IDCard 等信息替换为 session 中的内容，
    //    避免越权访问；
    return function(req, res, next) {

        debug('init', {
            method: req.method,
            url:    req.url,
            path:   req.path,
            query:  req.query,
            body:   req.body
        });

        var ok = false,
            dest = {
                // path
                // url
                // query
                // body
            };
        // 遍历允许的 api
        for (var i = 0, l = proxyAllows.length; i < l; i++) {

            var allow = proxyAllows[i];

            // 检查 method...
            if (req.method !== allow.method) {
                continue;
            }

            // ...和 path 是否符合某个允许的 API
            var re = new RegExp(allow.url);
            var rs = re.exec(req.path);
            if (rs) {

                logger.info('allow', allow);

                // 如果允许该 API
                ok = true;
                dest.url = req.url;
                dest.path = req.path;
                dest.query = req.query;
                dest.body = req.body;

                // 则要根据配置，替换 uid、did、duid 等信息
                if (allow.replaceUid) {
                    // 替换 uid
                    debug(allow.replaceUid);

                    for (var j = 0, k = allow.replaceUid.length; j < k; j++) {

                        if (allow.replaceUid[j][0] === '#') {
                            // 替换 path
                            // 如果是 #n，则表示要替换 path 中 regexp 匹配
                            // 的第 n 个 group

                            // @TODO regexp 并没有替换第 n 个 group 的
                            // 功能，暂时用第 n 个 group 的文本做替换
                            dest.path = req.path.replace(
                                // 1. allow.replaceUid[j].substr(1) 为去掉 # 后的序号
                                // 2. rs[n] 是第 n 个 group
                                rs[allow.replaceUid[j].substr(1)],
                                // 使用 session 中的 uid 替换
                                req.user.uid
                            );

                        }
                        else {
                            // 替换 query 和 body
                            if (req.query[allow.replaceUid[j]]) {
                                dest.query[allow.replaceUid[j]] = req.user.uid;
                            }
                            if (req.body[allow.replaceUid[j]]) {
                                dest.body[allow.replaceUid[j]] = req.user.uid;
                            }
                        }
                    }
                }

                if (allow.replaceBid) {
                    // 替换 bid
                    debug(allow.replaceBid);

                    for (var j = 0, k = allow.replaceBid.length; j < k; j++) {

                        if (allow.replaceBid[j][0] === '#') {
                            // 替换 path
                            // 如果是 #n，则表示要替换 path 中 regexp 匹配
                            // 的第 n 个 group

                            // @TODO regexp 并没有替换第 n 个 group 的
                            // 功能，暂时用第 n 个 group 的文本做替换
                            dest.path = req.path.replace(
                                // 1. allow.replaceBid[j].substr(1) 为去掉 # 后的序号
                                // 2. rs[n] 是第 n 个 group
                                rs[allow.replaceBid[j].substr(1)],
                                // 使用 session 中的 bid 替换
                                req.user.bid
                            );

                        }
                        else {
                            // 替换 query 和 body
                            if (req.query[allow.replaceBid[j]]) {
                                dest.query[allow.replaceBid[j]] = req.user.bid;
                            }
                            if (req.body[allow.replaceBid[j]]) {
                                dest.body[allow.replaceBid[j]] = req.user.bid;
                            }
                        }
                    }
                }

                // @todo 替换 idcard、did、duid

                // 跳出循环
                break;
            }

        }

        // 如果请求不符合任何允许的 API
        if (!ok) {

            logger.info('forbid', {
                method: req.method,
                url:    req.url,
                path:   req.path,
                query:  req.query,
                body:   req.body
            });

            // 则报错
            next({
                code: -3,
                msg: 'not allow'
            });
            return;
        }

        dest.url = url.format({
            pathname: dest.path,
            query: dest.query
        });
        debug('finl', dest);
        return dest;
    };

};
