'use strict';
import React from 'react';
import DatePickerPage from '../datePage';

/**
 * @TODO 各个模块初始化的header展示及其时间区间的回调
 * @DEMO
 * <ViewNav
 *     defaultText="累计数据"
 *     onReceiveDateRange={this.handleGetDateRange}
 *     isShowDateRange={true} //可以
 *     onDateBoxSty={{inputSty:'',boxSty:''}}
 *     isShowIconOrIconClass='fa fa-paw'
 *     onDateRange={{
 *					start: '',
 *					end: ''
 *				}}
 * />
 * @props onDateBoxSty => 日历控件的UI配置 inputSty,boxSty两个属性
 * @props isShowIconOrIconClass => 是否显示icon default=true class = 'fa fa-paw'
 * @props defaultText => 默认模块title type string
 * @props onReceiveDateRange => 向父组件传递参数 start,end
 * @props isShowDateRange => 默认header是否显示时间组件 default = false
 * @props onDateRange => 由父组件向子组件传递默认时间区间 start format '11/11/2016'
 * @type {any}
 */
module.exports = React.createClass({
	getInitialState: function () {
		return {
			preDefined: {}
		}
	},
	handleReceiveDateRange: function (start, end) {
		const format = 'YYYY-MM-DD';
		this.setState({
			preDefined: {
				start: start.format(format).toString(),
				end: end.format(format).toString()
			}
		});
		this.props.onReceiveDateRange(start, end, this.props.defaultText);
	},
	render: function () {
		const {preDefined} = this.state;
		const {
			isShowDateRange,
			isShowDateForm,
			defaultText,
			onDateRange,
			onDateBoxSty,
			isShowIconOrIconClass
		} = this.props;
		return (
			<div className="view-navigation">
				<div className="nav-left">
					<h2>
						<i className={isShowIconOrIconClass ? isShowIconOrIconClass : 'fa fa-paw'}>
						</i>
						{defaultText}
						{isShowDateRange ? <span className="dateRange">
								{preDefined.start} 至 {preDefined.end}
							</span> : null}
					</h2>
				</div>
				{isShowDateForm ? null : <div className="nav-right">
					<DatePickerPage
						onReceiveData={this.handleReceiveDateRange}
						isShowRange={false}
						onDefaultDateRange={{
							start: onDateRange.start,
							end: onDateRange.end
						}}
						singleStyle={{
							width: onDateBoxSty ? onDateBoxSty.inputSty : '90px'
						}}
						dateInputStyle={{
							width: onDateBoxSty ? onDateBoxSty.boxSty : '230px'
						}}
					/>
				</div>}
			</div>

		)
	}
});