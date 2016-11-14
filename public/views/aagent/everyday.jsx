'use strict';

import React from 'react';
import _ from 'lodash'
import http from '../../lib/http';
import ViewNav from '../../components/box/navHeader';
import TablePage from '../layout/table';
module.exports = React.createClass({
	getInitialState: function () {
		return {
			sum: {},
			mean: {}
		}
	},
	componentDidMount: function () {
		this.getInitData();
	},
	getInitData: function () {
		let data = {
			"cycle": "days",
			"device": "Android",
			"weidu": "role",
			"appid": 233002,

			"kpi_conf": {
				"accumulate": {
					"start": "2016-11-04",
					"end": "2016-11-04",
					"kpis": [
						{
							'meta_id': '2816',
							'name': '新增账号数'
						},
						{
							'meta_id': '2819',
							'name': '付费金额'
						}
					]
				},
				"everyday": {
					"start": "2016-10-27",
					"end": "2016-11-04",
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
				"new": {
					"start": "2016-11-04",
					"end": "2016-11-04",
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
					]
				}
			}
		};
		http.get('/dudai/?c=analysis.report&ac=get&token=mgame_afs23cgs23', {params: data})
			.then(data=>data.data)
			.then((data)=> {
				if (data.error_code === 0) {
					let res = data.data.everyday;
					this.setState({
						heads: res.fields,
						bodys: res.datas
					});
					console.log(this.handleDealData(res.fields, res.datas));
					let response = this.handleDealData(res.fields, res.datas);
					this.handleAccountData(response);
					this.handleShowChart('c1', response, ['登录账号', '新增账号'], ['日期']);
					this.handleShowChart('c2', response, ['付费账号', '充值收入',], ['日期', '账号日ARPPU', '账号日付费率']);
					this.handleShowChart('c3', response, ['ACU', 'PCU',], ['日期', '新增账号次留']);
				}
			})
	},
	handleDealData: function (names, fields) {
		const chartData = [];
		let surveyName = names;
		fields.map((item, i)=> {
			const obj = {};
			item.map((superItem, k)=> {
				obj[surveyName[k]] = surveyName[k] === '日期' ? superItem : (
					superItem === '' ? 0 : parseFloat(superItem));
			});
			chartData.push(obj)
		});
		return chartData;

	},
	handleShowChart: function (id, data, indicators, dimensions) {
		var chart = new G2.Chart({
			id: id,
			forceFit: true,
			height: 200,
			plotCfg: {
				margin: [0, 0, 30, 0]
			}
		});
		var Frame = G2.Frame;
		var frame = new Frame(data);
		chart.axis('日期', {
			formatter: function (dimValue) {
				return dimValue.slice(8) + '';
			}
		});
		frame = Frame.combinColumns(frame, indicators, 'population', 'kpi', dimensions);
		chart.legend(false);
		chart.source(frame);
		chart.interval(['stack']).position('日期*population').color('kpi');// 使用图形语法绘制柱状图
		if (dimensions.length > 1) {
			let d = dimensions.slice(1).join('*');
			chart.line().position(dimensions[0] + '*' + dimensions[1]).color(dimensions[1]);
		}
		chart.render();
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
		console.log(start, end, title)
	},
	render: function () {
		const {sum, mean, heads, bodys} = this.state;
		return (
			<div className="box-view">
				<ViewNav
					defaultText="每日概览"
					onReceiveDateRange={this.handleGetDateRange}
					isShowDateRange={true}
					onDateRange={{
						start: '',
						end: ''
					}}
				/>
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
	}
});