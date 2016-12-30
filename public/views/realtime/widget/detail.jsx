'use strict';
import React from 'react';
import CalenderModule from '../../../components/calenderPage';
import ToolTipModule from '../../../components/tooltip';
import SelectRolePage from '../../../components/box/selectRoll';
import ChartTypeToogleModule from '../../../components/box/selectBar';
import LoadingPage from '../../../components/is_loading';
import Conf from '../realtimeConf';
import moment from 'moment';
import http from '../../../lib/http';
import Chart from '../../../components/chart'
export default class DetailPage extends React.Component {
	constructor(props, context) {
		super(props, context);
		const {onGameConf, onDevice, onNavDataLists} = this.props;
		let format = 'YYYY-MM-DD';
		let today = moment(new Date()).format(format);
		let yes = moment(new Date(+new Date() - 3600 * 24 * 1000)).format(format);
		let lastToday = moment(new Date(+new Date() - 3600 * 24 * 7 * 1000)).format(format);
		let initDate = {
			'今天': today,
			'昨天': yes,
			['上周(' + lastToday.slice(5) + ")"]: lastToday
		};
		let names = ['今天', '昨天', '上周(' + lastToday.slice(5) + ")"];
		let dates = [today, yes, lastToday];
		this.handleDetailData.bind(this);
		this.handleVerifyDateIsSave.bind(this);
		this.state = {
			d_detail: null,
			dSelectNavIndex: 0,
			chartType: 'step',
			role: 'account',
			showRight: 'all',
			isLoading: true,
			device: onDevice,
			meta: onNavDataLists[0].data,
			gameId: onGameConf.gameId,
			defaultDateS: initDate,
			fixedDateS: initDate,
			defaultDateNames: names,
			fixedDateNames: names,
			defaultDateMap: dates,
			fixedDateMap: dates
		}
	}

	handleChangeNavIndex(i, id, showRight) {
		const {onNavDataLists} = this.props;
		const {fixedDateS, fixedDateMap, fixedDateNames} = this.state;
		this.setState({
			dSelectNavIndex: i,
			showRight: showRight,
			meta: onNavDataLists[i].data,
			defaultDateMap: fixedDateMap,
			defaultDateNames: fixedDateNames,
			defaultDateS: fixedDateS
		});
		let params = _.extend(this.state, {meta: onNavDataLists[i].data}, {defaultDateS: fixedDateS},
			{defaultDateNames: fixedDateNames}, {defaultDateMap: fixedDateMap});
		this.handleDetailData(params)
	}

	componentDidMount() {
		let params = this.state;
		this.handleDetailData(params);
	}

	componentWillReceiveProps(nextProps) {
		const {gameId, device} = this.state;
		let params = _.extend(this.state);
		if (nextProps.onGameConf.gameId != gameId) {
			params = _.extend(params, {gameId: nextProps.onGameConf.gameId});
			this.setState({
				gameId: nextProps.onGameConf.gameId
			})
		} else if (nextProps.onDevice != device) {
			params = _.extend(params, {device: nextProps.onDevice});
			this.setState({
				device: nextProps.onDevice
			})
		}
		this.handleDetailData(params);
	}

	handleDetailData(params) {
		let data = {
			"cycle": 'hour',
			"device": params.device,
			"user_dimension": params.role,
			"data_dimension": 'hour_detail',
			'hour_dimension': params.chartType,
			"appid": params.gameId,
			"kpi_conf": {
				'dates': params.defaultDateS,
				"kpis": [params.meta],
			}
		};
		http.get('/dudai/?c=analysis.report&ac=get', {params: data})
			.then(data=>data.data)
			.then((data)=> {
				if (data.error_code === 0) {
					this.setState({
						isLoading: false
					});
					Chart.handleShowRealTimeDetail('realTime', data.data, params.defaultDateNames);
				}
			})
	}

	handleVerifyDateIsSave(date, maps) {
		return maps.indexOf(date);
	}

	handleReceiveDate(start) {
		let format = 'YYYY-MM-DD';
		const {defaultDateMap, defaultDateS, defaultDateNames} = this.state;
		let selectDate = moment(start).format(format);
		if (defaultDateMap.indexOf(selectDate) > 0) return;
		defaultDateS[selectDate.slice(5)] = selectDate;
		this.setState({
			defaultDateS: _.extend(defaultDateS, {[selectDate.slice(5)]: selectDate}),
			defaultDateMap: _.concat(defaultDateMap, [selectDate]),
			defaultDateNames: _.concat(defaultDateNames, [selectDate.slice(5)])
		});
		let params = _.extend(this.state, {defaultDateS: defaultDateS}, {defaultDateNames: _.concat(defaultDateNames, [selectDate.slice(5)])});
		this.handleDetailData(params);
	}

	handleResetDate() {
		const {fixedDateS, fixedDateMap, fixedDateNames} = this.state;
		this.setState({
			defaultDateMap: fixedDateMap,
			defaultDateNames: fixedDateNames,
			defaultDateS: fixedDateS
		});
		let params = _.extend(this.state, {defaultDateS: fixedDateS},
			{defaultDateNames: fixedDateNames}, {defaultDateMap: fixedDateMap});
		this.handleDetailData(params)
	}

	handleReceiveRole(value) {
		let params = _.extend(this.state, {role: value});
		this.setState({
			role: value
		});
		this.handleDetailData(params);
	}

	handleChangeChartShow(value) {
		let params = _.extend(this.state, {chartType: value});
		this.setState({
			chartType: value
		});
		this.handleDetailData(params);
	}

	render() {
		const {onNavDataLists} = this.props;
		const {dSelectNavIndex, showRight, isLoading} = this.state;
		return (
			<div>
				<h2 className="analysis-tit">
					<i className="fa fa-bar-chart" aria-hidden="true"></i>
					数据详情
					<ul className="realTime-detail-nav">
						{onNavDataLists.map((item, i)=> {
							return (
								<li key={i}
									className={dSelectNavIndex == i && 'active'}
									onClick={this.handleChangeNavIndex.bind(this, i, item.data.id, item.showRight)}
								>
									{item.data.title}
								</li>
							)
						})}
					</ul>
				</h2>
				<ToolTipModule onText="横轴说明：如10:00的数据代表10:00到10:59期间的数据。如最新的数值较低，或与数据未齐有关。"/>
				<div className="realTime-detail-option-bar">
					<div className="op-bar-l">
						<span>添加对比日期</span>
						<CalenderModule
							onReceiveData={this.handleReceiveDate.bind(this)}
							onStyle={{
								display: 'inline-block',
								marginLeft: '5px'
							}}
						/>
						<button className="btn btn-primary" onClick={this.handleResetDate.bind(this)}>清空</button>
					</div>
					{showRight != 'no' && <div className="op-bar-r">
						{(showRight == 'role' || showRight == 'all') &&
						<SelectRolePage
							onReceiveRollValue={this.handleReceiveRole.bind(this)}
							onStyle={{
								position: 'relative',
								right: 0,
								display: 'inline-block'
							}}
							rollRange={Conf.realTimeRoleConf}
						/>}
						{(showRight == 'chartType' || showRight == 'all') &&
						<ChartTypeToogleModule
							onSelectBarStyle={{display: 'inline-block', width: '122px', marginLeft: '10px'}}
							onDefaultValue="step"
							onReceiveValue={this.handleChangeChartShow.bind(this)}
							onSelectBarData={Conf.realTimeChartTypeBar}
						/>}
					</div>}
				</div>
				<div id="realTime" className="realTime-detail-box">
					{isLoading && <LoadingPage/>}
				</div>
			</div>
		)
	}
}