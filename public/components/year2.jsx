'use strict';
import React from 'react';
import moment from 'moment';
import momentISO from 'moment-isocalendar';
module.exports = React.createClass({
	getInitialState: function () {
		const {dateRange} = this.props;
		let current = moment(new Date()).format('YYYY-MM');
		// let dateRange = {
		// 	startDate: '2016-4',
		// 	endDate: '2016-11'
		// };
		return {
			initialEvent: false,
			eventAccount: 0,
			isShowRangeYear: dateRange && dateRange.startDate ? true : false, // 是否显示跨年的区间
			selectSingleRange: (dateRange && dateRange.startDate) ?
				(dateRange.startDate.split('-')[0] == dateRange.endDate.split('-')[0] ?
					[dateRange.startDate.split('-')[1], dateRange.endDate.split('-')[1]] : null) : null,
			selectTable: (dateRange && dateRange.startDate) ?
				(dateRange.startDate.split('-')[0] == dateRange.endDate.split('-')[0] ? dateRange.endDate.split('-')[0] : null) : null,
			singleTable: false,
			dateRange: {
				startDate: dateRange && !(dateRange.startDate.split('-')[0] == dateRange.endDate.split('-')[0]) ? dateRange.startDate : null,
				endDate: dateRange && dateRange.endDate ? dateRange.endDate : current
			},
			yearRang: {
				startYear: (dateRange && dateRange.startDate) ?
					(dateRange.startDate.split('-')[0] == dateRange.endDate.split('-')[0] ?
					dateRange.startDate.split('-')[0] - 1 : dateRange.startDate.split('-')[0] ) : current.split('-')[0] - 1,
				endYear: dateRange && dateRange.endDate ? dateRange.endDate.split('-')[0] : current.split('-')[0],
			}
		}
	},
	componentWillMount: function () {
		const {selectSingleRange, dateRange} = this.state;
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
							startDate: year + '-' + week,
							endDate: dateRange.endDate,
							selectSingleRange: selectSingleRange
						}
					})
				} else if (year === yearRang.endYear) {
					this.setState({
						dateRange: {
							startDate: dateRange.startDate,
							endDate: year + '-' + week,
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
							startDate: year + '-' + week,
							endDate: isShowRangeYear ? '' : dateRange.endDate
						}
					})
				} else if (year === yearRang.endYear) {
					this.setState({
						dateRange: {
							startDate: isShowRangeYear ? '' : dateRange.startDate,
							endDate: year + '-' + week
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
						startDate: year + '-' + week,
						endDate: ''
					}
				})
			} else if (year === yearRang.endYear) {
				this.setState({
					dateRange: {
						startDate: '',
						endDate: year + '-' + week
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
		const {yearRang, dateRange} = this.state;
		this.setState({
			yearRang: {
				startYear: direction === 'right' ? ~~yearRang.startYear + 1 : ~~yearRang.startYear - 1,
				endYear: direction === 'right' ? ~~yearRang.endYear + 1 : ~~yearRang.endYear - 1
			},
			dateRange: {
				startDate: dateRange.startDate,
				endDate: '',
			}
		})
	},
	handleDealDate: function (selectYear, select) {
		select = select ? select.split('-')[1] : null;
		let datas = [];

		for (let i = 1; i < 13; i++) {
			datas.push({
				value: i,
				year: selectYear,
				select: select,
				dateRange: selectYear + "-" +select
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
				<div className="week_table table">
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
										  (i + 1 == selectSingleRange[0] || i + 1 == selectSingleRange[1]) ? 'active' :
										  (i + 1 > selectSingleRange[0] && i + 1 < selectSingleRange[1]) && 'range' :
										  (item.value == item.select ? 'active' :
											  (isShowRange && item.select && i >= item.select) ? 'range' : '')}
									  onClick={this.handleSelectWeek.bind(this, 'left', item.year, item.value, item.dateRange)}>
                                 {item.value}
                             </span>
							)
						})}
					</div>
				</div>
				<div className="week_table table">
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
										  (i + 1 == selectSingleRange[0] || i + 1 == selectSingleRange[1]) ? 'active' :
										  (i + 1 > selectSingleRange[0] && i + 1 < selectSingleRange[1]) && 'range' :
										  (item.value == item.select ? 'active' :
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
