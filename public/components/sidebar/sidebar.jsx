'use strict';

import React from 'react';

import Router, {Link, History} from 'react-router';

const defaultSidebarData = [
	{
		'title': '概况',
		'id': 1,
		'tables': [
			{
				'title': '实时数据',
				'ev': 'realTime',
				'link': '/app/realTime'
			},
			{
				'title': '运营报表',
				'ev': 'report',
				'link': '/app/aagent'
			},
			{
				'title': '近期概况分析',
				'ev': 'recentAnalysis',
				'link': '/app/analysis'
			}

		]
	},
	{
		'title': '留存分析',
		'id': 2,
		tables: [
			{
				'title': '留存分析',
				'ev': 'keeper',
				'link': '/app/keeper'
			}
		]

	}
];
module.exports = React.createClass({
	getInitialState: function () {
		let {sidebarDefault} = this.props;
		return {
			defaultSidebar: sidebarDefault ? sidebarDefault : {
				second: 'report'
			},
			['isShow_1']: true
		}
	},
	componentDidMount: function () {
		this.props.onReceiveDefaultSidebarData(this.state.defaultSidebar.second)
	},
	handleSelectFirst: function (index) {
		this.setState({
			['isShow_' + index]: !this.state['isShow_' + index]
		})
	},
	handleSelectSuperItem: function (item) {
		this.setState({
			defaultSidebar: {
				second: item
			}
		});
		this.props.onReceiveDefaultSidebarData(item,true);
	},
	render: function () {
		const {
			sidebarBox,
			sidebarItem,
			sidebarItemBox,
			sidebarSuperItem,
			icon
		} = this.props;
		const {defaultSidebar} = this.state;
		if (!defaultSidebarData) return null;
		return (
			<div className="sidebar"
				 style={sidebarBox}>
				<ul className="sidebar_first">
					{defaultSidebarData.map((item, i)=> {
						return (
							<li key={i}
								style={sidebarItem}>
								<i className={icon[i] ? icon[i].className : '' }></i>
								<a onClick={this.handleSelectFirst.bind(this, item.id)}>{item.title}</a>
								<i className={this.state['isShow_' + item.id] ? "fa fa-angle-down angle" :
									"fa fa-angle-right angle"}>
								</i>
								<ul className={this.state['isShow_' + item.id] ? "sidebar_second" : 'hide'}
									style={sidebarItemBox}>
									{item.tables.map((superItem, superI)=> {
										return (
											<li key={superI}
												onClick={this.handleSelectSuperItem.bind(this, superItem.ev)}
												style={sidebarSuperItem}>
												<Link to={superItem.link}
													  className={defaultSidebar.second === superItem.ev && 'active'}>
													{superItem.title}
												</Link>

											</li>
										)
									})}
								</ul>
							</li>
						)
					})}
				</ul>
			</div>
		)
	}
});