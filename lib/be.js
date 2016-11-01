'use strict';


// dependencies

// http://visionmedia.github.io/superagent/
var superagent = require('superagent-bluebird-promise'),
    BPromise   = require('bluebird'),
    qs         = require('querystring'),
    _          = require('lodash'),
    debug      = require('debug')('sdk:be'),
    config     = require('config');


// default config
var defaultHost       = config.get('be.host'),
    defaultToken      = 'hehe',
    defaultTimeout    = 30000, // ms
    defaultClientType = 'unknown';


// constructor
function BEClient(opt) {

    this.clientType = _.get(opt, 'clientType', defaultClientType);
    this.host       = _.get(opt, 'host', defaultHost);
    this.token      = _.get(opt, 'token', defaultToken);
    this.timeout    = _.get(opt, 'timeout', defaultTimeout);

}

// methods
BEClient.prototype._request = function(type, uri, data) {

    uri = this.host + uri;
    debug('full uri', uri);
    var rq = superagent(type, uri);

    if (['POST', 'PUT'].indexOf(type) >= 0) {
        rq.send(data);
    }

    rq.timeout(this.timeout); // set timeout

    rq.set({
        'Client-Type': this.clientType,
        'Authorization': 'token ' + this.token,
        'Accept': 'application/json',
        'version': config.get('clientVersion'),
        'request-id': getRequestId()
    });

    debug(this.clientType, 'calls', uri);
    // 返回结构详见：
    //
    // https://github.com/jiandanlicai/bell-flower/
    //
    // then 和 catch 都可能返回错误，then 返回的错误是后端定义的错误，
    // catch 返回的错误是通信错误（code 为负数）
    //
    return rq.promise()
        .then(function(res) {
			//200
			debug(res.body);
            return res.body;
        })
        .catch(function(err) {
			//400 or 其他
			if (err.status == 400){
				return err.body;
			}

            return {
                err: {
                    code: 0 - err.status,
                    message: err.body
                }
            };

        });
};

BEClient.prototype.get = function(uri, query) {
    if (typeof query === 'object') {
        uri += '?' + qs.stringify(query);
    }

    return this._request('GET', uri);
};

BEClient.prototype.head = function(uri) {
    return this._request('HEAD', uri);
};

BEClient.prototype.delete = function(uri) {
    return this._request('DELETE', uri);
};

BEClient.prototype.post = function(uri, data) {
    return this._request('POST', uri, data);
};

BEClient.prototype.put = function(uri, data) {
    return this._request('PUT', uri, data);
};

module.exports = function(opt) {
    return new BEClient(opt);
};


function getRequestId() {
    let id = Date.now() * 1000 + _.padStart(_.random(0, 9999), 4, '0');
    return id;
}
