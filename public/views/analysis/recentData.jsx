'use strict';

import React from 'react';
import TabbedPage from '../../components/tabbed/tabbed';
import DatePickerPage from '../../components/datePage';
import http from '../../lib/http';
import Chart from '../../components/chart';
import moment from 'moment';
import TablePage from '../layout/table'; // table
import LoadingPage from '../../components/is_loading';
import SelectRollPage from '../../components/box/selectRoll'; //选择角色
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
		const {onGameConf, onMenu} = this.props;
		return {
			dateRange: {
				dateStart: moment(new Date(startRange)).format(format).toString(),
				dateEnd: moment(new Date(endRange)).format(format).toString()
			},
			gameConf: onGameConf,
			device: onMenu,
			isLoading: true
		}
	},
	handleInitAnalysisData: function (receiveParams) {
		const {isLoading} = this.state;
		if (!isLoading)
			this.setState({
				isLoading: true
			});

		let kpis = receiveParams.key ? tabList.subList[_.findIndex(tabList.subList, item=> {
			return item.key == receiveParams.key
		})].data : tabList.subList[0].data;
		let data = {
			"cycle": 'days',
			"device": receiveParams.device,
			"weidu": 'role',
			"dimension": "multi", // role ? null : 'multi'
			"appid": receiveParams.gameId,
			"kpi_conf": {
				"everyday": {
					"start": receiveParams.dateStart,
					"end": receiveParams.dateEnd,
					"kpis": kpis
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
					console.log(response, 'response');
				}
			})
	},
	componentDidMount: function () {
		const {dateRange, gameConf, device} = this.state;
		let params = _.extend({}, dateRange, gameConf, {device: device});
		this.handleInitAnalysisData(params)
	},
	componentWillReceiveProps: function (nextProps) {
		if (nextProps.onMenu && nextProps.onGameConf) {
			const {dateRange, gameConf, device} = this.state;
			let params;
			if (gameConf.gameId != nextProps.onGameConf.gameId) {
				params = _.extend({}, dateRange, nextProps.onGameConf, {device: device});
			} else {
				params = _.extend({}, dateRange, gameConf, {device: nextProps.onMenu});
			}
			this.handleInitAnalysisData(params);
		}
	},
	handleReceiveKey: function (key) {
		const {dateRange, gameConf, device} = this.state;
		let params = _.extend({}, dateRange, gameConf, {device: device}, {key: key});
		this.handleInitAnalysisData(params);
		this.setState({
			key: key
		})
	},
	handleReceiveDateRange: function (start, end) {
		const format = 'YYYY-MM-DD';
		let dateRange = {
			dateStart: start.format(format).toString(),
			dateEnd: end.format(format).toString()
		};
		const {gameConf, device, key} = this.state;
		let params = _.extend({}, dateRange, gameConf, {device: device}, {key: key});
		this.handleInitAnalysisData(params);
		this.setState({
			dateRange: dateRange
		});
	},
	handleReceiveRoll: function (value) {

	},
	render: function () {
		const {dateRange, heads, bodys, isLoading} = this.state;
		let content = <LoadingPage/>;
		if (!isLoading)
			content = heads && <TablePage heads={heads} bodys={bodys} onActive={[]}/>
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
				<div className="analysis-second-bar">
					<SelectRollPage
						onReceiveRollValue={this.handleReceiveRoll}
						onStyle={{
							position: 'relative',
							right: 0
						}}
					/>
				</div>
				<div className="analysis-show-box">
					{content}
				</div>
			</div>
		)
	}
});