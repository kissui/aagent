'use strict';

import _ from 'lodash';
import jwt from 'jsonwebtoken';

const users = [{

    username: 'admin',
    password: 'admin',
}],
      expiresIn = 7*86400, // 7d, 根据 https://github.com/jiandanlicai/projects/issues/437 确定 token 一周有效

      jwtSecret = 'heiheihaihuihua',
      // 推荐使用：random 32 character length hex string
      // http://security.stackexchange.com/a/96176
      jwtOptions = {
          // algorithm or alg (default: HS256)
          // expiresIn: expressed in seconds or a string describing a time span rauchg/ms. Eg: 60, "2 days", "10h", "7d"
          expiresIn: expiresIn,
          // notBefore: expressed in seconds or a string describing a time span rauchg/ms. Eg: 60, "2 days", "10h", "7d"
          // audience
          // issuer
          // jwtid
          // subject
          // noTimestamp
          // header
      };


// @todo 确认按 export function foo 在外无法以 auth.foo 使用的问题
// export function authenticate(username, password) {

function authenticate(username, password) {
    let user = _.find(users, {
        'username': username,
        'password': password
    });

    let token = null;

    if (user) {

        delete user.password;

        token = sign(user);

        return token;
    }

}

function sign(payload) {
  return {
    token: jwt.sign(payload, jwtSecret, jwtOptions),
    expiresIn: Math.floor(Date.now() / 1000) + expiresIn
  }
}

function verify(token) {
    return jwt.verify(token, jwtSecret)
}

export default {
    authenticate: authenticate,
    verify: verify,
    sign: sign,
}
