'use strict';

import React from 'react';
import _ from 'lodash';
import http from '../../lib/http';
import moment from 'moment';
import Chart from '../../components/chart';
import TablePage from '../layout/table';
import SurveyHead from './surveyHead';
import SelectRollPage from '../../components/box/selectRoll'; //选择角色
import SelectBarGraphicOrTable from '../../components/box/selectBar'; //选择图表或者表格
import LoadingPage from '../../components/is_loading';

const selectBarData = [
	{
		title: '图',
		value: 'graphic'
	},
	{
		title: '表',
		value: 'table'
	}
];
module.exports = React.createClass({
	getInitialState: function () {
		let defaultRange = 3600 * 24 * 13 * 1000;
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
			defaultSelect: 0,
			isShowRoleBox: true,
			selectTableItems: [1, 2],
			showBoxType: 'graphic',
			isLoading: true,
			user_dimension: 'account',
			device: onMenu,
			gameConf: onGameConf,
			selectChartTrackItems: null
		}
	},
	componentDidMount: function () {
		const {device, gameConf, user_dimension} = this.state;
		this.handleDealSurreyData(device, gameConf, user_dimension);
	},
	componentWillReceiveProps: function (nextProps) {
		const {device, gameConf, user_dimension} = this.state;
		console.log(nextProps.onGameConf,gameConf,1)
		if (nextProps.onMenu != device || gameConf.gameId != nextProps.onGameConf.gameId) {
			console.log(2)
			this.setState({
				device: nextProps.onMenu,
				gameConf: nextProps.onGameConf,

			});
			this.handleDealSurreyData(nextProps.onMenu, nextProps.onGameConf, user_dimension);
		}
	},
	handleDealDimensionText: function (dimension) {
		let dimensionText = '账号';
		switch (dimension) {
			case 'account':
				dimensionText = '账号';
				break;
			case 'role':
				dimensionText = '角色';
				break;
			case 'device':
				dimensionText = '设备';
				break;
			default:
				dimensionText = '用户';
				break;
		}
		return dimensionText
	},
	handleDealSurreyData: function (device, gameConf, user_dimension) {
		const {dateRange, selectChartTrackItems} = this.state;
		let dimensionText = this.handleDealDimensionText(user_dimension);
		let index = _.findIndex(gameConf.gameList, (item)=> {
			return item.value == gameConf.gameId
		});
		let startDate = _.get(gameConf.gameList[index], 'online_time');
		let data = {
			"cycle": 'days',
			"device": device,
			"user_dimension": user_dimension,
			"appid": gameConf.gameId,
			"kpi_conf": {
				"start": startDate,
				"end": dateRange.dateEnd,
				"kpis": [
					{
						'meta_id': '2817',
						'name': '登录' + dimensionText
					},
					{
						'meta_id': '2816',
						'name': '新增' + dimensionText
					},
					{
						'meta_id': '2819',
						'name': '充值收入 ',
						'self_weidu': 'ALL'
					},
					{
						'meta_id': '2818',
						'name': '付费' + dimensionText
					},
					{
						'meta_id': '2816',
						'name': '新增' + dimensionText
					},
					{
						'meta_id': '2833',
						'name': '新增' + dimensionText + '次留',
						'num_type': 'percent'
					},
					{
						'meta_id': '2844',
						'name': 'ACU',
						'self_weidu': 'acu'
					},
					{
						'meta_id': '2844',
						'name': 'PCU',
						'self_weidu': 'pcu'
					}
				]
			}
		};
		http.get('/dudai/?c=analysis.report&ac=get&token=mgame_afs23cgs23', {params: data})
			.then(data=>data.data)
			.then((data)=> {
				if (data.error_code === 0) {
					let res = data.data;
					let chartItems = selectChartTrackItems ? selectChartTrackItems : res.theads.slice(1, 3);
					this.setState({
						heads: res.theads,
						bodys: res.table,
						isLoading: false,
						selectChartTrackItems: chartItems
					});
					let response = Chart.dealChartData(res.theads, res.table, true);
					Chart.handleShowAnalysisLine('analysisHead', response, chartItems, res.theads.slice(0, 1), 'link');
				}
			})
	},
	handleChangeChart: function (index, isShowRoll) {
		let chartRange = document.getElementById('range');
		if (chartRange && chartRange.innerHTML)
			chartRange.innerHTML = null;
		const {bodys, heads}= this.state;
		this.setState({
			defaultSelect: index,
			isShowRoleBox: isShowRoll,
			user_dimension: 'All',
			selectTableItems: [(index + 1) * 2 - 1, (index + 1) * 2],
			selectChartTrackItems: heads.slice((index + 1) * 2 - 1, (index + 1) * 2 + 1)
		});
		let response = Chart.dealChartData(heads, bodys, true);
		Chart.handleShowAnalysisLine('analysisHead', response, heads.slice((index + 1) * 2 - 1, (index + 1) * 2 + 1), heads.slice(0,1), 'link');
	},
	handleReceiveRoll: function (value) {
		const {device, gameConf} = this.state;
		this.handleDealSurreyData(device, gameConf, value);
		this.setState({
			user_dimension: value
		})
	},
	handleChangeGraphicOrTable: function (value) {
		const {heads, bodys, selectChartTrackItems} = this.state;
		this.setState({
			showBoxType: value
		});
		if (value === 'graphic') {
			let response = Chart.dealChartData(heads, bodys, true);
			Chart.handleShowAnalysisLine('analysisHead', response, selectChartTrackItems, heads.slice(0,1), 'link');
		} else {
			let chartDOM = document.getElementById('analysisHead');
			let chartRange = document.getElementById('range');
			if (chartRange && chartRange.innerHTML)
				chartRange.innerHTML = null;
			if (chartDOM && chartDOM.innerHTML)
				chartDOM.innerHTML = null;
		}
	},
	render: function () {
		const {isShowRoleBox, selectTableItems, showBoxType, heads, bodys, device, gameConf, dateRange, isLoading} = this.state;
		let content = <LoadingPage/>;
		if (!isLoading) {
			if (showBoxType != 'graphic') {
				content = heads && <TablePage heads={heads} bodys={bodys} onActive={selectTableItems}/>;
			} else {
				content = null;
			}
		}
		return (
			<div>
				<h2 className="analysis-tit">
					<i className="fa fa-bar-chart"></i>
					概览
				</h2>
				<SurveyHead
					onDevice={device}
					onGameConf={gameConf}
					onDateRange={dateRange}
					onReceiveSelectIndex={this.handleChangeChart}
				/>
				<div className="analysis-second-bar">
					{bodys && bodys.length > 0 && <SelectBarGraphicOrTable
						onSelectBarStyle={{float: 'right', width: '122px', marginLeft: '10px'}}
						onDefaultValue="graphic"
						onReceiveValue={this.handleChangeGraphicOrTable}
						onSelectBarData={selectBarData}
					/>}
					{isShowRoleBox && <SelectRollPage
						onReceiveRollValue={this.handleReceiveRoll}
						onStyle={{
							float: 'right',
							position: 'relative',
							right: 0
						}}
					/>}
				</div>
				<div className="content">
					{content}
					<div id='analysisHead' style={{textAlign: 'center'}}></div>
					<div id="range"></div>
				</div>

			</div>

		)
	}
});