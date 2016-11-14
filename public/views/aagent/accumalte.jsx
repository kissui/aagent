'use strict';
import React from 'react';
import ViewNav from '../../components/box/navHeader';
module.exports = React.createClass({
	handleGetDateRange: function (start, end, title) {
		console.log(start, end, title)
	},
	render: function () {
		return (
			<div className="box-view">
				<ViewNav
					defaultText="累计数据"
					onReceiveDateRange={this.handleGetDateRange}
					isShowDateRange={true}
					onDateRange={{
						start: '',
						end: ''
					}}
				/>
				<div className="accumulate-box row">
					<div className="col blank-view">
						<p className="title">新增账号数</p>
						<p className="number">1234,221</p>
					</div>
					<div className="col blank-view">
						<p className="title">付费金额</p>
						<p className="number">1234,221</p>
					</div>
				</div>
			</div>
		)
	}
});