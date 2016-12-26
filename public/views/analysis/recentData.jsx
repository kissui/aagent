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
import SelectBarGraphicOrTable from '../../components/box/selectBar'; //选择图表或者表格
import CalendarPage from '../../components/calenderPage'; //时间插件，单天
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
			gameConf: onGameConf,
			device: onMenu,
			dimension: 'role',
			isLoading: true,
			showBoxType: 'graphic',
			showDatePickerType: 'range'
		}
	},
	handleInitAnalysisData: function (receiveParams, isShowChart) {
		const {showBoxType} = this.state;
		const {chartId, tabData} = this.props;
		this.setState({
			isLoading: true
		});
		let _this = this;
		let index = receiveParams.key ? _.findIndex(tabData.subList, item=> {
			return item.key == receiveParams.key
		}) : 0;
		let kpis = tabData.subList[index].data;
		let dimensionName = _.get(tabData.subList[index], 'dimensionName');
		let stocks = _.get(tabData.subList[index], 'stockItem');
		let lineItems = _.get(tabData.subList[index], 'lineItem');
		let role = _.get(tabData.subList[index], 'role');
		let doubleYLine = _.get(tabData.subList[index], 'chartShow');
		if (role) {
			this.setState({
				isShowRoleBox: true,
			})
		} else {
			this.setState({
				isShowRoleBox: false,
			})
		}
		let data = {
			"cycle": 'days',
			"device": receiveParams.device,
			"appid": receiveParams.gameId,
			"kpi_conf": {
				'dimension_name': dimensionName,
				"start": receiveParams.dateStart,
				"end": receiveParams.dateEnd,
				"kpis": kpis
			}
		};
		if (dimensionName) {
			this.setState({
				showDatePickerType: false
			});
			data.kpi_conf.start = receiveParams.dateEnd;
			data = _.extend(data, {data_dimension: 'multi'});
		} else {
			this.setState({
				showDatePickerType: 'range'
			});
			data = _.extend(data, {user_dimension: receiveParams.user_dimension});
		}
		http.get('/dudai/?c=analysis.report&ac=get&token=mgame_afs23cgs23', {params: data})
			.then(data=>data.data)
			.then((data)=> {
				if (data.error_code === 0) {
					let res = data.data;
					_this.setState({
						heads: res.theads,
						bodys: res.table,
						stocks: stocks ? stocks : null,
						lineItems: lineItems ? lineItems : null,
						doubleYLine: doubleYLine,
						isLoading: false
					});
					let response = Chart.dealChartData(res.theads, res.table);
					if (isShowChart) return;
					if (res.table && res.table.length > 0) {
						let dimensionsLine = res.theads.slice(0, 1);
						if (lineItems && lineItems.length > 0) {
							dimensionsLine = _.concat(dimensionsLine, lineItems)
						}
						if (showBoxType == 'graphic') {
							Chart.handleShowAnalysisChart(chartId, response, stocks, dimensionsLine, doubleYLine);
						}

					} else {
						document.getElementById(chartId).innerHTML = '暂无数据';
					}

				}
			})
	},
	componentDidMount: function () {
		const {dateRange, gameConf, device, dimension} = this.state;
		let params = _.extend({}, dateRange, gameConf, {device: device}, {user_dimension: dimension});
		this.handleInitAnalysisData(params)
	},
	componentWillReceiveProps: function (nextProps) {
		if (nextProps.onMenu && nextProps.onGameConf) {
			const {dateRange, gameConf, device, dimension} = this.state;
			let params;
			if (gameConf.gameId != nextProps.onGameConf.gameId) {
				params = _.extend({}, dateRange, nextProps.onGameConf, {device: device}, {user_dimension: dimension});
				this.setState({
					gameConf: nextProps.onGameConf,
					showBoxType: 'graphic',
				});
			} else {
				this.setState({
					device: nextProps.onMenu,
					showBoxType: 'graphic',
				});
				params = _.extend({}, dateRange, gameConf, {device: nextProps.onMenu}, {user_dimension: dimension});
			}
			this.handleInitAnalysisData(params);
		}
	},
	handleReceiveKey: function (key) {
		const {dateRange, gameConf, device, dimension, showBoxType} = this.state;
		let params = _.extend({}, dateRange, gameConf, {device: device}, {key: key}, {user_dimension: dimension});
		this.handleInitAnalysisData(params, showBoxType != 'graphic' && 'notShowChart');
		this.setState({
			key: key
		})
	},
	handleReceiveDateRange: function (start, end, type) {

		const format = 'YYYY-MM-DD';
		let dateRangeChange = {
			dateStart: start.format(format).toString(),
			dateEnd: end.format(format).toString()
		};
		console.log(start, end, type, dateRangeChange);
		const {gameConf, device, key, dimension} = this.state;
		let params = _.extend({}, dateRangeChange, gameConf, {device: device}, {key: key}, {user_dimension: dimension});
		this.handleInitAnalysisData(params);
		this.setState({
			dateRange: dateRangeChange
		});
	},
	handleReceiveRoll: function (value) {
		const {gameConf, dateRange, device, key}= this.state;
		let params = _.extend({}, dateRange, gameConf, {device: device}, {key: key}, {user_dimension: value});
		this.handleInitAnalysisData(params);
		this.setState({
			dimension: value
		})
	},
	handleChangeGraphicOrTable: function (value) {
		const {heads, bodys, lineItems, stocks,doubleYLine} = this.state;
		const {chartId, tabData} = this.props;
		this.setState({
			showBoxType: value
		});
		if (value === 'graphic') {
			let dimensionsLine = heads.slice(0, 1);
			if (lineItems) {
				dimensionsLine = _.concat(dimensionsLine, lineItems)
			}
			let response = Chart.dealChartData(heads, bodys);

			Chart.handleShowAnalysisChart(chartId, response, stocks, dimensionsLine,doubleYLine);
		} else {
			let chartDOM = document.getElementById(chartId);
			if (chartDOM && chartDOM.innerHTML)
				chartDOM.innerHTML = null;
		}
	},
	render: function () {
		const {dateRange, heads, bodys, isLoading, isShowRoleBox, showBoxType, showDatePickerType, gameConf} = this.state;
		const {chartId, tabData} = this.props;
		let content = <LoadingPage/>;
		if (!isLoading) {
			if (showBoxType != 'graphic') {
				content = heads && <TablePage heads={heads} bodys={bodys} onActive={[]}/>;
			} else {
				content = null;
			}
		}
		return (
			<div>
				<div className="analysis-header">
					<TabbedPage tabList={tabData} onGameConf={gameConf} onReceiveKey={this.handleReceiveKey}/>
					<div className="analysis-date">
						{showDatePickerType ? <DatePickerPage
							onReceiveData={this.handleReceiveDateRange}
							isShowRange={false}
							onDefaultDateRange={dateRange}
							singleStyle={{
								width: '90px'
							}}
							dateInputStyle={{
								width: '230px'
							}}
						/> :
							<CalendarPage
								onReceiveData={this.handleReceiveDateRange}
								onDefaultDateRange={dateRange}
							/>}
					</div>
				</div>
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
					<div id={chartId} style={{textAlign: 'center'}}></div>
				</div>
			</div>
		)
	}
});