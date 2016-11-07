'use strict';

import React from 'react';
import _ from 'lodash';
module.exports = React.createClass({
	getInitialState: function () {
		return {
			sum: {},
			mean: {}
		}
	},
	componentDidMount: function () {
		let data = this.props.onDefaultEveryday;
		this.handleAccountData(data);
		this.handleShowChart('c1',data);
		this.handleShowChart('c2',data);
		this.handleShowChart('c3',data);
	},
	handleShowChart: function (id,data) {
		var chart = new G2.Chart({
			id: id,
			forceFit: true,
			height: 200,
			plotCfg: {
				margin: [0, 0, 30, 0]
			}
		});
		var Frame = G2.Frame;
		var frame = new Frame(data);
		frame = Frame.combinColumns(frame,['acu','cnt_login'],'population', 'kpi', ['dateid','arpu']);
		chart.legend(false);
		chart.source(frame);
		chart.interval(['dodge', 'stack']).position('dateid*population').color('kpi'); // 使用图形语法绘制柱状图
		chart.line().position('dateid*arpu').color('red');
		chart.render();
	},
	handleAccountData: function (data) {

		let sum = {
			ac_cash: _.sumBy(data, (o)=> {
				return parseFloat(o.cash)
			}),
			ac_new: _.sumBy(data, (o)=> {
				return parseFloat(o.cnt_new)
			})
		};
		let mean = {
			mean_account: _.meanBy(data, (m)=> {
				return parseFloat(m.cnt_login)
			}),
			mean_cash: _.meanBy(data, (m)=> {
				return parseFloat(m.pay_rate)
			})
		};
		mean.mean_account = Math.ceil(mean.mean_account);
		mean.mean_cash = (mean.mean_cash * 100).toFixed(2);
		this.setState({
			sum: sum,
			mean: mean
		})
	},
	render: function () {
		const {sum, mean} = this.state;
		return (
			<div>
				<div className="everyday-box row">
					<div className="col b-view">
						<p className="title">
							<i className=" icon fa fa-dollar"></i>
							累计付费金额（元）
						</p>
						<p className="number">{sum.ac_cash}</p>
					</div>
					<div className="col b-view">
						<p className="title">
							<i className=" icon fa fa-user-plus"></i>
							累计新增账号/角色
						</p>
						<p className="number">{sum.ac_new}</p>
					</div>
					<div className="col b-view">
						<p className="title">
							<i className=" icon fa fa-user-o"></i>
							日均登录账号/角色
						</p>
						<p className="number">{mean.mean_account}</p>
					</div>
					<div className="col b-view br-none">
						<p className="title">
							<i className=" icon fa fa-money"></i>
							日均付费率
						</p>
						<p className="number">{mean.mean_cash}%</p>
					</div>
				</div>
				<div className="everyday-chart row">
					<div className="col">
						<h2>登录新增</h2>
						<div id="c1" className="showChart"></div>
					</div>
					<div className="col">
						<h2>付费情况</h2>
						<div id="c2" className="showChart"></div>
					</div>
					<div className="col">
						<h2>在线留存</h2>
						<div id="c3" className="showChart"></div>
					</div>
				</div>
			</div>
		)
	}
});