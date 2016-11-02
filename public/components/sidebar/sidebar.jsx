'use strict';

import React from 'react';


module.exports = React.createClass({
	getInitialState: function () {
		return {
			defaultSidebar: null
		}
	},

	render: function () {
		const {
			sidebarBox, defaultSidebarData,
			sidebarItem, sidebarItemBox, sidebarSuperItem, icon
		} = this.props;
		if (!defaultSidebarData) return null;
		return (
			<div className="sidebar"
				 style={sidebarBox}>
				<ul className="sidebar_first">
					{defaultSidebarData.map((item, i)=> {
						return (
							<li key={i} style={sidebarItem}>
								<i className={icon[i] ? icon[i].className : '' }>
								</i>
								<a>{item.title}</a>
								<i className="fa fa-angle-right angle">
								</i>
								<ul className="sidebar_second" style={sidebarItemBox}>
									{item.tables.map((superItem, superI)=> {
										return (
											<li key={superI} style={sidebarSuperItem}>
												{superItem.title}
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