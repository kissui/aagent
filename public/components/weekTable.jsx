'use strict';
import React from 'react';

module.exports = React.createClass({
	handleInitialRange: function (dataRange) {
		let start = dataRange.start;
		let end = dataRange.end;
		return [
			{
				year: start.year,
				weeks: this.handleDealDate(start.year),
				selected: start.select,
				range: start.select
			},
			{
				year: end.year,
				weeks: this.handleDealDate(end.year),
				selected: end.select,
				range: end.select
			}
		]
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
		let tables = this.handleInitialRange({
			start: {
				year: 2015,
				select: 48
			},
			end: {
				year: 2016,
				select: 4
			}
		});

		return (
			<div className="week_table">
				{tables.map((item, i)=> {
					return (
						<div key={i}>
							<div className="week_caption">
								{item.year}
								<i className="fa fa fa-caret-left left"
								   onClick={this.handleSelectYear.bind(this, item.year)}
								>
								</i>
							</div>
							<div className="week_body">
								{item.weeks.map((w_item, w)=> {
									return (
										<span key={w}
											  className={w_item.value == item.select ? 'active' :
												  item.range ? 'range' : ''}
											  onClick={this.handleSelectWeek.bind(this, 'left', w_item.year, w_item.value)}>
                                 			{w_item.value}
                             			</span>
									)
								})}
							</div>
						</div>
					)
				})}

			</div>
		)
	}
});