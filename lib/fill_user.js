'use strict';

var _ = require('lodash');

module.exports = function (source, req, token) {

    var randomString;

    var duid = _.get(source, 'CH_DEALER_USER_ID') ? _.get(source, 'CH_DEALER_USER_ID') : 0
    var user = {
        bid: _.get(source, 'I_BIND_ID', '0'),       // bid、uid、hb_uid 可能超过 js number 长度限制，所以用 string
        uid: _.get(source, 'I_USER_ID', '0'),       // 云账户用户ID
        hb_uid: _.get(source, 'I_HB_USER_ID', '0'), // 红包用户ID
        duid: duid,   // 商户用户ID
        dealer_id: _.get(source, 'I_DEALER_ID'),       // 商户索引ID，并不是商户编号，商户编号仅用在授权登录与合作往来

        dealer_code: _.get(source, 'CH_DEALER_CODE'),  // 商户编号

        dealer_proxy: _.get(source, 'dealerProxyName'),

        device_id: req.header('device-id'),

        mess: 0,          // mess是一个随机的int64的数，暂用 0，与 go 版本兼容

        // 用不上的暂时都注释掉，减小 token 尺寸(Xiaopei Li@2016-05-11)

        // has_bankcard: _.get(source, 'hasBankcard', ''),
        // has_paypass: _.get(source, 'hasPayPassword'),

        // real_name: _.get(source, 'CH_REAL_NAME'),

        // channelName: _.get(source, 'channelName'),
        // sloganImage: _.get(source, 'sloganImage'),

        // component: _.get(source, 'component'),

        // channel_key: _.get(source, 'channel_key'),
        // channel_title: _.get(source, 'channel_title'),

        // cs_phone: _.get(source, 'cs_phone'),

    };

    return user;

};
