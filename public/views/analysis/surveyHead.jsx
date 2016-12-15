'use strict';

import React from 'react';
import http from '../../lib/http';
export default class SurveyHead extends React.Component {
	constructor(props, context) {
		super(props, context);
		const {onDevice, onGameConf, onDateRange} = props;
		this.state = {
			defaultSurveyHead: null,
			defaultSelect: 0,
			device: onDevice,
			gameConf: onGameConf,
			dateRange: onDateRange
		}
	}

	handleChangeChart(index) {
		this.setState({
			defaultSelect: index,
		});
		this.props.onReceiveSelectIndex(index, index % 2 ? false : true);
	}

	componentWillReceiveProps(nextProps) {
		const {device, gameConf} = this.state;
		if (nextProps.onDevice != device || nextProps.onGameConf.gameId != gameConf.gameId) {
			let data = {
				'device': nextProps.onDevice, gameConf: nextProps.onGameConf, dateRange: nextProps.onDateRange
			};
			this.handleDealSurreyData(data);
		}
	}

	componentDidMount() {
		this.handleDealSurreyData(this.state);
	}

	handleDealSurreyData(params) {
		const {device, gameConf, dateRange} = params;
		let data = {
			"cycle": 'days',
			"device": device,
			"user_dimension": 'role',
			"data_dimension": 'analysis_head',
			"appid": gameConf.gameId,
			"kpi_conf": {
				"start": dateRange.dateStart,
				"end": dateRange.dateEnd,
				"kpis": [
					{
						'meta_id': '2817',
						'name': '昨日登录账号'
					},
					{
						'meta_id': '2816',
						'name': '昨日新增账号'
					},
					{
						'meta_id': '2819',
						'name': '昨日收入 '
					},
					{
						'meta_id': '2818',
						'name': '昨日付费角色'
					},
					{
						'meta_id': '2816',
						'name': '前日新增设备次留'
					},
					{
						'meta_id': '2833',
						'name': '前日新增设备数',
						'num_type': 'percent'
					},
					{
						'meta_id': '2844',
						'name': '昨日ACU',
						'self_weidu': 'acu'
					},
					{
						'meta_id': '2844',
						'name': '昨日PCU',
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
						surveyHead: res
					})
				}
			})
	}

	render() {
		const {surveyHead, defaultSelect} = this.state;
		return (
			<div className="survey row">
				{surveyHead && surveyHead.map((item, i) => {
					return (
						<div className={defaultSelect == i ? "survey-col active" : 'survey-col' }
							 key={i}
							 onClick={this.handleChangeChart.bind(this, i, item[0].chart_kpi)}>
							<div className="default-content">
								<p className="title">{item[0].title}</p>
								<p className="value">{item[0].value ? item[0].value : 0}</p>
								<p className="percent">{item[0].percent}</p>
							</div>
							<div className="survey-col-hover row">
								<div className="col-md-6">
									<p className="title">{item[0].title}</p>
									<p className="value">{item[0].value ? item[0].value : 0}</p>
									<p className="percent">{item[0].percent}</p>
								</div>
								<div className="col-md-6">
									<p className="title">{item[1].title}</p>
									<p className="value">{item[1].value ? item[1].value : 0}</p>
									<p className="percent">{item[1].percent}</p>
								</div>
							</div>
						</div>
					)
				})}
			</div>
		)
	}
}
