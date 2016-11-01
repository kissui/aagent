'use strict';

import React from 'react';

/*
[
  {
    dealer_name: "【我是土豪 (有会话进入)】梅长苏 登录",
    url:"http://localhost:3000/autoLogin?partner=123456&user_id=563df436c5bcc&mobile=18914066032&channel=1a2b3c&timestamp=1462356378&sign=7154f8ab76dadf032302dac13946c2b2581528e7616ce1b4b4d6b4595d45f29b"
  }
]
*/
export default React.createClass({
    render: function() {
        let bill = this.props.bill;
        return (
            <li key={bill.I_BILL_DETAIL_ID}>
                <a href={bill.url}>{bill.dealer_name}</a>
            </li>
        );
    }
});
