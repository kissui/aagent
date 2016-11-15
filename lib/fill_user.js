'use strict';

var _ = require('lodash');

module.exports = function (source, req, token) {
    var user = {
        username: _.get(source, 'I_BIND_ID', '0'),
    };

    return user;

};
