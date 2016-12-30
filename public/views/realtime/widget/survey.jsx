'use strict';
import React from 'react';
import SelectRolePage from '../../../components/box/selectRoll';
import http from '../../../lib/http';
import Conf from '../realtimeConf';
import LoadingPage from '../../../components/is_loading'
export default class SurveyPage extends React.Component {
	constructor(props, context) {
		super(props, context);
		const {onGameConf, onDevice} = this.props;
		this.handleSurveyData.bind(this);
		this.state = {
			defaultDate: null,
			gameId: onGameConf.gameId,
			device: onDevice,
			user_dimension: 'account',
			lists: null,
			overTime: null,
			tipIsShow: false
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

	handleToggleTip(value) {
		this.setState({
			tipIsShow: value
		})
	}

	render() {
		let colors = ['#45594e', '#8fbeac', '#5e9882', '#fbbe7b', '#fff6e5', '#e89ba5', '#f5de50', '#f6deda', '#fbbe7a'];
		const {lists, dealTime, tipIsShow} = this.state;
		return (
			<div>
				<h2 className="analysis-tit" onMouseLeave={this.handleToggleTip.bind(this, false)}>
					<i className="fa fa-bar-chart" aria-hidden="true">
					</i>
					<span>数据概览</span>
					<i className="fa fa-info-circle" aria-hidden="true"
					   onMouseEnter={this.handleToggleTip.bind(this, true)}>
					</i>
					{tipIsShow && <div className="tooltip-box">
						<p>由于实时页面的角色/帐号、付费等指标与近期概况、运营报表和定制指标 页面计算逻辑不完全一致，数值上会有一定的偏差，敬请留意。</p>
						<h4>登录帐号/角色：</h4>
						<p>实时统计当日有过登录行为的帐号/角色去重数量</p>
						<h4>新增帐号/角色：</h4>
						<p>实时统计当日首次出现登录行为的帐号/角色去重数量</p>
						<h4>老玩家帐号/角色：</h4>
						<p>实时统计当日非首次出现过登录行为帐号/角色去重数量</p>
						<h4>付费帐号/角色：</h4>
						<p>实时统计当日有充值行为的帐号/角色去重数量</p>
						<h4>人均游戏次数：</h4>
						<p>实时统计角色当日人均登录游戏的累计次数</p>
						<h4>实时次日留存帐号/角色：</h4>
						<p>实时统计前1日新增用户在当日有过登录行为的帐号/角色去重数量</p>
						<h4>付费次数：</h4>
						<p>实时统计角色当日充值的累计次数</p>
						<h4>今日收入：</h4>
						<p>实时统计角色当日充值的累计金额</p>
					</div>}
					< span className="time">{dealTime}</span>
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
						{lists ? lists.map((item, i)=> {
							return (
								<div className="col-md-3 real-item" key={i}
									 style={{borderLeft: '4px solid ' + colors[i]}}>
									<p className="name">{item.name}</p>
									<p className="value">{item.this_hour}</p>
									<div className="real-diff">
										{item.percent != 0 && <div className="title">
											<span>实时同比</span>
											<i className={item.percent > 0 ? "fa fa-caret-up font-up size" : "fa fa-caret-down font-down size"}>
											</i>
											<span className={item.percent > 0 ? "font-up" : "font-down"}>
												{item.percent < 0 ? -item.percent : item.percent}%
											</span>
										</div>
										}
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
						}) : <LoadingPage/>}
					</div>
				</div>
			</div>
		)
	}
}