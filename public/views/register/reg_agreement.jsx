

/*
    author:mancoxu,
    date:16-05-08
*/



'use strict';

import _ from 'lodash';
import React from 'react';
import Auth from '../../lib/auth';
import IsLoading from '../../components/is_loading.jsx';//正在加载
import YunAgreement from './components/yun_agreement.jsx';//云账户协议
import HxAgreement from './components/huanxin_agreement.jsx';//环信协议

//import Header from '../../components/header_components.jsx';

module.exports =  React.createClass({

    // client/server 都会运行
    getInitialState: function() {
        return {
            proxy: null
        };
    },

    // dom 相关，仅 client 运行
    componentDidMount: function() {
        this.setState({
            proxy: Auth.getDealerProxy()
        });
    },

    render: function() {

        let agreementCom = "";

        if (this.state.proxy === null) {
            agreementCom = <IsLoading/>
        } else if (this.state.proxy == "环信") { //如果是环信
            agreementCom = <HxAgreement/>
        } else {                  // 如果是其它（如空字符串）
            agreementCom = <YunAgreement/>
        }

        return (
            <div>
               <div className="hb-reg-agreement">
                    {agreementCom}
                </div>
            </div>
        );
    }
});
