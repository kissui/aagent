'use strict';

import React from 'react';
import moment from 'moment';

module.exports = React.createClass({
	getInitialState: function () {
		let current = moment(new Date()).format('MM');
		let year = moment(new Date()).format('YYYY');
		// const {dateRange} = this.props;
		let dateRange={
			start: '2016-4',
			end: '2016-11',
		};
		return {
			yearRange: {
				start: year-1,
				end: year
			},
			monthRange: {
				start: current - 7,
				end: current
			},
		}
	},
	handleDealDate: function (selectYear, selected) {
		let datas = [];
		for (let i = 1; i < 13; i++) {
			i = i > 9 ? i : '0' + i;
			datas.push({
				date: selectYear + '-' + i + '01',
				month: i,
				selected: selected == i ? true : false
			})
		}
		return datas;
	},
	handleSelectYear: function (dir_type) {

	},
	render: function () {
		const {yearRange,monthRange} = this.state;
		let start = this.handleDealDate(yearRange.start, monthRange.start);
		let end = this.handleDealDate(yearRange.end, monthRange.end);
		console.log(start);
		return (
			<div className="year-box">
				<div className="year-table table">
					<div className="week_caption">
						{yearRange.start}
						<i className="fa fa fa-caret-left left"
						   onClick={this.handleSelectYear.bind(this, 'left')}
						>
						</i>
					</div>
					<div className="year-body">
						{start.map((item, i)=> {
							return <span className={item.selected && 'active'}
										 key={i}>
								{item.month}
							</span>
						})}
					</div>
				</div>
				<div className="year-table table">
					<div className="week_caption">
						{yearRange.end}
						<i className="fa fa fa-caret-right right"
						   onClick={this.handleSelectYear.bind(this, 'left')}
						>
						</i>
					</div>
					<div className="year-body">
						{end.map((item, i)=> {
							return <span className={item.selected && 'active'}
										 key={i}>
								{item.month}
							</span>
						})}
					</div>
				</div>
			</div>
		)
	}
});