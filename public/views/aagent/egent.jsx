'use strict';

import React from 'react';
import SidebarPage from '../../components/sidebar/sidebar';
import ContainerPage from './container';
import http from '../../lib/http';
import HeaderPage from './layout/header';
module.exports = React.createClass({
	contextTypes: {
		router: React.PropTypes.object.isRequired
	},
	getInitialState: function () {
		return {
			data: null
		}
	},
	componentWillMount: function () {
		// http.get('/api/?c=table.folder&ac=tree').then(data=>data.data).then(response=> {
		// 	this.setState({
		// 		data: response.data
		// 	})
		// })
	},
	handleSidebarDetail: function (item) {
		if (!item) return;
		this.setState({
			'menu': item
		});
		//this.context.router.push({
		//pathname: '/app/aagent',
		//query: {
		//'menu': item,
		//}
		//});
	},
	render: function () {
		let data = this.state.data;
		let icon = [
			{className: 'fa fa-bar-chart'},
		];
		return (
			<div>
				<HeaderPage headerConf={HeaderData}/>
				<div className="bd-body">
					<SidebarPage
						icon={icon}
						sidebarBox={{
							background: '#32586e ',
							color: '#fff',
							borderRadius: '4px',
							padding: '5px',
							width: '220px',
							minHeight: '1000px'
						}}
						defaultSidebarData={data}
						sidebarItem={{
							background: '#2f5468',
							padding: '4px 10px 0',
							position: 'relative',
							fontSize: '16px',
							borderTop: '1px solid #36627c'

						}}
						sidebarItemBox={{
							fontSize: '13px',
							borderTop: '1px solid #36627c'
						}}
						onReceiveDefaultSidebarData={this.handleSidebarDetail}
					/>
					<ContainerPage onMenu={this.state.menu}/>
				</div>
			</div>
		)
	}
});