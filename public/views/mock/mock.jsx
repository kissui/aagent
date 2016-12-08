'use strict';

import React from 'react';
import IsLoading from '../../components/is_loading.jsx';//正在加载
import Auth from '../../lib/auth';
import { browserHistory } from 'react-router';
import http from '../../lib/http';
module.exports = React.createClass({
    contextTypes: {
        router: React.PropTypes.object
    },
    getInitialState: function() {
        return {
            bills: null
        };
    },
    componentDidMount: function() {
        let _this = this;
        Auth.loggedIn(msg=>{
            if (msg != 0) {
                this.context.router.push('/app/login')
                // browserHistory.push('/app/login')
            } else{
                this.context.router.push('/app/game')
                // browserHistory.push('/app/game')
            }
        });
    },
    render: function render() {

        let bills = this.state.bills;
        let billsDisplay = '';

        if (bills === null) {
            billsDisplay = <IsLoading/>;
        }

        return (
            <div id='list' className="hb-bills-box">
                <ul>
                    {billsDisplay}
                </ul>
            </div>
        );
    }
});
