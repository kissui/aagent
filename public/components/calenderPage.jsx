'use strict';

import React from 'react';
import moment from 'moment';
import {defaultRanges, Calendar, DateRange} from 'react-date-range';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');
export default class CalendarPage extends React.Component {
	constructor(props, context) {
		super(props, context);
		this.state = {
			'datePickerShow': null,
			'show': false
		}
	}

	handleInit(which, payload) {
		this.setState({
			[which]: payload
		});
		// this.props.onReceiveData(payload, payload);
	}

	handleChange(which, payload) {
		this.setState({
			[which]: payload
		});
	}

	handleSubmit() {
		const {datePickerChange, show} = this.state;
		this.props.onReceiveData(datePickerChange, datePickerChange);
		this.setState({
			datePickerShow: datePickerChange,
			show: !show
		})
	}
	handleToggle() {
		const {show} = this.state;
		this.setState({
			show: !show
		})
	}

	render() {
		const {datePickerShow, show} = this.state;
		const format = 'YYYY-MM-DD';
		return (
			<div className="calendar-body">
				<div className="datePicker-view-input"
					 style={{width: '165px', background: '#fff'}}
					 onClick={this.handleToggle.bind(this)}
				>
					<input
						type='text'
						readOnly
						value={ datePickerShow && datePickerShow.format(format).toString() }
					/>
					<i className="fa fa-calendar"></i>
				</div>
				<div className={show ? "calendar-box" : 'hide'}>
					<Calendar
						date={ now => {
							return now.add(-1, 'days')
						} }
						onInit={ this.handleInit.bind(this, 'datePickerShow') }
						onChange={ this.handleChange.bind(this, 'datePickerChange') }
					/>
					<div className="text-right">
						<button className="btn btn-primary" onClick={this.handleSubmit.bind(this)}>确定</button>
						<button className="btn btn-default" onClick={this.handleToggle.bind(this)}>取消</button>
					</div>
				</div>
			</div>

		)
	}
}