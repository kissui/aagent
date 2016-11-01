//'use strict';
//
// @todo 增加 i18n：https://github.com/yahoo/react-intl/wiki
// @todo 使用 isomorphic 的 json web token 做 auth
import React from 'react';
import Router, {Link,History} from 'react-router';
import Numbro from 'numbro';//https://github.com/foretagsplatsen/numbro
import http from '../lib/http';
import Auth from '../lib/auth';
import IsLoading from '../components/is_loading.jsx';//正在加载


import {isServerRender} from '../lib/utils';

module.exports = React.createClass({

    getInitialState: function() {

        if (isServerRender(this)) {
            return this.props.initialState;
        }

        return {
        };

    },

    // componentWillMount 在 server/client 都会执行，但是由于
    // React.renderComponentToString() 是同步（synchronous）的，所以
    // 通过 ajax 请求得来的数据没法插到 server render 的页面里，所以不
    // 能方便的“一套代码，server/client 都正常 render”
    // 详见：
    // http://stackoverflow.com/questions/25983001/strategies-for-server-side-rendering-of-asynchronously-initialized-react-js-comp#
    // https://github.com/facebook/react/issues/1739
    //
    // componentWillMount: function() {
    componentDidMount: function() {

        if (isServerRender(this)) {
            // 首屏过后，就不是 serverSide 了，所以要删掉
            __REACT_ENGINE__.serverSide = false;
            return;
        }

    },

    render() {
        return(
          <div>
            <h1>欢迎访问独代 BOSS</h1>
            <ul>
              <li>
                <Link to='/app/check-id/2'>
                  身份证审核
                </Link>
              </li>
            </ul>
          </div>
        )
      }

});


