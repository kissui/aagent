'use strict';
import React from 'react';
import SelectBar from '../../components/box/selectBar';
import JSON from '../../components/json/conf_json';
import SurveyPage from './survey'; // 概览
import RecentDataPage from './recentData'; //近期数据模块
import SelectRollPage from '../../components/box/selectRoll' //选择角色的下拉菜单
const testData = JSON.testData;
module.exports = React.createClass({
	getInitialState: function () {
		return {
			chart_conf: null,
			device: 'Android',
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
	handleReceiveRoll: function (value) {
		const {gameConf} = this.state;
		this.setState({
			gameConf: {
				gameId: value,
				gameList: gameConf.gameList
			}
		})
	},
	render: function () {
		const {gameConf, device} = this.state;
		return (
			<div className="bd-container analysis-body">
				<div className="box-view bd-game-fix">
					{gameConf && <SelectRollPage
						onReceiveRollValue={this.handleReceiveRoll}
						onStyle={{
							position: 'relative',
							right: 0
						}}
						rollRange={gameConf.gameList}
					/>}
				</div>
				<div className="box-view">
					<div className="view-option">
						<div className="selectCycle">
							<SelectBar
								onSelectBarData={JSON.selectBarDevice}
								onReceiveValue={this.handleReceiveSelectDevice}
								onDefaultValue={'All'}
							/>
						</div>
					</div>
				</div>
				<div className="box-view">
					<SurveyPage surveyData={testData}/>
				</div>
				<div className="box-view">
					{gameConf && <RecentDataPage onMenu={device} onGameConf={gameConf}/>}
				</div>
			</div>
		)
	}
});