'use strict';
import React from 'react';
import SelectBar from '../../components/box/selectBar';
import JSON from '../../components/json/conf_json';
import SelectRollPage from '../../components/box/selectRoll' //选择角色的下拉菜单
import Auth from '../../lib/auth';
import SurveyPage from './widget/survey';
import DetailPage from './widget/detail';
const realTimeDetailNavLists = [
	{title: '实时在线', id: '234'},
	{title: '新增', id: '234'},
	{title: '登录', id: '234'},
	{title: '收入金额', id: '234'},
	{title: '付费角色', id: '234'}
];
module.exports = React.createClass({
	contextTypes: {
		router: React.PropTypes.object.isRequired
	},
	getInitialState: function () {
		return {
			chart_conf: null,
			device: 'All',
			gameConf: this.props.gameConf
		}
	},
	handleReceiveSelectDevice: function (value) {
		let device = this.state.device;
		if (device === value) return;
		this.setState({
			device: value
		});

	},
	componentWillReceiveProps: function (nextProps) {
		if (nextProps.gameConf && nextProps.gameConf.gameId) {
			this.setState({
				gameConf: nextProps.gameConf
			});
		}
	},
	render: function () {
		const {gameConf, device} = this.state;
		return (
			<div className="bd-container analysis-body">
				<div className="box-view">
					<div className="view-option">
						<div className="selectCycle">
							<SelectBar
								onSelectBarData={JSON.selectBarDevice}
								onReceiveValue={this.handleReceiveSelectDevice}
								onDefaultValue={device}
							/>
						</div>
					</div>
				</div>
				<div className="box-view analysis-show-box">
					<h2 className="analysis-tit">
						<i className="fa fa-bar-chart" aria-hidden="true"></i>
						数据概览
						<i className="fa fa-info-circle" aria-hidden="true"></i>
					</h2>
					<SurveyPage onGameConf={gameConf} onDevice={device}/>
				</div>
				<div className="box-view analysis-show-box">
					<DetailPage onNavDataLists={realTimeDetailNavLists}/>
				</div>
			</div>
		)
	}
});