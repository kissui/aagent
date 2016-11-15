'use strict';

import React from 'react';
import SidebarPage from '../../components/sidebar/sidebar';
import http from '../../lib/http';
import ContentPage from './content';
import HeaderPage from '../layout/header';
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
	},
	handleSidebarDetail: function (item, flag) {
		if (!item) return;
		console.log(item);
		this.setState({
			'menu': item
		});
	},
	render: function () {
		const {data, menu} = this.state;
		let defaultConf = null;
		if (menu) {
			let locationStates = this.props.location.state;
			defaultConf = {
				one: 'game',
				two: locationStates ? locationStates.two : 'analysis'
			};
		}
		let icon = [
			{className: 'fa fa-bar-chart'},
		];
		return (
			<div>
				<HeaderPage headerConf={null} active={defaultConf}/>

				<div className="bd-body">

					<SidebarPage
						icon={icon}
						sidebarBox={{
							background: '#32586e ',
							color: '#fff',
							borderRadius: '4px',
							padding: '5px',
							width: '220px',
							minHeight: '1000px',
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
						sidebarDefault={{
							second: 'recentAnalysis'
						}}
						onReceiveDefaultSidebarData={this.handleSidebarDetail}
					/>
					<ContentPage/>
				</div>
			</div>
		)
	}
});