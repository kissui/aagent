'use strict';

import React from 'react';
import SelectBar from '../../components/box/selectBar';
import EverydayPage from './everyday';
import NewUserPage from './newuser';
import JSON from '../../components/json/conf_json';
import AccumaltePage from './accumalte';
import WeekDatePage from './everyweek';
import WeekNewUserPage from './newWeekUser';
import YearDatePage from './everyYear';
import YearNewUserPage from './newYearUser';
import http from '../../lib/http';
import SelectRollPage from '../../components/box/selectRoll';
module.exports = React.createClass({
	getInitialState: function () {
		return {
			cycle: 'days',
			device: 'Android',
			gameConf: null
		}
	},
	componentWillReceiveProps: function (nextProps) {
		if (nextProps.gameConf && nextProps.gameConf.gameId) {
			this.setState({
				gameConf: nextProps.gameConf
			})
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
	handleReceiveSelectCycle: function (value) {
		let cycle = this.state.cycle;
		if (value === cycle) return;
		this.setState({
			cycle: value
		});
	},
	handleReceiveSelectDevice: function (value) {
		let device = this.state.device;
		if (device === value) return;
		this.setState({
			device: value
		});
	},
	render: function () {
		const {cycle, device, gameConf} = this.state;
		let accumalte = cycle == "days" ? gameConf &&
		<AccumaltePage onDevice={device} onCycle={cycle} onGameId={gameConf.gameId}/> : null;
		let everyContent = gameConf && <EverydayPage onDevice={device} onCycle={cycle} onGameId={gameConf.gameId}/>;
		let newContent = gameConf && <NewUserPage onDevice={device} onCycle={cycle} onGameId={gameConf.gameId}/>;
		if (cycle == 'weeks') {
			everyContent = gameConf && <WeekDatePage onDevice={device} onCycle={cycle} onGameId={gameConf.gameId}/>;
			newContent = gameConf && <WeekNewUserPage onDevice={device} onCycle={cycle} onGameId={gameConf.gameId}/>;
		} else if (cycle == 'months') {
			everyContent = gameConf && <YearDatePage onDevice={device} onCycle={cycle} onGameId={gameConf.gameId}/>;
			newContent = gameConf && <YearNewUserPage onDevice={device} onCycle={cycle} onGameId={gameConf.gameId}/>;
		}
		return (
			<div className="bd-container">
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
								onSelectBarData={JSON.selectBarData}
								onReceiveValue={this.handleReceiveSelectCycle}
								onDefaultValue={'days'}
							/>
						</div>
						<div className="selectDevice">
							<SelectBar
								onSelectBarData={JSON.selectBarDevice}
								onReceiveValue={this.handleReceiveSelectDevice}
								onDefaultValue={'Android'}
							/>
						</div>
					</div>

				</div>
				{accumalte}
				{everyContent}
				{newContent}
			</div>
		)
	}
});


/**
 * @todo 运营报表日报
 */
function getNumOfWeeks(year) {
	var d = new Date(year, 0, 1);
	var yt = ( ( year % 4 == 0 && year % 100 != 0) || year % 400 == 0) ? 366 : 365;
	return Math.ceil((yt - d.getDay()) / 7.0);
}
