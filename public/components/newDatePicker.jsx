import React, {Component} from 'react';
import moment from 'moment';
import {defaultRanges, Calendar, DateRange} from 'react-date-range';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');
module.exports = React.createClass({
	getInitialState: function () {
		const {isShowRange, onDefaultDateRange} = this.props;
		return {
			'predefined': {},
			'predefineds': {},
			'isShowRange': isShowRange,
			'defaultDateRange': onDefaultDateRange
		}
	},
	handleChange: function (which, payload) {
		console.log(which,payload,'@wwww')
		this.setState({
			[which]: payload,
		});
	},
	handleDisplayOption: function () {
		this.setState({
			'isShowRange': !this.state.isShowRange
		})
	},
	handleDisplayOptionFalse: function () {
		this.setState({
			'isShowRange': false
		})
	},
	handleSaveDate: function () {
		let payload = this.state.predefined;
		let start = payload['startDate'];
		let end = payload['endDate'];
		this.setState({
			'predefineds': payload,
			'isShowRange': !this.state.isShowRange
		});
		this.props.onReceiveData(start, end);
	},
	render: function () {
		let changeDefaultRanges = {};
		changeDefaultRanges['今天'] = defaultRanges['Today'];
		changeDefaultRanges['昨天'] = defaultRanges['Yesterday'];
		changeDefaultRanges['最近7天'] = defaultRanges['Last 7 Days'];
		changeDefaultRanges['最近30天'] = defaultRanges['Last 30 Days'];
		const {predefineds, isShowRange, defaultDateRange} = this.state;
		console.log(predefineds,'predefineds');
		const {onFormat, dateInputStyle, singleStyle} = this.props;
		const format = onFormat ? onFormat : 'YYYY-MM-DD';
		return (
			<div className="datePicker-container" onMouseLeave={this.handleDisplayOptionFalse}>
				<div className="datePicker-view-input" style={dateInputStyle} onClick={this.handleDisplayOption}>
					<input
						type='text'
						readOnly
						style={singleStyle}
						value={ predefineds['startDate'] && predefineds['startDate'].format(format).toString() }
					/>
					<span className="character">--</span>
					<input
						type='text'
						readOnly
						style={singleStyle}
						value={ predefineds['endDate'] && predefineds['endDate'].format(format).toString() }
					/>
					<i className="fa fa-calendar"></i>
				</div>

				<div className={isShowRange ? "datePicker-box" : 'hide'}>
					<DateRange
						linkedCalendars={ true }
						ranges={ changeDefaultRanges }
						startDate={ now => {
							return defaultDateRange.dateStart.split("-").reverse().join("/");
						}}
						endDate={ now => {
							return defaultDateRange.dateEnd.split("-").reverse().join("/");
						}}
						onInit={ this.handleChange.bind(this, 'predefineds') }
						onChange={ this.handleChange.bind(this, 'predefined') }
						theme={{
							Calendar: {width: 200},
							PredefinedRanges: {
								marginLeft: 10,
								marginTop: 10,
								width: '100px'
							}
						}}
					/>
					<div className="date_set">
						<button className="btn btn-primary" onClick={this.handleSaveDate}>确定</button>
						<button className="btn btn-default" onClick={this.handleDisplayOption}>取消</button>
					</div>
				</div>

			</div>
		)
	}
});