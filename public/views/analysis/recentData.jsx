'use strict';

import React from 'react';
import TabbedPage from '../../components/tabbed/tabbed';
import DatePickerPage from '../../components/datePage';
import http from '../../lib/http';
import Chart from '../../components/chart';
import moment from 'moment';
const tabList = {
	title: '付费情况',
	subList: [
		{
			title: '充值收入',
			key: 'count',
			data: [
				{
					'meta_id': '2819',
					'name': '充值收入 '
				}
			]
		},
		{
			title: '付费角色',
			key: 'cash',
			data: [
				{
					'meta_id': '2818',
					'name': '付费角色 '
				},
				// {
				// 	'meta_id': '2818',
				// 	'name': '付费角色 '
				// }
			]
		},
		{
			title: '付费率',
			key: 'cash_percent',
			data: [
				{
					'meta_id': '2874',
					'name': '角色付费率 '
				},
				{
					'meta_id': '2816',
					'name': '登录角色'
				},
			]
		},
		{
			title: 'ARRPU',
			key: 'arrpu',
			data: [
				// {
				// 	'meta_id': '2816',
				// 	'name': '角色ARPU'
				// },
				{
					'meta_id': '2875',
					'name': '角色ARPPU',
					'num_type': 'fixed_2'
				},
			]
		},
		{
			title: 'VIP等级分布',
			key: 'vip'
		}
	]
};
module.exports = React.createClass({
	getInitialState: function () {
		let defaultRange = 3600 * 24 * 6 * 1000;
		let oneDay = 3600 * 24 * 1000;
		let endRange = +new Date() - oneDay;
		let startRange = endRange - defaultRange;
		let format = 'YYYY-MM-DD';
		const {onGameConf,onMenu} = this.props;
		return {
			dateRange: {
				dateStart: moment(new Date(startRange)).format(format).toString(),
				dateEnd: moment(new Date(endRange)).format(format).toString()
			},
			gameConf: onGameConf,
			device: onMenu
		}
	},
	componentDidMount: function () {
		const {dateRange,gameConf,device} = this.state;
		let data = {
			"cycle": 'days',
			"device": device,
			"weidu": 'role',
			"appid": gameConf.gameId,
			"kpi_conf": {
				"everyday": {
					"start": dateRange.dateStart,
					"end": dateRange.dateEnd,
					"kpis": [
						{
							'meta_id': '2819',
							'name': '充值收入 '
						}
					]
				},

			}
		};
		http.get('/dudai/?c=analysis.report&ac=get&token=mgame_afs23cgs23', {params: data})
			.then(data=>data.data)
			.then((data)=> {
				if (data.error_code === 0) {
					let res = data.data.everyday;
					this.setState({
						heads: res.theads,
						bodys: res.table,
						isLoading: false
					});
					let response = Chart.dealChartData(res.theads, res.table);
					console.log(response,'response');
				}
			})
	},
	handleReceiveKey: function (key) {
		console.log(key)
	},
	handleReceiveDateRange: function (start, end) {
		const format = 'YYYY-MM-DD';
		this.setState({
			dateRange: {
				start: start.format(format).toString(),
				end: end.format(format).toString()
			}
		});
	},
	render: function () {
		const {dateRange} = this.state;
		return (
			<div>
				<h2 className="analysis-tit">
					<i className="fa fa-bar-chart"></i>
					近期数据
				</h2>
				<div className="analysis-header">
					<TabbedPage tabList={tabList} onReceiveKey={this.handleReceiveKey}/>
					<div className="analysis-date">
						<DatePickerPage
							onReceiveData={this.handleReceiveDateRange}
							isShowRange={false}
							onDefaultDateRange={dateRange}
							singleStyle={{
								width: '90px'
							}}
							dateInputStyle={{
								width: '230px'
							}}
						/>
					</div>
				</div>
				<div className="analysis-show-box">

				</div>
			</div>
		)
	}
});