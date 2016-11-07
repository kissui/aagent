'use strict';

import React from 'react';
import SelectBar from '../../components/box/selectBar';
import ViewNav from '../../components/box/navHeader';
import EverydayPage from './everyday';
import NewUserPage from './newuser';
import JSON from '../../components/json/conf_json';

var data = [
	{
		"arppu": "20.34247",
		"dateid": "20161103",
		"pay_rate": "0.0157",
		"cnt_login": 4640,
		"pcu": "390",
		"cash": "1485.0",
		"cnt_new": "712",
		"acu": 215,
		"arpu": 0.32004
	},
	{
		"arppu": "35.58824",
		"dateid": "20161102",
		"pay_rate": "0.0148",
		"cnt_login": 4608,
		"pcu": "360",
		"cash": "2420.0",
		"retention2day": "0.2759",
		"cnt_new": "752",
		"acu": 213,
		"arpu": 0.52517
	},
	{
		"arppu": "51.27778",
		"dateid": "20161101",
		"pay_rate": "0.0162",
		"cnt_login": 4446,
		"pcu": "372",
		"cash": "3692.0",
		"retention2day": "0.3102",
		"cnt_new": "577",
		"acu": 210,
		"arpu": 0.83041
	},
	{
		"arppu": "35.81333",
		"dateid": "20161031",
		"pay_rate": "0.0165",
		"cnt_login": 4534,
		"pcu": "377",
		"cash": "2686.0",
		"retention2day": "0.3213",
		"cnt_new": "623",
		"acu": 219,
		"arpu": 0.59241
	},
	{
		"arppu": "35.08642",
		"dateid": "20161030",
		"pay_rate": "0.0171",
		"cnt_login": 4726,
		"pcu": "406",
		"cash": "2842.0",
		"retention2day": "0.2620",
		"cnt_new": "675",
		"acu": 243,
		"arpu": 0.60135
	},
	{
		"arppu": "36.07576",
		"dateid": "20161029",
		"pay_rate": "0.0139",
		"cnt_login": 4745,
		"pcu": "372",
		"cash": "2381.0",
		"retention2day": "0.3370",
		"cnt_new": "655",
		"acu": 226,
		"arpu": 0.50179
	},
	{
		"arppu": "39.11290",
		"dateid": "20161028",
		"pay_rate": "0.0133",
		"cnt_login": 4645,
		"pcu": "393",
		"cash": "2425.0",
		"retention2day": "0.3000",
		"cnt_new": "612",
		"acu": 219,
		"arpu": 0.52207
	}
];
module.exports = React.createClass({
	componentDidMount: function () {
	//
	},
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
								onSelectBarData={JSON.selectBarData}
								onReceiveValue={this.handleReceiveSelectCycle}
								onDefaultValue={'day'}
							/>
						</div>
						<div className="selectDevice">
							<SelectBar
								onSelectBarData={JSON.selectBarDevice}
								onReceiveValue={this.handleReceiveSelectDevice}
								onDefaultValue={'all'}
							/>
						</div>
					</div>
					{/*<DateWeekPage cycle="week"/>*/}
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
					<EverydayPage onDefaultEveryday={data}/>
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
					<NewUserPage onData={data}/>
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
