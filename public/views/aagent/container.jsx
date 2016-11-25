'use strict';

import React from 'react';
import SelectBar from '../../components/box/selectBar';
import EverydayPage from './everyday';
import NewUserPage from './newuser';
import JSON from '../../components/json/conf_json';
import AccumaltePage from './accumalte';
import WeekDatePage from './everyweek';
import WeekNewUserPage from './newWeekUser';
module.exports = React.createClass({
	getInitialState: function () {
		return {
			cycle: 'days',
			device: 'Android'
		}
	},
	componentDidMount: function () {

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
		const {cycle,device} = this.state;
		let accumalte = cycle =="days" ? <AccumaltePage onDevice={device} onCycle={cycle}/> : null;
		let everyContent = <EverydayPage onDevice={device} onCycle={cycle}/>;
		let newContent = <NewUserPage onDevice={device} onCycle={cycle}/>;
		if(cycle == 'weeks') {
			everyContent = <WeekDatePage onDevice={device} onCycle={cycle}/>;
			newContent = <WeekNewUserPage onDevice={device} onCycle={cycle}/>;
		} else if(cycle == 'months') {
			everyContent = null;
			newContent = null;
		}
		return (
			<div className="bd-container">
				<div className="box-view bd-game-fix">
					诛仙
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
