 'use strict';

import React from 'react';

module.exports = React.createClass({

	render: function render() {
		return (
			<div className="default-box">
				<div className="logo">
					<img src="/img/logo.png" alt="独代"/>
				</div>
				<div className="authorized">
					<div className="head">
						对不起你当前无权限访问该网址！如想继续，请联系管理员
					</div>
					<div className="row">
						<div className="col-md-4 text-right">管理员:</div>
						<div className="col-md-8">陈奥</div>
					</div>
					<div className="row">
						<div className="col-md-4 text-right">HI:</div>
						<div className="col-md-8">chenao0223</div>
					</div>
					<div className="row">
						<div className="col-md-4 text-right">eMail:</div>
						<div className="col-md-8">chenao@baidu-mgame.com</div>
					</div>
				</div>
			</div>

		)
	}

});
