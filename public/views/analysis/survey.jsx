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
			showBoxType: 'graphic',
			isLoading: true,
			device: onMenu,
			gameConf: onGameConf
		}
	},
	componentDidMount: function () {
		this.handleDealSurreyData();
	},
	componentWillReceiveProps: function (nextProps) {
		const {device, gameConf} = this.state;
		if (nextProps.onMenu != device || gameConf.gameId != nextProps.onGameConf.gameId) {
			this.setState({
				device: nextProps.onMenu,
				gameConf: nextProps.onGameConf
			})
		}
	},
	handleDealSurreyData: function () {
		let dimensionText = '账号';
		const {device, gameConf, dateRange} = this.state;
		let data = {
			"cycle": 'days',
			"device": device,
			"user_dimension": 'role',
			"appid": gameConf.gameId,
			"kpi_conf": {
				"start": dateRange.dateStart,
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
						'name': '充值收入 '
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
					this.setState({
						heads: res.theads,
						bodys: res.table,
						isLoading: false,
						selectTableItems: [1, 2],
						selectChartTrackItems: res.theads.slice(1, 3)
					});
					let response = Chart.dealChartData(res.theads, res.table);
					Chart.handleShowAnalysisChart('analysisHead', response, res.theads.slice(1, 3), ['日期'], 'reload');
				}
			})
	},
	handleChangeChart: function (index, isShowRoll) {
		const {bodys, heads}= this.state;
		this.setState({
			defaultSelect: index,
			isShowRoleBox: isShowRoll,
			selectTableItems: [(index + 1) * 2 - 1, (index + 1) * 2],
			selectChartTrackItems: heads.slice((index + 1) * 2 - 1, (index + 1) * 2 + 1)
		});
		let response = Chart.dealChartData(heads, bodys);
		Chart.handleShowAnalysisChart('analysisHead', response, heads.slice((index + 1) * 2 - 1, (index + 1) * 2 + 1), ['日期'], 'reload');
	},
	handleReceiveRoll: function (value) {
		const {bodys, heads, selectChartTrackItems}= this.state;
		let response = Chart.dealChartData(heads, bodys);
		Chart.handleShowAnalysisChart('analysisHead', response, selectChartTrackItems, ['日期'], 'reload');
		this.setState({
			dimension: value
		})
	},
	handleChangeGraphicOrTable: function (value) {
		const {heads, bodys, selectChartTrackItems} = this.state;
		this.setState({
			showBoxType: value
		});
		if (value === 'graphic') {
			let response = Chart.dealChartData(heads, bodys);
			Chart.handleShowAnalysisChart('analysisHead', response, selectChartTrackItems, ['日期'], 'reload');
		} else {
			let chartDOM = document.getElementById('analysisHead');
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
		} else {
			content = '暂无数据'
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
				</div>

			</div>

		)
	}
});