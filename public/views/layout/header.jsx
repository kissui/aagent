'use strict';
import React from 'react';
import {router, Link} from 'react-router';
import _ from 'lodash';
import Auth from '../../lib/auth';
let data = [
	{
		id: 'game',
		title: '游戏数据',
		superItem: [
			{
				id: 'analysis',
				title: '基础分析'
			},
			// {
			// 	id: 'indicator',
			// 	title: '定制指标'
			// }
		]
	},
	// {
	// 	id: 'search',
	// 	title: '发现',
	// 	superItem: [
	// 		{
	// 			id: 'test',
	// 			title: 'test'
	// 		}
	// 	]
	// }
];
module.exports = React.createClass({
	render: function () {
		const {headerConf, active} = this.props;
		let firstTpl = null, secondTpl = null;
		if(active) {
			let index = _.findIndex(data, (attr=>{return attr.id == active.one}))
			let secondData = data[index].superItem;
			firstTpl = data.map((item, i)=> {
				return (
					<li key={i}>
						<Link to={'/app/' + item.id}
							  className={active.one == item.id && 'active'}>
							{item.title}
						</Link>
					</li>
				)
			});
			secondTpl = secondData.map((item, i)=> {
				return (
					<li key={i}>
						<Link to={'/app/' + active.one + '/' + item.id}
							  className={active.two == item.id && 'active'}>
							{item.title}
						</Link>
					</li>
				)
			})
		}

		return (
			<div className="bd-header">
				<div className="header-view">
					<div className="row">
						<div className="col-md-6">
							<div className="logo">
								<img src="/img/logo.png" alt="logo"/>
							</div>
							<ul className="navigation">
								{firstTpl}
							</ul>
						</div>
						<div className="col-md-6 text-right">
							dddd
						</div>
					</div>
				</div>
				<div className="header-s-view">
					<div className="s-nav">
						<ul>
							{secondTpl}
						</ul>
					</div>
				</div>
			</div>
		)
	}
})