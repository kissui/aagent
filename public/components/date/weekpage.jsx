'use strict';
import React from 'react';

module.exports = React.createClass({
	render: function () {
		const {cycle} = this.props;

		return (
			<div className="dataWeekRange">

			</div>

		)
	}
});

let week = React.createClass({
	getInitialState: function () {
		const {startTime,endTime} = this.props
		return{
			preDefined: {
				start: startTime ? startTime: true
			}
		}
	},
	render: function () {
		return (
			<div className="dateWeek">

			</div>
		)
	}
});