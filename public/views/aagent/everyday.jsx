'use strict';

import React from 'react';
import _ from 'lodash'
import http from '../../lib/http';
import ViewNav from '../../components/box/navHeader';
import TablePage from '../layout/table';
import Chart from '../../components/chart';
import moment from 'moment';
import LoadingPage from '../../components/is_loading';
module.exports = React.createClass({
	getInitialState: function () {
		let defaultRange = 3600 * 24 * 7 * 1000;
		let endRange = +new Date();
		let startRange = endRange - defaultRange;
		const {onDevice, onCycle} = this.props;
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
				dimension: 'account'
			}
		}
	},
	componentDidMount: function () {
		const {dateRange, globalConf} = this.state;
		this.getInitialData(globalConf, dateRange);
	},
	componentWillReceiveProps: function (nextProps) {
		const {dateRange, globalConf} = this.state;
		if(nextProps.onCycle === globalConf.cycle && nextProps.onDevice === globalConf.device) return;
		const receivePropsConf = {
			cycle: nextProps.onCycle,
			device: nextProps.onDevice,
			dimension: globalConf.dimension
		};
		this.setState({
			globalConf: receivePropsConf,
			isLoading: true
		});
		this.getInitialData(receivePropsConf,dateRange);
		console.log('@nextProps',nextProps.onCycle,nextProps.onDevice,globalConf);
	},
	getInitialData: function (globalConf, dateConf) {

		let data = {
			"cycle": globalConf.cycle,
			"device": globalConf.device,
			"weidu": globalConf.dimension,
			"appid": 233002,

			"kpi_conf": {
				"everyday": {
					"start": dateConf.dateStart,
					"end": dateConf.dateEnd,
					"kpis": [
						{
							'meta_id': '2817',
							'name': '登录账号'
						},
						{
							'meta_id': '2816',
							'name': '新增账号 '
						},
						{
							'meta_id': '2818',
							'name': '付费账号 '
						},
						{
							meta_id: '2853',
							name: '账号日付费率'
						},
						{
							'meta_id': '2819',
							'name': '充值收入 '
						},
						{
							meta_id: '2854',
							name: '账号日ARPPU'
						},
						{
							'meta_id': '2833',
							'name': '新增账号次留'
						},
						{
							'meta_id': '2844',
							'name': 'ACU'
						},
						{
							'meta_id': '2844',
							'name': 'PCU'
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
						heads: res.fields,
						bodys: res.datas,
						isLoading: false
					});
					console.log(Chart.dealChartData(res.fields, res.datas));
					let response = Chart.dealChartData(res.fields, res.datas);
					this.handleAccountData(response);
					Chart.handleShowChart('c1', response, ['登录账号', '新增账号'], ['日期']);
					Chart.handleShowChart('c2', response, ['付费账号', '充值收入',], ['日期', '账号日ARPPU', '账号日付费率']);
					Chart.handleShowChart('c3', response, ['ACU', 'PCU',], ['日期', '新增账号次留']);
				}
			})
	},
	handleAccountData: function (data) {
		let sum = {
			ac_cash: _.sumBy(data, (o)=> {
				return parseFloat(o['充值收入'])
			}),
			ac_new: _.sumBy(data, (o)=> {
				return o['新增账号']
			})
		};
		let mean = {
			mean_account: _.meanBy(data, (m)=> {
				return parseFloat(m['登录账号'])
			}),
			mean_cash: _.meanBy(data, (m)=> {
				return parseFloat(m['账号日付费率'])
			})
		};
		mean.mean_account = Math.ceil(mean.mean_account);
		mean.mean_cash = (mean.mean_cash * 100).toFixed(2);
		this.setState({
			sum: sum,
			mean: mean
		})
	},
	handleGetDateRange: function (start, end, title) {
		console.log(start, end, title);
		const {globalConf} = this.state;
		let dateConf = {
			dateStart: start,
			dateEnd: end
		};
		this.setState({
			dateRange: {
				dateStart: start,
				dateEnd: end
			},
			isLoading: true
		});
		this.getInitialData(globalConf, dateConf);
	},
	handleReceiveRoll: function(value){
		console.log(value)
		const {globalConf,dateRange} = this.state;
		globalConf.dimension = value;
		this.setState({
			isLoading: true
		})
		this.getInitialData(globalConf, dateRange);
	},
	render: function () {
		const {sum, mean, heads, bodys, dateRange,isLoading} = this.state;
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
						<p className="number">{sum.ac_new}</p>
					</div>
					<div className="col b-view">
						<p className="title">
							<i className=" icon fa fa-user-o"></i>
							日均登录账号/角色
						</p>
						<p className="number">{mean.mean_account}</p>
					</div>
					<div className="col b-view br-none">
						<p className="title">
							<i className=" icon fa fa-money"></i>
							日均付费率
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
		)
		return (
			<div className="box-view">
				<ViewNav
					defaultText="每日概览"
					onReceiveDateRange={this.handleGetDateRange}
					isShowDateRange={true}
					onDateRange={dateRange}
					onReceiveRollValue={this.handleReceiveRoll}
					isShowRoll={true}
				/>
				{!isLoading && heads ? content : <LoadingPage/>}
			</div>
		)
	}
});
