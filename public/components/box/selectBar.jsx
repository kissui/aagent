'use strict';
 import React from 'react';
/**
 * @todo 切换选择按钮
 * @DEMO
 * <SelectBar
 *     onSelectBarData={selectBarData}
 *     onReceiveValue={this.handleReceiveSelectCycle}
 *     onDefaultValue={'day'}
 * />
 * @props onSelectBarData type Array
 * {
		title: '全部', 显示文案
		value: 'all', 触发时传送的值
		type: 'text'  当前字段的的类型 text就是纯文本,class时,title要接收字体类
	},
 * @props onReceiveValue 默认组件返回的参数。供请求数据,事件操作提供参数
 * @props onDefaultValue 组件默认的
 *
 * @type {any}
 */
module.exports = React.createClass({
	getInitialState: function () {
		return {
			changeValue: this.props.onDefaultValue
		}
	},
	componentDidMount: function () {
		let value = this.props.onDefaultValue;
		this.props.onReceiveValue(value)
	},
	handleSelect: function (value) {
		this.setState({
			changeValue: value
		});
		this.props.onReceiveValue(value)
	},
	render: function () {
		const {onSelectBarData, onSelectBarStyle} = this.props;
		let onDefaultValue = this.state.changeValue;
		return (
			<ul className="select-bar" style={onSelectBarStyle}>
				{onSelectBarData.map((item, i)=> {
					return (
						<li className={onDefaultValue === item.value && 'active'}
							key={i}
							onClick={this.handleSelect.bind(this, item.value)}>
							{item.type === 'class' ? <i className={item.title}></i> : item.title}
						</li>
					)
				})}
			</ul>
		)
	}
});