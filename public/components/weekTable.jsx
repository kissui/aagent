'use strict';
import React from 'react';
import DatePickerWeekCalender from './weekDatePicker';
import moment from 'moment';
import momentISO from 'moment-isocalendar';
module.exports = React.createClass({
	getInitialState: function () {
		let current = moment(new Date()).isocalendar();
		let nextDates = moment(new Date(current[0] - 1, 11, 31)).isocalendar();
		let startYear = current[0], startWeek = current[1] - 7;
		if (current[1] - 7 < 0) {
			startYear = current[0] - 1;
			startWeek = nextDates[1] + current[1] - 7
		}
		return {
			initialState: true,
			toggleOpen: false,
			text: {
				startText: startYear + '第' + startWeek + '周',
				endText: current[0] + '第' + current[1] + '周'
			},
			dateRange: {
				startDate: [startYear, startWeek, 7, 0],
				endDate: current
			},
			save: {
				start: moment.fromIsocalendar([startYear, startWeek, 7, 0]).format('YYYY-MM-DD'),
				end: moment.fromIsocalendar(current).format('YYYY-MM-DD')
			}
		}
	},
	componentWillMount: function () {
		this.props.onReceiveWeekDate(this.state.save,this.state.text)
	},
	handleReceiveWeekRang: function (dataRange, singleRange, range) {
		const {initialState} = this.state;
		if (initialState) {
			this.setState({
				initialState: false
			});
			return;
		}
		let startDate, endDate, startYear, endYear, startText, endText,start,end;
		startYear = dataRange.startDate ? dataRange.startDate[0] : null;
		endYear = dataRange.endDate ? dataRange.endDate[0] : null;
		if (singleRange && singleRange.length === 2) {
			startDate = [startYear || endYear, singleRange[0], 7, 870];
			endDate = [startYear || endYear, singleRange[1], 7, 870];
			start = moment.fromIsocalendar(startDate).format('YYYY-MM-DD');
			end = moment.fromIsocalendar(endDate).format('YYYY-MM-DD');
			startText = (startYear || endYear) + '第' + singleRange[0] + '周';
			endText = (startYear || endYear) + '第' + singleRange[1] + '周'
		} else if (startYear && endYear) {
			startDate = dataRange.startDate;
			endDate = dataRange.endDate;
			start = moment.fromIsocalendar(startDate).format('YYYY-MM-DD');
			end = moment.fromIsocalendar(endDate).format('YYYY-MM-DD');
			startText = dataRange.startDate[0] + '第' + dataRange.startDate[1] + '周';
			endText = dataRange.endDate[0] + '第' + dataRange.endDate[1] + '周'

		} else if (range) {
			range = range.split('/');
			start = range[0];
			end = range[1];
			startDate = dataRange.startDate;
			endDate = dataRange.endDate;
			startText = startYear ? dataRange.startDate[0] + '第' + dataRange.startDate[1] + '周' :
			dataRange.endDate[0] + '第' + dataRange.endDate[1] + '周';
			endText = endYear ? dataRange.endDate[0] + '第' + dataRange.endDate[1] + '周' :
			dataRange.startDate[0] + '第' + dataRange.startDate[1] + '周';
		}
		this.setState({
			save: {
				start: start,
				end: end
			},
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
		const {toggleOpen,save,text,texts} = this.state;
		let sentText = texts ? texts : text;
		this.props.onReceiveWeekDate(save,sentText);
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
	handleOpenCalender: function (){
		const {toggleOpen} = this.state;
		this.setState({
			toggleOpen: !toggleOpen,
		})
	},
	render: function () {
		const {dateRange, text,toggleOpen} = this.state;
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