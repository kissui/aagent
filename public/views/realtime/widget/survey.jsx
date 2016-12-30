'use strict';
import React from 'react';
import SelectRolePage from '../../../components/box/selectRoll';
import http from '../../../lib/http';
import Conf from '../realtimeConf';

export default class SurveyPage extends React.Component {
	constructor(props, context) {
		super(props, context);
		const {onGameConf, onDevice} = this.props;
		console.log(onGameConf, onDevice);
		this.handleSurveyData.bind(this);
		this.state = {
			defaultDate: null,
			gameId: onGameConf.gameId,
			device: onDevice,
			user_dimension: 'account',
			lists: null,
			overTime: null
		}
	}

	handleReceiveRole(value) {
		const {gameId, device} = this.state;
		this.setState({
			user_dimension: value
		});
		this.handleSurveyData(gameId, device, value)
	}

	componentDidMount() {
		this.handleSurveyData()
	}

	componentWillReceiveProps(nextProps) {
		const {gameId, device} = this.state;
		if (nextProps.onGameConf.gameId != gameId) {
			this.setState({
				gameId: nextProps.onGameConf.gameId
			});
			this.handleSurveyData(nextProps.onGameConf.gameId, device)
		} else if (nextProps.onDevice != device) {
			this.setState({
				gameId: nextProps.onDevice
			});
			this.handleSurveyData(gameId, nextProps.onDevice)
		}
	}

	handleSurveyData(paramsGameId, paramsDevice, paramsRole) {
		const {gameId, device, user_dimension} = this.state;
		let roleName = paramsRole == "role" ? "角色" : '账号';
		let data = {
			"cycle": 'hour',
			"device": paramsDevice ? paramsDevice : device,
			"user_dimension": paramsRole ? paramsRole : user_dimension,
			"data_dimension": 'hour_head',
			"appid": paramsGameId ? paramsGameId : gameId,
			"kpi_conf": {
				"kpis": Conf.dealParamsConf(roleName)
			}
		};
		http.get('/dudai/?c=analysis.report&ac=get', {params: data})
			.then(data=>data.data)
			.then((data)=> {
				if (data.error_code === 0) {
					if (data.data.lists && data.data.lists.length > 0) {
						this.setState({
							lists: data.data.lists,
							dealTime: data.data.datetime
						})
					} else {
						this.setState({
							lists: null
						})
					}
				}
			})
	}

	render() {
		let colors = ['#45594e', '#8fbeac', '#5e9882', '#fbbe7b', '#fff6e5', '#e89ba5', '#f5de50', '#f6deda', '#fbbe7a'];
		const {lists,dealTime} = this.state;
		return (
			<div>
				<h2 className="analysis-tit">
					<i className="fa fa-bar-chart" aria-hidden="true">
					</i>
					<span>数据概览</span>
					<i className="fa fa-info-circle" aria-hidden="true">
					</i>
					<span className="time">{dealTime}</span>
				</h2>
				<div className="realTime-survey">
					<SelectRolePage
						onReceiveRollValue={this.handleReceiveRole.bind(this)}
						onStyle={{
							position: 'relative',
							right: 0,
							marginTop: '8px'
						}}
						rollRange={Conf.realTimeRoleConf}
					/>
					<div className="realTime-lists row">
						{lists && lists.map((item, i)=> {
							return (
								<div className="col-md-3 real-item" key={i}
									 style={{borderLeft: '4px solid ' + colors[i]}}>
									<p className="name">{item.name}</p>
									<p className="value">{item.this_hour}</p>
									<div className="real-diff">
										<span>实时同比</span>
										<i className={item.precent > 0 ? "fa fa-caret-up font-up size" : "fa fa-caret-down font-down size"}>
										</i>
										<span className={item.precent > 0 ? "font-up" : "font-down"}>
										{item.percent}%
									</span>
									</div>
									<div className="item-cash">
										<div className="title">昨日值：</div>
										<div className="value">{item.y_this_hour}</div>
									</div>
									<div className="item-cash">
										<div className="title">7日前：</div>
										<div className="value">{item['7ago_this_hour']}</div>
									</div>
									<div className="item-cash">
										<div className="title">30日前：</div>
										<div className="value">{item['30ago_this_hour']}</div>
									</div>
								</div>
							)
						})}
					</div>
				</div>
			</div>
		)
	}
}