'use strict';

import React from 'react';

import IsLoading from '../../components/is_loading.jsx';//正在加载
import BillRow from './row.jsx';
import http from '../../lib/http';

const billsPageSize = 20;

module.exports = React.createClass({

    getInitialState: function() {
        return {
            bills: null
        };
    },

    componentDidMount: function() {

        let self = this;


        http.get('/tools/autoLogin')
        .then(r => {

            console.log(r.data);

            // 增加 bills 起始
            let length = r.data.length;
            let bills = r.data;

            self.setState({
                bills: bills,
            })
          })
          .catch(e => console.error(e));

    },


    render: function render() {

        let bills = this.state.bills;
        let billsDisplay = '';

        if (bills === null) {
            billsDisplay = <IsLoading/>;
        }
        else {
            billsDisplay = bills.map(function(bill) {
                return (
                    <BillRow bill={bill}></BillRow>
                );
            });
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
