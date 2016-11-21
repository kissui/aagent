'use strict';

import React from 'react';
import moment from 'moment';
import momentISO from 'moment-isocalendar';
import _ from 'lodash';c
module.exports = React.createClass({
	getInitialState: function () {
		const {dateRange} = this.props;
		let current = moment(new Date()).isocalendar();
		return {
			dateRange: {
				startDate: dateRange && dateRange.startDate ? dateRange.startDate : null,
				endDate: dateRange && dateRange.endDate ? dateRange.endDate : current
			},
			yearRang: {
				startYear: dateRange && dateRange.startDate ? dateRange.startDate[0] : current[0] - 1,
				endYear: dateRange && dateRange.endDate ? dateRange.endDate[0] : current[0],
			},
			left: {
				year: dateRange && dateRange.startDate ? dateRange.startDate[0] : '',
				week: dateRange && dateRange.startDate ? dateRange.startDate[1] : ''
			},
			right: {
				year: dateRange && dateRange.endDate ? dateRange.endDate[0] : current[0],
				week: dateRange && dateRange.endDate ? dateRange.endDate[1] : current[1]
			}


		}
	},
	componentWillMount: function () {
		const {dateRange} = this.state;
		this.props.onReceiveWeekRange('init', {left: dateRange.startDate, right: dateRange.endDate});
	},
	handleSelectWeek: function (index, year, week, range) {
		const {left, right} = this.state;
		this.setState({
			[index]: {
				year: year,
				week: week,
				range: range
			}
		});
		setTimeout(()=> {
			this.props.onReceiveWeekRange('change', {left: this.state.left, right: this.state.right});
		}, 40)
	},
	handleSelectYear: function (direction) {
		const {yearRang, dateRange} =this.state;
		let startYear, endYear;
		console.log(yearRang, dateRange);
		if (direction === 'right') {
			startYear = (yearRang.startYear + 1);
			endYear = (yearRang.endYear + 1);
		} else {
			startYear = (yearRang.startYear - 1);
			endYear = (yearRang.endYear - 1);
		}
		console.log(dateRange.dateStart);
		this.setState({
			yearRang: {
				startYear: startYear,
				endYear: endYear
			},
			dateRange: {
				startDate: dateRange.dateStart,
				endDate: dateRange.dateEnd
			}
		})
	},
	handleDealDate: function (selectYear) {
		let nextDates = moment(new Date(selectYear + 1, 0, 1)).isocalendar();
		let monthDays = nextDates[0] != selectYear ? (31 - nextDates[2]) : 31;
		let dates = moment(new Date(selectYear, 11, monthDays)).isocalendar();
		let weeks = dates[1];
		let year = dates[0];
		let datas = [];
		for (let i = 0; i < weeks; i++) {
			datas.push({
				value: i + 1,
				year: year,
				dateRange: moment.fromIsocalendar([year, i, 7, 0]).format('YYYY-MM-DD') + '/' + moment.fromIsocalendar([year, i + 1, 7, 0]).format('YYYY-MM-DD')
			})
		}
		return datas;
	},
	render: function () {
		const {yearRang, dateRange, left, right} = this.state;
		let select_1 = this.handleDealDate(yearRang.startYear);
		let select_2 = this.handleDealDate(yearRang.endYear);
		return (
			<div className="week_box">
				<div className="week_table">
					<div className="week_caption">
						{yearRang.startYear}
						<i className="fa fa fa-caret-left left"
						   onClick={this.handleSelectYear.bind(this, 'left')}
						>
						</i>
					</div>
					<div className="week_body">
						{select_1.map((item, i)=> {
							return (
								<span key={i}
									  className={(item.year + '-' + item.value) == (left.year + '-' + left.week) && 'active'}
									  onClick={this.handleSelectWeek.bind(this, 'left', item.year, item.value, item.dateRange)}>
                                 {item.value}
                             </span>
							)
						})}
					</div>
				</div>
				<div className="week_table">
					<div className="week_caption">
						{yearRang.endYear}
						<i className="fa fa fa-caret-right right"
						   onClick={this.handleSelectYear.bind(this, 'right')}
						>
						</i>
					</div>
					<div className="week_body">
						{select_2.map((item, i)=> {
							return (
								<span key={i}
									  className={(item.year + '-' + item.value) == (right.year + '-' + right.week) && 'active'}
									  onClick={this.handleSelectWeek.bind(this, 'right', item.year, item.value, item.dateRange)}>
                                 {item.value}
                             </span>
							)
						})}
					</div>
				</div>
			</div>
		)
	}
})
