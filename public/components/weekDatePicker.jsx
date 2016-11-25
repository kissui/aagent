'use strict';
import React from 'react';
import moment from 'moment';
import momentISO from 'moment-isocalendar';
module.exports = React.createClass({
	getInitialState: function () {
		const {dateRange} = this.props;
		// let dateRange = {
		// 	startDate: [2015, 42, 7, 0],
		// 	endDate: [2016, 47, 3, 0]
		// };
		let current = moment(new Date()).isocalendar();
		return {
			initialEvent: false,
			eventAccount: 0,
			isShowRangeYear: dateRange && dateRange.startDate ? true : false, // 是否显示跨年的区间
			selectSingleRange: (dateRange && dateRange.startDate) ?
				(dateRange.startDate[0] == dateRange.endDate[0] ? [dateRange.startDate[1], dateRange.endDate[1]] : null) : null,
			selectTable: (dateRange && dateRange.startDate) ?
				(dateRange.startDate[0] == dateRange.endDate[0] ? dateRange.endDate[0] : null) : null,
			singleTable: false,
			dateRange: {
				startDate: dateRange && !(dateRange.startDate[0] == dateRange.endDate[0]) ? dateRange.startDate : null,
				endDate: dateRange && dateRange.endDate ? dateRange.endDate : current
			},
			yearRang: {
				startYear: (dateRange && dateRange.startDate) ?
					(dateRange.startDate[0] == dateRange.endDate[0] ? dateRange.startDate[0] - 1 : dateRange.startDate[0] ) : current[0] - 1,
				endYear: dateRange && dateRange.endDate ? dateRange.endDate[0] : current[0],
			}
		}
	},
	componentWillMount: function () {
		const {selectSingleRange,dateRange} = this.state;
		this.props.onReceiveWeekRange(dateRange, selectSingleRange);
	},
	handleSelectWeek: function (index, year, week, range) {
		const {initialEvent, yearRang, dateRange, eventAccount, selectTable, isShowRangeYear, selectSingleRange} = this.state;
		if (initialEvent) {
			if (selectTable === year) {
				if (week > selectSingleRange[0]) {
					selectSingleRange.push(week)
				} else {
					selectSingleRange.unshift(week)
				}
				if (year === yearRang.startYear) {
					this.setState({
						dateRange: {
							startDate: [year, week, 7, 0],
							endDate: dateRange.endDate,
							selectSingleRange: selectSingleRange
						}
					})
				} else if (year === yearRang.endYear) {
					this.setState({
						dateRange: {
							startDate: dateRange.startDate,
							endDate: [year, week, 7, 0],
							selectSingleRange: selectSingleRange
						}
					})
				}
				this.setState({
					singleTable: true
				});
			} else {
				if (year === yearRang.startYear) {
					this.setState({
						dateRange: {
							startDate: [year, week, 7, 0],
							endDate: isShowRangeYear ? '' : dateRange.endDate
						}
					})
				} else if (year === yearRang.endYear) {
					this.setState({
						dateRange: {
							startDate: isShowRangeYear ? '' : dateRange.startDate,
							endDate: [year, week, 7, 0]
						}
					})
				}
			}
			if (isShowRangeYear) {
				this.setState({
					selectTable: year,
					selectSingleRange: [week]
				})
			}
		setTimeout(()=>{this.props.onReceiveWeekRange(this.state.dateRange,selectSingleRange)},40);
		} else {
			if (year === yearRang.startYear) {
				this.setState({
					dateRange: {
						startDate: [year, week, 7, 0],
						endDate: ''
					}
				})
			} else if (year === yearRang.endYear) {
				this.setState({
					dateRange: {
						startDate: '',
						endDate: [year, week, 7, 0]
					}
				})
			}
			this.setState({
				selectTable: year,
				selectSingleRange: [week]
			});
			setTimeout(()=>{this.props.onReceiveWeekRange(this.state.dateRange,true,range)},40);
		}
		this.setState({
			initialEvent: !initialEvent,
			eventAccount: eventAccount + 1,
			isShowRangeYear: false
		});

	},
	handleSelectYear: function (direction) {
		const {yearRang,dateRange} = this.state;
		this.setState({
			yearRang: {
				startYear: direction === 'right' ? yearRang.startYear + 1 : yearRang.startYear - 1,
				endYear: direction === 'right' ? yearRang.endYear + 1 : yearRang.endYear - 1
			},
			dateRange: {
				startDate: dateRange.startDate,
				endDate: '',
			}
		})
	},
	handleDealDate: function (selectYear, select, direction) {
		select = select ? select[1] : null;
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
				select: select,
				dateRange: moment.fromIsocalendar([year, i, 7, 0]).format('YYYY-MM-DD') + '/' + moment.fromIsocalendar([year, i + 1, 7, 0]).format('YYYY-MM-DD')
			})
		}
		return datas;
	},
	render: function () {
		const {yearRang, dateRange, eventAccount, selectTable, selectSingleRange, isShowRangeYear} = this.state;
		let isShowRange = isShowRangeYear ? true : (eventAccount == 0 ? false : !(eventAccount % 2));
		let isShowSingleRange = selectSingleRange && selectSingleRange.length === 2 ? true : false;
		let select_1 = this.handleDealDate(yearRang.startYear, dateRange.startDate);
		let select_2 = this.handleDealDate(yearRang.endYear, dateRange.endDate);
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
									  className={isShowSingleRange && selectTable == yearRang.startYear ?
										  (i + 1 === selectSingleRange[0] || i + 1 === selectSingleRange[1]) ? 'active' :
										  (i + 1 > selectSingleRange[0] && i + 1 < selectSingleRange[1]) && 'range' :
										  (item.value === item.select ? 'active' :
											  (isShowRange && item.select && i >= item.select) ? 'range' : '')}
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
									  className={isShowSingleRange && selectTable === yearRang.endYear ?
										  (i + 1 === selectSingleRange[0] || i + 1 === selectSingleRange[1]) ? 'active' :
										  (i + 1 > selectSingleRange[0] && i + 1 < selectSingleRange[1]) && 'range' :
										  (item.value === item.select ? 'active' :
											  (isShowRange && item.select && i + 1 <= item.select) ? 'range' : '')}
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
});
