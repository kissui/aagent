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
import config from 'config';

import Tracker from '../../lib/tracker';

var tracker = Tracker(config.get('track.server'));

module.exports = function(router) {

    router.post('/', function(req, res) {

        // 先 http 返回
        res.status(204).end();

        var token = req.get('x-auth-token');

        // 再处理日志

        var logs = req.body;

        tracker.track(logs);

    });

}
