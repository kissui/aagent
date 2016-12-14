'use strict';

import React from 'react';
import _ from 'lodash';
import http from '../../lib/http';
import moment from 'moment';
import Chart from '../../components/chart';
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
			defaultSelect: 0,
			survey: null,
			device: onMenu,
			gameConf: onGameConf
		}
	},
	handleDealData: function (names, fields, ev) {
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
		return ev ? chartData : this.handleSurveyData(surveyName, chartData);

	},

	handleSurveyData: function (names, data) {
		let name = names.reverse();
		let survey = _.slice(data, 0, 3);

		name.map((nameItem, nameKey)=> {
			let survey_0 = survey[0][nameItem];
			let survey_1 = survey[1][nameItem];
			let survey_2 = survey[2][nameItem];
			let percent_y = (survey_0 - survey_1) / survey_1;
			let percent_t = (survey_1 - survey_2) / survey_2;
			_.extend(survey[0], {[nameItem + 'percent']: percent_y.toFixed(3) * 100});
			_.extend(survey[1], {[nameItem + 'percent']: percent_t.toFixed(3) * 100});
		});
		let datas = [];
		let survey0 = survey[0];
		let survey1 = survey[1];
		datas[0] = [
			{
				title: '昨日登录账号数',
				value: survey0['登录帐号'],
				percent: survey0['登录帐号percent'],
				chart_kpi: ['登录帐号', '新增帐号数']
			},
			{
				title: '昨日新增账号数',
				value: survey0['新增帐号数'],
				percent: survey0['新增帐号数percent']
			}];
		datas[1] = [
			{
				title: '昨日充值金额',
				value: survey0['充值金额'],
				percent: survey0['充值金额percent'],
				chart_kpi: ['充值金额', '充值角色数']
			},
			{
				title: '昨日充值角色数',
				value: survey0['充值角色数'],
				percent: survey0['充值角色数percent']
			}];
		datas[2] = [
			{
				title: '前日新增设备数',
				value: survey1['新增设备数'],
				percent: survey1['新增设备数percent'],
				chart_kpi: ['新增设备数', '新增设备次留']
			},
			{
				title: '前日新增设备次日留存',
				value: survey1['新增设备次留'],
				percent: survey1['新增设备次留percent']
			}];
		datas[3] = [
			{
				title: '昨日ACU',
				value: survey0['ACU'],
				percent: survey0['ACUpercent'],
				chart_kpi: ['ACU', 'PCU']
			},
			{
				title: '昨日PCU',
				value: survey0['PCU'],
				percent: survey0['PCUpercent']
			}
		];
		return datas;
	},
	componentDidMount: function () {
		const {surveyData} = this.props;
		let chart = this.handleDealData(surveyData.obj.tableThead, surveyData.obj.tableData, true);
		let surveys = this.handleDealData(surveyData.obj.tableThead, surveyData.obj.tableData);
		this.setState({
			survey: surveys,
			chartData: chart
		});
		// this.handleShowChart(chart, surveys[0][0].chart_kpi)
		this.handleDealSurreyData();
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
						isLoading: false
					});
					let response = Chart.dealChartData(res.theads, res.table);
					console.log(response, '@survey')
				}
			})
	},
	handleShowChart: function (data, conf) {
		console.log(data, conf);
		document.getElementById('c1').innerHTML = null;
		document.getElementById('range').innerHTML = null;
		var Frame = G2.Frame;
		var frame = new Frame(data);
		frame = Frame.combinColumns(frame, conf, 'count', 'type', '日期');
		var chart = new G2.Chart({
			id: 'c1',
			forceFit: true,
			height: 400
		});
		chart.source(frame);
		console.log(frame);
		chart.axis('time', {
			title: null
		});
		chart.legend(false);
		chart.line().position('日期*count').color('type');
		chart.render();
		var range = new G2.Plugin.range({
			id: "range", // DOM id
			forceFit: true, // 插件的宽度
			height: 30, // 插件的高度
			dim: '日期', // 指定筛选的数据维度
		});
		range.source(frame); // 载入数据源
		range.link(chart); // 关联 G2 图表对象，支持一个或者多个 chart 对象
		range.render(); // 渲染，将 chart 和 range 插件一起渲染
	},
	handleChangeChart: function (index, conf) {
		this.setState({
			defaultSelect: index,
		});
		// this.handleShowChart(this.state.chartData, conf)
	},
	render: function () {
		const {defaultSelect, survey} = this.state;
		let content = null;
		if (survey) {
			content = survey.map((item, i) => {
				return (
					<div className={defaultSelect == i ? "survey-col active" : 'survey-col' }
						 key={i}
						 onClick={this.handleChangeChart.bind(this, i, item[0].chart_kpi)}>
						<div className="default-content">
							<p className="title">{item[0].title}</p>
							<p className="value">{item[0].value}</p>
							<p className="percent">{item[0].percent}%</p>
						</div>
						<div className="survey-col-hover row">
							<div className="col-md-6">
								<p className="title">{item[0].title}</p>
								<p className="value">{item[0].value}</p>
								<p className="percent">{item[0].percent}%</p>
							</div>
							<div className="col-md-6">
								<p className="title">{item[1].title}</p>
								<p className="value">{item[1].value}</p>
								<p className="percent">{item[1].percent}%</p>
							</div>
						</div>
					</div>
				)
			})
		}
		return (
			<div>
				<h2 className="analysis-tit">
					<i className="fa fa-bar-chart"></i>
					概览
				</h2>
				<div className="survey row">
					{content}
				</div>
				<div id="c1"></div>
				<div id="range"></div>
			</div>

		)
	}
});