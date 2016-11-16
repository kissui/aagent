'use strict';
import React from 'react';
import TablePage from '../layout/table';
import Chart from '../../components/chart';
import http from '../../lib/http';
import ViewNav from '../../components/box/navHeader';
import moment from 'moment';
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
				device: onDevice
			}
		}
	},
	componentDidMount: function () {
		const {dateRange, globalConf} = this.state;
		this.getInitialData(globalConf, dateRange);
	},
	getInitialData: function (globalConf, dateConf) {

		let data = {
			"cycle": globalConf.cycle,
			"device": globalConf.device,
			"weidu": "role",
			"appid": 233002,

			"kpi_conf": {
				"new": {
					"start": dateConf.dateStart,
					"end": dateConf.dateEnd,
					"kpis": [
						{
							'meta_id': '2816',
							'name': '新增账号'
						},
						{
							'meta_id': '2833',
							'name': '次日留存'
						},
						{
							'meta_id': '2834',
							'name': '第3日留存'
						},
						{
							'meta_id': '2835',
							'name': '第7日留存'
						},
						{
							'meta_id': '2836',
							'name': '第15日留存'
						},
						{
							'meta_id': '2837',
							'name': '第30日留存'
						},
						{
							'meta_id': '2857',
							'name': 'LTV-1'
						},
						{
							'meta_id': '2858',
							'name': 'LTV-3'
						},
						{
							'meta_id': '2859',
							'name': 'LTV-7'
						},
						{
							'meta_id': '2860',
							'name': 'LTV-15'
						},
						{
							'meta_id': '2861',
							'name': 'LTV-30'
						},
						{
							'meta_id': '2862',
							'name': 'LTV-45'
						},
						{
							'meta_id': '2863',
							'name': 'LTV-60'
						},
						{
							'meta_id': '2864',
							'name': 'LTV-90'
						},
					]
				}
			}
		};
		http.get('/dudai/?c=analysis.report&ac=get&token=mgame_afs23cgs23', {params: data})
			.then(data=>data.data)
			.then((data)=> {
				if (data.error_code === 0) {
					let res = data.data.new;
					this.setState({
						heads: res.fields,
						bodys: res.datas,
						isLoading: false
					});
					console.log(Chart.dealChartData(res.fields, res.datas));
					let response = Chart.dealChartData(res.fields, res.datas);
					// this.handleAccountData(response);
					Chart.handleShowChart('c4', response, ['新增账号'], ['日期','次日留存','第3日留存','第7日留存','第15日留存','第30日留存']);
					Chart.handleShowChart('c5', response, ['新增账号'], ['日期', 'LTV-1', 'LTV-3','LTV-7','LTV-15','LTV-30','LTV-45','LTV-60','LTV-90']);
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
	render: function () {
		const {heads,bodys} = this.state;
		return (
			<div className="box-view">
				<ViewNav
					defaultText="新用户质量"
					onReceiveDateRange={this.handleGetDateRange}
					onDateRange={{
						dateStart: '',
						dateEnd: ''
					}}
				/>
				<div className="new-user row">
					<div className="col user-view">
						<p className="title">
							<i className=" icon fa fa-user-plus"></i>
							累计新增账号/角色
						</p>
						<p className="number">23112</p>
					</div>
					<div className="col user-view">
						<p className="title">
							<i className=" icon fa fa-user"></i>
							(平均)次日留存/7日留存/15日留存
						</p>
						<p className="number">23112</p>
					</div>
					<div className="col user-view br-none">
						<p className="title">
							<i className=" icon fa fa-user-times"></i>
							(平均)1日LTV/7日LTV/15日LTV/30日LTV
						</p>
						<p className="number">23112</p>
					</div>
					<div className="everyday-chart row">
						<div className="col-user">
							<h2>登录新增</h2>
							<div id="c4" className="showChart"></div>
						</div>
						<div className="col-user">
							<h2>付费情况</h2>
							<div id="c5" className="showChart"></div>
						</div>
					</div>
					<TablePage heads={heads} bodys={bodys}/>
				</div>
			</div>
		)
	}
});