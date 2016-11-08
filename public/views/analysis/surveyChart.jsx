'use strict';

import React from 'react';

module.exports = React.createClass({
	componentWillMount: function () {
		const {onChartData, onChartConf} = this.props;
		let chartConf = onChartConf ? onChartConf : ["登录帐号", "新增帐号数"];
		this.handleShowChart(onChartData, chartConf);

	},

	render: function () {
		return (
			<div id="c1">
					11111
			</div>
		)
	}
});