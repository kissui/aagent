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
				{
					'meta_id': '2914',
					'name': '首次付费角色数 '
				}
			]
		},
		{
			title: '付费率',
			key: 'cash_percent',
			role: 'true',
			data: [
				{
					'meta_id': '2874',
					'name': '角色付费率 ',
					'num_type': 'percent'
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
			role: 'true',
			data: [
				{
					'meta_id': '2816',
					'name': '角色ARPU',
					'num_type': 'fixed_2'
				},
				{
					'meta_id': '2875',
					'name': '角色ARPPU',
					'num_type': 'fixed_2'
				},
			]
		},
		{
			title: 'VIP等级分布',
			key: 'vip',
			dimensionName: 'VIP等级',
			data: [
				{
					'meta_id': '2916',
					'name': '收入'
				},
				{
					'meta_id': '2917',
					'name': 'VIP人数'
				},
			]
		},
		{
			title: '充值额度分布',
			key: 'cash_limit',
			dimensionName: '充值项目',
			data: [
				{
					'meta_id': '2918',
					'name': '现金'
				},
				{
					'meta_id': '2919',
					'name': '角色数'
				},
				{
					'meta_id': '2920',
					'name': '元宝'
				},
				{
					'meta_id': '2921',
					'name': '充值次数'
				},
			]
		},
		{
			title: '单位时间价格',
			key: 'price_date',
			data: [
				{
					'meta_id': '2922',
					'name': '单位时间（价格/小时）'
				},
				{
					'meta_id': '2923',
					'name': '7日平均'
				},
				{
					'meta_id': '2924',
					'name': '30日平均'
				},
			]
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
			dimension: 'role',
			isLoading: true
		}
	},
	handleInitAnalysisData: function (receiveParams) {
		const {isLoading} = this.state;
		if (!isLoading)
			this.setState({
				isLoading: true
			});
		let index = receiveParams.key ? _.findIndex(tabList.subList, item=> {
			return item.key == receiveParams.key
		}) : 0;
		let kpis = tabList.subList[index].data;
		let dimensionName = _.get(tabList.subList[index], 'dimensionName');
		let role = _.get(tabList.subList[index], 'role');
		let data = {
			"cycle": 'days',
			"device": receiveParams.device,
			"appid": receiveParams.gameId,
			"kpi_conf": {
				"everyday": {
					"start": receiveParams.dateStart,
					"end": receiveParams.dateEnd,
					"kpis": kpis
				},

			}
		};
		if (role) {
			this.setState({
				isShowRoleBox: true,
			})
		} else {
			this.setState({
				isShowRoleBox: false,
			})
		}
		if (dimensionName) {
			data = _.extend(data, {dimension: 'multi'}, {dimensionName: dimensionName});
		} else {
			data = _.extend(data, {weidu: receiveParams.dimension});
		}
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
		const {dateRange, gameConf, device, dimension} = this.state;
		let params = _.extend({}, dateRange, gameConf, {device: device}, {dimension: dimension});
		this.handleInitAnalysisData(params)
	},
	componentWillReceiveProps: function (nextProps) {
		if (nextProps.onMenu && nextProps.onGameConf) {
			const {dateRange, gameConf, device, dimension} = this.state;
			let params;
			if (gameConf.gameId != nextProps.onGameConf.gameId) {
				params = _.extend({}, dateRange, nextProps.onGameConf, {device: device}, {dimension: dimension});
			} else {
				params = _.extend({}, dateRange, gameConf, {device: nextProps.onMenu}, {dimension: dimension});
			}
			this.handleInitAnalysisData(params);
		}
	},
	handleReceiveKey: function (key) {
		const {dateRange, gameConf, device, dimension} = this.state;
		let params = _.extend({}, dateRange, gameConf, {device: device}, {key: key}, {dimension: dimension});
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
		const {gameConf, device, key, dimension} = this.state;
		let params = _.extend({}, dateRange, gameConf, {device: device}, {key: key}, {dimension: dimension});
		this.handleInitAnalysisData(params);
		this.setState({
			dateRange: dateRange
		});
	},
	handleReceiveRoll: function (value) {
		const {gameConf, dateRange, device, key}= this.state;
		let params = _.extend({}, dateRange, gameConf, {device: device}, {key: key}, {dimension: value});
		this.handleInitAnalysisData(params);
		this.setState({
			dimension: value
		})
	},
	render: function () {
		const {dateRange, heads, bodys, isLoading,isShowRoleBox} = this.state;
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
					{isShowRoleBox &&<SelectRollPage
						onReceiveRollValue={this.handleReceiveRoll}
						onStyle={{
							position: 'relative',
							right: 0
						}}
					/>}
				</div>
				<div className="analysis-show-box">
					{content}
				</div>
			</div>
		)
	}
});