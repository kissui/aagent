'use strict';
import React from 'react';
import ViewNav from '../../components/box/navHeader';
import moment from 'moment';
import http from '../../lib/http';
import Chart from '../../components/chart';
import LoadingPage from '../../components/is_loading';
module.exports = React.createClass({
	getInitialState: function () {
		const {onDevice, onCycle, onGameId} = this.props;
		let defaultRange = 3600 * 24 * 7 * 1000;
		let endRange = +new Date();
		let startRange = endRange - defaultRange;
		let format = 'YYYY-MM-DD';
		return {
			dateRange: {
				dateStart: moment(new Date(startRange)).format(format).toString(),
				dateEnd: moment(new Date()).format(format).toString()
			},
			globalConf: {
				cycle: onCycle,
				device: onDevice,
				gameId: onGameId
			}
		}
	},
	componentWillMount: function () {
		const {dateRange, globalConf} = this.state;
		this.getInitialData(globalConf, dateRange);
	},
	componentWillReceiveProps: function (nextProps) {
		const {dateRange, globalConf} = this.state;
		if (nextProps.onCycle === globalConf.cycle && nextProps.onDevice === globalConf.device && nextProps.onGameId === globalConf.gameId) return;
		const receivePropsConf = {
			cycle: nextProps.onCycle,
			device: nextProps.onDevice,
			gameId: nextProps.onGameId
		};
		this.setState({
			globalConf: receivePropsConf,
			isLoading: true
		});
		this.getInitialData(receivePropsConf, dateRange);
	},
	getInitialData: function (globalConf, dateConf) {
		let data = {
			"cycle": globalConf.cycle,
			"device": globalConf.device,
			"weidu": "role",
			"appid": globalConf.gameId,

			"kpi_conf": {
				"accumulate": {
					"start": dateConf.dateStart,
					"end": dateConf.dateEnd,
					"kpis": [
						{
							'meta_id': '2816',
							'name': '新增账号数'
						},
						{
							'meta_id': '2819',
							'name': '充值收入(元)'
						}
					]
				}
			}
		};
		http.get('/dudai/?c=analysis.report&ac=get&token=mgame_afs23cgs23', {params: data})
			.then(data=>data.data)
			.then(res=> {
				if (res.error_code === 0) {
					this.setState({
						accumulate: Chart.dealChartData(res.data.accumulate.theads, res.data.accumulate.table),
						isLoading: false
					})
				}

			})
	},
	handleGetDateRange: function (start, end, title) {
		console.log(start, end, title);
		const {globalConf} = this.state;
		let dateConf = {
			dateStart: start,
			dateEnd: end
		};
		this.setState({
			dateRange: {
				dateStart: start,
				dateEnd: end
			},
			isLoading: true
		});
		this.getInitialData(globalConf, dateConf);
	},
	render: function () {
		let {accumulate, isLoading} = this.state;
		let ac_cash, ac_new;
		if (accumulate) {
			ac_cash = _.sumBy(accumulate, (o)=> {
				return parseFloat(o['充值收入(元)'])
			});
			ac_new = _.sumBy(accumulate, (o)=> {
				return o['新增账号数']
			})
		}
		let content = (
			<div>
				<div className="accumulate-box row">
					<div className="col blank-view blank-c-1">
						<p className="title">新增账号数</p>
						<p className="number">{parseFloat(ac_new).flover(0)}</p>
					</div>
					<div className="col blank-view blank-c-2">
						<p className="title">付费金额</p>
						<p className="number">{parseFloat(ac_cash).flover(0)}</p>
					</div>
				</div>
			</div>
		);
		return (
			<div className="box-view">
				<ViewNav
					defaultText="累计数据"
					onReceiveDateRange={this.handleGetDateRange}
					isShowDateRange={true}
					onDateRange={this.state.dateRange}
				/>
				{!isLoading && accumulate ? content : <LoadingPage/>}
			</div>
		)
	}
});
