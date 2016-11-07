'use strict';
import React from 'react';
module.exports = React.createClass({
	componentDidMount: function () {
		let data = this.props.onData;
		this.handleShowChart('c4',data);
		this.handleShowChart('c5',data);
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
	render: function () {
		return (
			<div className="new-user row">
				<div className="col user-view">
					<p className="title">
						<i className=" icon fa fa-user-plus"></i>
						累计新增账号/角色
					</p>
					<p className="number">23112</p>
				</div>
				<div className="col user-view">
					<p className="title">
						<i className=" icon fa fa-user"></i>
						(平均)次日留存/7日留存/15日留存
					</p>
					<p className="number">23112</p>
				</div>
				<div className="col user-view br-none">
					<p className="title">
						<i className=" icon fa fa-user-times"></i>
						(平均)1日LTV/7日LTV/15日LTV/30日LTV
					</p>
					<p className="number">23112</p>
				</div>
				<div className="everyday-chart row">
					<div className="col-user">
						<h2>登录新增</h2>
						<div id="c4" className="showChart"></div>
					</div>
					<div className="col-user">
						<h2>付费情况</h2>
						<div id="c5" className="showChart"></div>
					</div>
				</div>
			</div>
		)
	}
});