import React, {Component} from 'react';
import moment from 'moment';
import {defaultRanges, Calendar, DateRange} from 'react-date-range';

module.exports = React.createClass({
	getInitialState: function () {
		return {
			'predefined': {},
			'isShowRange': this.props.isShowRange,
			'defaultDateRange': this.props.onDefaultDateRange
		}
	},
	handleChange: function (which, payload) {
		this.setState({
			[which]: payload,
		});
		let start = payload['startDate'];
		let end = payload['endDate'];
		this.props.onReceiveData(start, end);
	},
	handleDisplayOption: function () {
		this.setState({
			'isShowRange': !this.state.isShowRange
		})
	},
	render: function () {
		moment.updateLocale('en', {
			months: [
				"1月", "2月", "3月", "4月", "5月", "6月", "7月",
				"8月", "9月", "10月", "11月", "12月"
			],
			weekdaysMin: ['日', '一', '二', '三', '四', '五', '六']

		});
		let changeDefaultRanges = {};
		changeDefaultRanges['今天'] = defaultRanges['Today'];
		changeDefaultRanges['昨天'] = defaultRanges['Yesterday'];
		changeDefaultRanges['最近7天'] = defaultRanges['Last 7 Days'];
		changeDefaultRanges['最近30天'] = defaultRanges['Last 30 Days'];
		const {predefined, isShowRange, defaultDateRange} = this.state;
		const {onFormat,dateInputStyle,singleStyle} = this.props;
		const format = onFormat ? onFormat : 'YYYY-MM-DD';
		return (
			<div className="datePicker-container">
				<div className="datePicker-view-input" style={dateInputStyle} onClick={this.handleDisplayOption}>
					<input
						type='text'
						readOnly
						style={singleStyle}
						value={ predefined['startDate'] && predefined['startDate'].format(format).toString() }
					/>
					<span className="character">--</span>
					<input
						type='text'
						readOnly
						style={singleStyle}
						value={ predefined['endDate'] && predefined['endDate'].format(format).toString() }
					/>
					<i className="fa fa-calendar"></i>
				</div>

				<div className={isShowRange ? "datePicker-box" : 'hide'}>
					<DateRange
						linkedCalendars={ true }
						ranges={ changeDefaultRanges }
						startDate={ now => {
							return defaultDateRange.start;
						}}
						endDate={ now => {
							return defaultDateRange.end;
						}}
						onInit={ this.handleChange.bind(this, 'predefined') }
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
				</div>

			</div>
		)
	}
});