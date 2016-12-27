'use strict';

import React from 'react';
import _ from 'lodash';
const defaultRoll = [
	{
		title: '账号',
		value: 'account'
	},
	{
		title: '角色',
		value: 'role'
	},
	{
		title: '设备',
		value: 'device'
	}
];
module.exports = React.createClass({
	getInitialState: function () {
		const {rollRange,gameId} = this.props;

		let index = gameId && _.findIndex(rollRange,(item)=>{
			return item.value == gameId;
		});
		return {
			defaultSelect: rollRange ? rollRange[index] : {
				title: '账号',
				value: 'account'
			},
			defaultRollList: rollRange ? rollRange : defaultRoll,
			isShow: false
		}
	},
	handleSelectRoll: function (value, title) {
		const {defaultSelect, isShow} = this.state;
		if (defaultSelect.value === value) return;
		this.setState({
			defaultSelect: {
				value: value,
				title: title
			},
			isShow: !isShow
		});
		this.props.onReceiveRollValue(value);
	},
	handleToggleDisplay: function () {
		this.setState({
			isShow: !this.state.isShow
		})
	},
	handleToggleDisplayNone: function () {
		this.setState({
			isShow: false
		})
	},
	render: function () {
		const {defaultSelect, isShow, defaultRollList} = this.state;
		const {onStyle} = this.props;
		let content = defaultRollList.map((item, i)=> {
			return (
				<li key={i}
					className={defaultSelect.value == item.value && "active"}
					onClick={this.handleSelectRoll.bind(null, item.value, item.title)}
				>
					{item.title}
				</li>
			)
		});
		return (
			<div className="select_roll" style={onStyle} onMouseLeave={this.handleToggleDisplayNone}>
				<div className="roll_block" onClick={this.handleToggleDisplay}>
					{defaultSelect.title}
					<i className={isShow ? "fa fa-caret-up" :"fa fa-caret-down"}></i>
				</div>
				<ul className={isShow ? "roll_box" : "hide"} >
					{content}
				</ul>
			</div>
		)
	}
});
