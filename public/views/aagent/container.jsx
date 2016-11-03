'use strict';

import React from 'react';
import SelectBar from '../../components/box/selectBar';
import ViewNav from '../../components/box/navHeader';
let selectBarData = [
	{
		title: '日报',
		value: 'day',
		type: 'text'
	},
	{
		title: '周报',
		value: 'week',
		type: 'text'
	},
	{
		title: '月报',
		value: 'month',
		type: 'text'
	}

];
let selectBarDevice = [
	{
		title: '全部',
		value: 'all',
		type: 'text'
	},
	{
		title: 'fa fa-apple',
		value: 'apple',
		type: 'class'
	},
	{
		title: 'fa fa-android',
		value: 'android',
		type: 'class'
	}

];
module.exports = React.createClass({
	handleReceiveSelectCycle: function (value) {
		console.log('@defaultSelectCycle', value);
	},
	handleReceiveSelectDevice: function (value) {
		console.log('@defaultSelectDevice:', value)
	},
	handleGetDateRange: function (start, end, title) {
		console.log(start, end, title)
	},
	render: function () {
		return (
			<div className="bd-container">
				<div className="box-view">
					<div className="view-option">
						<div className="selectCycle">
							<SelectBar
								onSelectBarData={selectBarData}
								onReceiveValue={this.handleReceiveSelectCycle}
								onDefaultValue={'day'}
							/>
						</div>
						<div className="selectDevice">
							<SelectBar
								onSelectBarData={selectBarDevice}
								onReceiveValue={this.handleReceiveSelectDevice}
								onDefaultValue={'all'}
							/>
						</div>
					</div>

				</div>
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
				</div>
				<div className="box-view">
					<ViewNav
						defaultText="每日概览"
						onReceiveDateRange={this.handleGetDateRange}
						isShowDateRange={true}
						onDateRange={{
							start: '',
							end: ''
						}}
					/>
				</div>
				<div className="box-view">
					<ViewNav
						defaultText="新用户质量"
						onReceiveDateRange={this.handleGetDateRange}
						onDateRange={{
							start: '',
							end: ''
						}}
					/>
				</div>
			</div>
		)
	}
});


/**
 * @todo 运营报表日报
 */
function getNumOfWeeks(year) {
	var d = new Date(year, 0, 1);
	var yt = ( ( year % 4 == 0 && year % 100 != 0) || year % 400 == 0) ? 366 : 365;
	return Math.ceil((yt - d.getDay()) / 7.0);
}
