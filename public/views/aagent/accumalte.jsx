'use strict';
import React from 'react';
import ViewNav from '../../components/box/navHeader';
import moment from 'moment';
module.exports = React.createClass({
	getInitialState: function () {
		let defaultRange = 3600 * 24 * 7 * 1000;
		let endRange = +new Date();
		let startRange = endRange - defaultRange;
		let format = 'YYYY-MM-DD';
		return {
			dateRange: {
				dateStart: moment(new Date(startRange)).format(format).toString(),
				dateEnd: moment(new Date()).format(format).toString()
			}
		}
	},
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
					onDateRange={this.state.dateRange}
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