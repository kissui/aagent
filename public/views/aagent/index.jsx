'use strict';

import React from 'react';
import SidebarPage from '../../components/sidebar/sidebar';
import ContainerPage from './container';
import http from '../../lib/http';
module.exports = React.createClass({
	getInitialState: function () {
		return {
			data: null
		}
	},
	componentWillMount: function () {
		http.get('/api/?c=table.folder&ac=tree').then(data=>data.data).then(response=> {
			console.log(response, '@data');
			this.setState({
				data: response.data
			})
		})
	},
	render: function () {
		let data = this.state.data;
		let icon = [
			{className: 'fa fa-bar-chart'},
		];
		return (
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
						position:'absolute',
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
				/>
				<ContainerPage/>
			</div>
		)
	}
});