'use strict';

import React from 'react';
import SelectBar from '../../components/box/selectBar';
import ViewNav from '../../components/box/navHeader';
import EverydayPage from './everyday';
import NewUserPage from './newuser';
import JSON from '../../components/json/conf_json';
import AccumaltePage from './accumalte';
import WeekDatePickerPage from '../../components/WeekDatePicker';
/*<WeekDatePickerPage onReceiveWeekRange={this.handleReceiveWeekRang}/>*/
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
	handleReceiveWeekRang: function (type,data) {
		console.log(type,data);
	},
	render: function () {
		const {cycle,device} = this.state;
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
					{/*<DateWeekPage cycle="week"/>*/}
				</div>
				<AccumaltePage onDevice={device} onCycle={cycle}/>
				<EverydayPage onDevice={device} onCycle={cycle}/>
				<NewUserPage onDevice={device} onCycle={cycle}/>
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
