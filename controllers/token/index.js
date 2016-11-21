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

    router.post('/sign', function(req, res, next) {

        var data = _.assign(req.query, req.body);

        validateUser(data)
            .then(getToken(req))
            .then(sendToken(res))
            .catch(next);

    });

};

