'use strict';

import React from 'react';
import _ from 'lodash'
import http from '../../lib/http';
import ViewNav from '../../components/box/navYearHeader';
import TablePage from '../layout/table';
import Chart from '../../components/chart';
import moment from 'moment';
import LoadingPage from '../../components/is_loading';
module.exports = React.createClass({
	getInitialState: function () {
		let defaultRange = 3600 * 24 * 7 * 1000;
		let endRange = +new Date();
		let startRange = endRange - defaultRange;
		const {onDevice, onCycle, onGameId} = this.props;
		let format = 'YYYY-MM-DD';
		return {
			sum: {},
			mean: {},
			dateRange: {
				dateStart: moment(new Date(startRange)).format(format).toString(),
				dateEnd: moment(new Date()).format(format).toString()
			},
			globalConf: {
				cycle: onCycle,
				device: onDevice,
				gameId: onGameId,
				dimension: 'account'
			}
		}
	},
	componentDidMount: function () {
		const {dateRange, globalConf} = this.state;
		// this.getInitialData(globalConf, dateRange);
	},
	componentWillReceiveProps: function (nextProps) {
		const {dateRange, globalConf} = this.state;
		if (nextProps.onCycle === globalConf.cycle && nextProps.onDevice === globalConf.device && nextProps.onGameId === globalConf.gameId) return;
		const receivePropsConf = {
			cycle: nextProps.onCycle,
			device: nextProps.onDevice,
			gameId: nextProps.onGameId,
			dimension: globalConf.dimension
		};
		this.setState({
			globalConf: receivePropsConf,
			isLoading: true
		});
		this.getInitialData(receivePropsConf, dateRange);
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
	getInitialData: function (globalConf, dateConf) {
		let dimensionText = this.handleDealDimensionText(globalConf.dimension);
		let data = {
			"cycle": globalConf.cycle,
			"device": globalConf.device,
			"user_dimension": globalConf.dimension,
			"appid": globalConf.gameId,
			"kpi_conf": {
				"start": dateConf.dateStart,
				"end": dateConf.dateEnd,
				"kpis": [
					{
						'meta_id': '2820',
						'name': '登录' + dimensionText
					},
					{
						'meta_id': '2816',
						'name': '新增' + dimensionText
					},
					{
						'meta_id': '2821',
						'name': '付费' + dimensionText
					},
					{
						'meta_id': '2874',
						'name': dimensionText + '月付费率',
						'num_type': 'percent'
					},
					{
						'meta_id': '2819',
						'name': '充值收入 '
					},
					{
						'meta_id': '2875',
						'name': dimensionText + '月ARPPU',
						'num_type': 'fixed_2'
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
					let res = data.data.everyday;
					this.setState({
						heads: res.theads,
						bodys: res.table,
						isLoading: false
					});
					let response = Chart.dealChartData(res.theads, res.table);
					this.handleAccountData(response, dimensionText);
					Chart.handleShowChart('c1', response, ['登录' + dimensionText, '新增' + dimensionText], ['日期']);
					Chart.handleShowChart('c2', response, ['付费' + dimensionText, '充值收入',], ['日期', dimensionText + '月ARPPU', dimensionText + '月付费率']);
					Chart.handleShowChart('c3', response, ['ACU', 'PCU',], ['日期', '新增' + dimensionText + '次留']);
				}
			})
	},
	handleAccountData: function (data, dimensionText) {
		let sum = {
			ac_cash: _.sumBy(data, (o)=> {
				return parseFloat(o['充值收入'])
			}),
			ac_new: _.sumBy(data, (o)=> {
				return o['新增' + dimensionText]
			})
		};
		let mean = {
			mean_account: _.meanBy(data, (m)=> {
				return parseFloat(m['登录' + dimensionText])
			}),
			mean_cash: _.meanBy(data, (m)=> {
				return parseFloat(m[dimensionText + '月付费率'])
			})
		};
		mean.mean_account = Math.ceil(mean.mean_account);
		mean.mean_cash = (mean.mean_cash * 100).toFixed(2);
		this.setState({
			sum: sum,
			mean: mean
		})
	},
	handleGetDateRange: function (save) {
		const {globalConf} = this.state;
		console.log(save, 'save');
		let dateConf = {
			dateStart: save.startDate,
			dateEnd: save.endDate
		};
		this.setState({
			dateRange: dateConf,
			isLoading: true
		});
		this.getInitialData(globalConf, dateConf);
	},
	handleReceiveRoll: function (value) {
		const {globalConf, dateRange} = this.state;
		globalConf.dimension = value;
		this.setState({
			isLoading: true
		});
		this.getInitialData(globalConf, dateRange);
	},
	render: function () {
		const {sum, mean, heads, bodys, dateRange, isLoading, globalConf} = this.state;
		let content = (
			<div>
				<div className="everyday-box row">
					<div className="col b-view">
						<p className="title">
							<i className=" icon fa fa-dollar"></i>
							累计付费金额（元）
						</p>
						<p className="number">{sum.ac_cash}</p>
					</div>
					<div className="col b-view">
						<p className="title">
							<i className=" icon fa fa-user-plus"></i>
							累计新增账号/角色
						</p>
						<p className="number">{parseFloat(sum.ac_new).flover(0)}</p>
					</div>
					<div className="col b-view">
						<p className="title">
							<i className=" icon fa fa-user-o"></i>
							周均登录账号/角色
						</p>
						<p className="number">{mean.mean_account}</p>
					</div>
					<div className="col b-view br-none">
						<p className="title">
							<i className=" icon fa fa-money"></i>
							月均付费率
						</p>
						<p className="number">{mean.mean_cash}%</p>
					</div>
				</div>
				<div className="everyday-chart row">
					<div className="col">
						<h2>登录新增</h2>
						<div id="c1" className="showChart"></div>
					</div>
					<div className="col">
						<h2>付费情况</h2>
						<div id="c2" className="showChart"></div>
					</div>
					<div className="col">
						<h2>在线留存</h2>
						<div id="c3" className="showChart"></div>
					</div>
				</div>
				<TablePage heads={heads} bodys={bodys}/>
			</div>
		);
		return (
			<div className="box-view">
				<ViewNav
					defaultText="每周概览"
					onReceiveDateRange={this.handleGetDateRange}
					isShowDateRange={true}
					onDateRange={dateRange}
					onReceiveRollValue={this.handleReceiveRoll}
					globalConf={globalConf}
					isShowRoll={true}
				/>
				{!isLoading && heads ? content : <LoadingPage/>}
			</div>
		)
	}
});
