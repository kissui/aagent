'use strict';

import React from 'react';
import SidebarPage from '../../components/sidebar/sidebar';
import ContainerPage from './container';
import http from '../../lib/http';
import Auth from '../../lib/auth';
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
		Auth.loggedIn(msg=> {
			if (msg != 0) {
				this.context.router.push('/app/login')
			} else {
				http.get('/dudai/?c=analysis.report&ac=gamelist&token=mgame_afs23cgs23')
					.then(res=>res.data)
					.then(res=> {
						console.log(res, '@gameNamesss');
						if (res.error_code === 0 && res.data.length > 0) {
							this.setState({
								gameConf: {
									gameList: res.data,
									gameId: res.data[0].value
								}
							})
						}

					})
			}
		});

	},
	handleSidebarDetail: function (item) {
		if (!item) return;
		this.setState({
			'menu': item
		});
	},
	render: function () {
		const {data, menu, gameConf} = this.state;
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
					<ContainerPage onMenu={this.state.menu} gameConf={gameConf}/>
				</div>
			</div>
		)
	}
});