'use strict';

// @todo 增加 i18n：https://github.com/yahoo/react-intl/wiki
// @todo 使用 isomorphic 的 json web token 做 auth
import React from 'react';
import Router, {Link} from 'react-router';

module.exports = React.createClass({

    render() {
        return(
            <div className="hb-error-content text-center ">
                <img src="/img/error/error.png" width="95" height="95" className="animated fadeInDown "/>
                <p>糟糕，好像哪里出了点问题！</p>
            </div>
        )
      }

});
