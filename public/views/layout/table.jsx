'use strict';

import React from 'react';
import Reg from '../../components/chart';
module.exports = React.createClass({
	getInitialState: function () {
		const {bodys} = this.props;
		let lists = bodys.length;
		return {
			limit: 10,
			current: 0,
			bodys: bodys,
			defaultBody: bodys.slice(0, 10),
			pre: null,
			next: 1,
			pages: Math.ceil(lists / 10),
		}
	},
	componentWillReceiveProps: function (nextProps) {
		if (nextProps.bodys) {
			let bodys = nextProps.bodys;
			let lists = bodys.length;
			this.setState({
				limit: 10,
				current: 0,
				bodys: bodys,
				defaultBody: bodys.slice(0, 10),
				pre: null,
				next: 1,
				pages: Math.ceil(lists / 10),
			})
		}
	},
	handleChangePage: function (page) {
		const {bodys} = this.state;
		this.setState({
			current: page - 1,
			defaultBody: bodys.slice((page - 1) * 10, 10 * page)
		})
	},
	handleChangePre: function (pre) {
		const {current, bodys, pages} = this.state;
		if (current === 0) return;
		this.setState({
			current: current - 1,
			defaultBody: bodys.slice(10 * (current - 1), 10 * current)
		})
	},
	handleChangeNext: function (next) {
		const {current, bodys, pages} = this.state;
		if (current + 1 === pages) return;
		this.setState({
			current: current + 1,
			defaultBody: bodys.slice(10 * current, 10 * (current + 1))
		})
	},
	handleActiveEle: function (args, index) {
		let acArgs = [1];
		if (args && args.length > 0) {
			acArgs = args;
		} else if (args && args.length === 0) {
			return null
		}
		for (let i = 0; i < acArgs.length; i++) {
			if (index == acArgs[i]) {
				return 'active';
			}

		}
	},
	render: function () {
		const {heads, onActive} = this.props;
		const {defaultBody, pre, next, pages, current} = this.state;
		let pageList = [];
		for (let i = 0; i < pages; i++) {
			pageList.push(
				<li key={i}
					onClick={this.handleChangePage.bind(this, i + 1)}
					className={current === i ? "page-icon active" : "page-icon"}>
					{i + 1}
				</li>
			);
		}

		return (
			<div className='table-box'>
				<table className="table table-striped">
					<thead>
					<tr className="text-center">
						{heads ? heads.map((item, i)=> {
							return (
								<th key={i}>{item}</th>
							)
						}) : null}
					</tr>
					</thead>
					<tbody>
					{defaultBody ? defaultBody.map((items, i)=> {
						return (
							<tr key={i}>
								{items.map((item, si)=> {
									return (
										<td key={si}
											className={this.handleActiveEle(onActive, si)}>
											{si === 0 && /\%/.test(item) ? item.split('%')[0] : item ? item : '-'}
										</td>
									)
								})}
							</tr>
						)
					}) : null}
					</tbody>
				</table>
				<div className={pages > 1 ? "bd-pagination" : "hide"}>
					<div className="pre-page page-icon" onClick={this.handleChangePre.bind(this, pre)}>
						<i className="fa fa-angle-left"></i>
					</div>
					<ul className="list-page">
						{pageList}
					</ul>
					<div className="next-page page-icon" onClick={this.handleChangeNext.bind(this, next)}>
						<i className="fa fa-angle-right"></i>
					</div>
				</div>
			</div>

		)
	}
});
