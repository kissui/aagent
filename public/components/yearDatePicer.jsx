'use strict';
import React from 'react';
import DatePickerWeekCalender from './year2';
import moment from 'moment';
import momentISO from 'moment-isocalendar';
module.exports = React.createClass({
	getInitialState: function () {
		let current = moment(new Date()).format('YYYY-MM');
		let startYear = current.split("-")[0], startMonth = current.split('-')[1] - 6;
		if (startMonth < 0) {
			startYear = startYear - 1;
			startMonth = 12 + startMonth - 6
		}
		return {
			initialState: true,
			toggleOpen: false,
			text: {
				startText: startYear + '第' + startMonth + '月',
				endText: current.split('-')[0] + '第' + current.split('-')[1] + '月'
			},
			dateRange: {
				startDate: startYear + "-" + startMonth,
				endDate: current
			}
		}
	},
	componentWillMount: function () {
		this.props.onReceiveWeekDate(this.state.dateRange, this.state.text)
	},
	handleReceiveWeekRang: function (dataRange, singleRange, range) {
		const {initialState} = this.state;
		if (initialState) {
			this.setState({
				initialState: false
			});
			return;
		}
		let startDate, endDate, startYear, endYear, startText, endText, start, end;
		startYear = dataRange.startDate ? dataRange.startDate.split('-')[0] : null;
		endYear = dataRange.endDate ? dataRange.endDate.split('-')[0] : null;
		if (singleRange && singleRange.length === 2) {
			startDate = (startYear || endYear) + "-" + singleRange[0];
			endDate = (startYear || endYear) + "-" + singleRange[1];
			startText = (startYear || endYear) + '第' + singleRange[0] + '月';
			endText = (startYear || endYear) + '第' + singleRange[1] + '月'
		} else if (startYear && endYear) {
			startDate = dataRange.startDate;
			endDate = dataRange.endDate;
			startText = dataRange.startDate.split('-')[0] + '第' + dataRange.startDate.split('-')[1] + '月';
			endText = dataRange.endDate.split('-')[0] + '第' + dataRange.endDate.split('-')[1] + '月'

		} else if (range) {
			// let rangeArray = range.split('-');
			startDate = dataRange.startDate;
			endDate = dataRange.endDate;
			startText = startYear ? dataRange.startDate.split('-')[0] + '第' + dataRange.startDate.split('-')[1] + '月' :
			dataRange.endDate.split('-')[0] + '第' + dataRange.endDate.split('-')[1] + '月';
			endText = endYear ? dataRange.endDate.split('-')[0] + '第' + dataRange.endDate.split('-')[1] + '月' :
			dataRange.startDate.split('-')[0] + '第' + dataRange.startDate.split('-')[1] + '月';
		}
		this.setState({
			dateRange: {
				startDate: startDate,
				endDate: endDate
			},
			texts: {
				startText: startText,
				endText: endText
			}
		});
	},
	handleSaveTime: function () {
		const {toggleOpen, dateRange, text, texts} = this.state;
		let sentText = texts ? texts : text;
		this.props.onReceiveWeekDate(dateRange, sentText);
		this.setState({
			toggleOpen: !toggleOpen,
			text: sentText
		})
	},
	handleCancel: function () {
		this.setState({
			toggleOpen: false,
		})
	},
	handleOpenCalender: function () {
		const {toggleOpen} = this.state;
		this.setState({
			toggleOpen: !toggleOpen,
		})
	},
	render: function () {
		const {dateRange, text, toggleOpen} = this.state;
		return (
			<div className="datePicker-week-wrap">
				<div className="datePicker-week-input" onClick={this.handleOpenCalender}>
					<span>{text.startText}</span> - <span>{text.endText}</span>
				</div>
				{toggleOpen ? <div className="datePicker-week-body">
					<DatePickerWeekCalender
						onReceiveWeekRange={this.handleReceiveWeekRang}
						dateRange={dateRange}
					/>
					<div className="save-date">
						<button className="btn btn-primary" onClick={this.handleSaveTime}>确定</button>
						<button className="btn btn-default" onClick={this.handleCancel}>取消</button>
					</div>
				</div> : null}
			</div>
		)
	}
});