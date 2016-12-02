'use strict';
import React from 'react';
import TablePage from '../layout/table';
import Chart from '../../components/chart';
import http from '../../lib/http';
import ViewNav from '../../components/box/navHeader';
import moment from 'moment';
import LoadingPage from '../../components/is_loading';
module.exports = React.createClass({
	getInitialState: function () {
		let defaultRange = 3600 * 24 * 7 * 1000;
		let endRange = +new Date();
		let startRange = endRange - defaultRange;
		const {onDevice, onCycle} = this.props;
		let format = 'YYYY-MM-DD';
		return {
			sum: {},
			mean: {},
			dateRange: {
				dateStart: moment(new Date(startRange)).format(format).toString(),
				dateEnd: moment(new Date()).format(format).toString()
			},
			globalConf: {
				cycle: onCycle,
				device: onDevice,
				dimension: 'account'
			}
		}
	},
	componentDidMount: function () {
		const {dateRange, globalConf} = this.state;
		this.getInitialData(globalConf, dateRange);
	},
	componentWillReceiveProps: function (nextProps) {
		const {dateRange, globalConf} = this.state;
		if (nextProps.onCycle === globalConf.cycle && nextProps.onDevice === globalConf.device) return;
		const receivePropsConf = {
			cycle: nextProps.onCycle,
			device: nextProps.onDevice,
			dimension: globalConf.dimension
		};
		this.setState({
			globalConf: receivePropsConf,
			isLoading: true
		});
		this.getInitialData(receivePropsConf, dateRange);
	},
	handleDealDimensionText: function (dimension) {
		let dimensionText = '账号';
		switch (dimension) {
			case 'account':
				dimensionText = '账号';
				break;
			case 'role':
				dimensionText = '角色';
				break;
			case 'device':
				dimensionText = '设备';
				break;
			default:
				dimensionText = '用户';
				break;
		}
		return dimensionText
	},
	getInitialData: function (globalConf, dateConf) {
		let dimensionText = this.handleDealDimensionText(globalConf.dimension);
		let data = {
			"cycle": globalConf.cycle,
			"device": globalConf.device,
			"weidu": globalConf.dimension,
			"appid": 233002,

			"kpi_conf": {
				"new": {
					"start": dateConf.dateStart,
					"end": dateConf.dateEnd,
					"kpis": [
						{
							'meta_id': '2816',
							'name': '新增' + dimensionText
						},
						{
							'meta_id': '2833',
							'name': '次日留存',
							'num_type': 'percent'
						},
						{
							'meta_id': '2834',
							'name': '第3日留存',
							'num_type': 'percent'
						},
						{
							'meta_id': '2835',
							'name': '第7日留存',
							'num_type': 'percent'
						},
						{
							'meta_id': '2836',
							'name': '第15日留存',
							'num_type': 'percent'
						},
						{
							'meta_id': '2837',
							'name': '第30日留存',
							'num_type': 'percent'
						},
						{
							'meta_id': '2857',
							'name': 'LTV-1',
							'num_type': 'fixed_2'
						},
						{
							'meta_id': '2858',
							'name': 'LTV-3',
							'num_type': 'fixed_2'
						},
						{
							'meta_id': '2859',
							'name': 'LTV-7',
							'num_type': 'fixed_2'
						},
						{
							'meta_id': '2860',
							'name': 'LTV-15',
							'num_type': 'fixed_2'
						},
						{
							'meta_id': '2861',
							'name': 'LTV-30',
							'num_type': 'fixed_2'
						},
						{
							'meta_id': '2862',
							'name': 'LTV-45',
							'num_type': 'fixed_2'
						},
						{
							'meta_id': '2863',
							'name': 'LTV-60',
							'num_type': 'fixed_2'
						},
						{
							'meta_id': '2864',
							'name': 'LTV-90',
							'num_type': 'fixed_2'
						},
					]
				}
			}
		};
		http.get('/dudai/?c=analysis.report&ac=get&token=mgame_afs23cgs23', {params: data})
			.then(data=>data.data)
			.then((data)=> {
				if (data.error_code === 0) {
					let res = data.data.new;
					this.setState({
						heads: res.theads,
						bodys: res.table,
						isLoading: false
					});
					let response = Chart.dealChartData(res.theads, res.table);
					this.handleAccountData(response,dimensionText);
					Chart.handleShowChart('c4', response, ['新增' + dimensionText], ['日期', '次日留存', '第3日留存', '第7日留存', '第15日留存', '第30日留存']);
					Chart.handleShowChart('c5', response, ['新增' + dimensionText], ['日期', 'LTV-1', 'LTV-3', 'LTV-7', 'LTV-15', 'LTV-30', 'LTV-45', 'LTV-60', 'LTV-90']);
				}
			})
	},
	handleAccountData: function (data,dimensionText) {
		let sum = {
			ac_new: _.sumBy(data, (o)=> {
				return o['新增'+dimensionText]
			})
		};
		let mean = {
			lastRemain: _.meanBy(data, (m)=> {
				return parseFloat(m['次日留存'])
			}).toFixed(1) + '%',
			threeRemain: _.meanBy(data, (m)=> {
				return parseFloat(m['第3日留存'])
			}).toFixed(1) + '%',
			sevenRemain: _.meanBy(data, (m)=> {
				return parseFloat(m['第7日留存'])
			}).toFixed(1) + '%',
			fifteenRemain: _.meanBy(data, (m)=> {
				return parseFloat(m['第15日留存'])
			}).toFixed(1) + '%',
			LTV_1: _.meanBy(data, (m)=> {
				return parseFloat(m['LTV-1'])
			}).toFixed(1) + '%',
			LTV_7: _.meanBy(data, (m)=> {
				return parseFloat(m['LTV-7'])
			}).toFixed(1) + '%',
			LTV_15: _.meanBy(data, (m)=> {
				return parseFloat(m['LTV-15'])
			}).toFixed(1) + '%',
			LTV_30: _.meanBy(data, (m)=> {
				return parseFloat(m['LTV-30'])
			}).toFixed(1) + '%'

		};
		mean.mean_account = Math.ceil(mean.mean_account);
		mean.mean_cash = (mean.mean_cash * 100).toFixed(2);
		this.setState({
			sum: sum,
			mean: mean
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
	handleReceiveRoll: function (value) {
		const {globalConf, dateRange} = this.state;
		globalConf.dimension = value;
		this.setState({
			isLoading: true
		});
		this.getInitialData(globalConf, dateRange);
	},
	render: function () {
		const {heads, bodys, dateRange, sum, mean,globalConf, isLoading} = this.state;
		let dimensionDetailText = this.handleDealDimensionText(globalConf.dimension);
		let content = (
			<div>
				<div className="new-user row">
					<div className="col user-view">
						<p className="title">
							<i className=" icon fa fa-user-plus"></i>
							{'累计新增'+dimensionDetailText}
						</p>
						<p className="number">{sum.ac_new}</p>
					</div>
					<div className="col user-view">
						<p className="title">
							<i className=" icon fa fa-user"></i>
							(平均)次日留存/7日留存/15日留存
						</p>
						<p className="number">{mean.lastRemain + '/' + mean.sevenRemain + '/' + mean.fifteenRemain}</p>
					</div>
					<div className="col user-view br-none">
						<p className="title">
							<i className=" icon fa fa-user-times"></i>
							(平均)1日LTV/7日LTV/15日LTV/30日LTV
						</p>
						<p className="number">{mean.LTV_1 + '/' + mean.LTV_7 + '/' + mean.LTV_15 + '/' + mean.LTV_30}</p>
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
					<TablePage heads={heads} bodys={bodys}/>
				</div>
			</div>
		);
		return (
			<div className="box-view">
				<ViewNav
					defaultText="新用户质量"
					onReceiveDateRange={this.handleGetDateRange}
					isShowRoll={true}
					onReceiveRollValue={this.handleReceiveRoll}
					onDateRange={{
						dateStart: dateRange.dateStart,
						dateEnd: dateRange.dateEnd
					}}
				/>
				{!isLoading && heads ? content : <LoadingPage/>}
			</div>
		)
	}
});
