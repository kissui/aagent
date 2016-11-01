'use strict';

const request = require('superagent-bluebird-promise');
const debug = require('debug')('sdk:tracker');
const winston = require('winston');
const BPromise = require('bluebird');
const logfile = __dirname + '/../logs/track.log';
const _ = require('lodash');

const logger = new (winston.Logger)({
    transports: [
        new (winston.transports.File)({ filename: logfile })
    ]
});


module.exports = function(server) {

    debug('@tracker');

    return function() {

        // 未配置 server 时，不发日志
        var sendLog = false;
        if (server) {
            sendLog = true;
        }


        var trackAPI = server + '/saveLog/etlData';

        var track = function(logs, req) {

            if (!_.isArray(logs)) {
                logs = [logs];
            }


            var extendData = {

                // sid: token, // sid 太长，没用，先不记了

                uid: _.get(req, 'user.uid', 0),       // 云账户用户 id
                did: _.get(req, 'user.dealer_id', 0), // 商户 id
                duid: _.get(req, 'user.duid', 0),     // 商户用户 id

                // channel: _.get(req, 'user.channelName', ''), // 商户渠道
                // channel_key: _.get(req, 'user.channel_key', ''),
                // channel_title: _.get(req, 'user.channel_title', ''),
                // component: _.get(req, 'user.component', ''), // 商户组件

                ua: _.get(req, 'headers.user-agent', ''),       // ua
                device_id: _.get(req, 'headers.device-id', ''), // 设备号

                ip: _.get(req, 'clientIP'), // IP（需能过滤负载均衡、识别真实 IP）
                server_timestamp: Date.now()
            };

            logs.forEach(function addExtendDataToLogs(log) {
                _.assign(log, extendData);
            });

            logger.info('logs', {logs: logs});

            if (!sendLog) {
                return BPromise.resolve(true);
            }

            return request.post(trackAPI)
                .type('form')
                .send({
                    ETL: JSON.stringify(logs)
                })
                .then(res => {
                }, err => {
                    logger.warn('err', {
                        err: err
                    });
                });
        };

        return {
            track: track
        };

    }();

};
