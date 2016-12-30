'use strict';
import React from 'react';
import CalenderModule from '../../../components/calenderPage';
import ToolTipModule from '../../../components/tooltip';
import SelectRolePage from '../../../components/box/selectRoll';
import ChartTypeToogleModule from '../../../components/box/selectBar';
import Conf from '../realtimeConf';
import moment from 'moment';
export default class DetailPage extends React.Component {
	constructor(props, context) {
		super(props, context);
		const {onGameConf, onDevice} = this.props;
		let defaultRange = 3600 * 24 * 7 * 1000;
		let format = 'YYYY-MM-DD';
		let today = moment(new Date()).format(format);
		let yes = moment(new Date(+new Date() - 3600 * 24 * 1000)).format(format);
		let lastToday = moment(new Date(+new Date() - 3600 * 24 * 7 * 1000)).format(format);
		console.log(today, yes, lastToday)
		this.handleDetailData.bind();
		this.state = {
			d_detail: null,
			dSelectNavIndex: 0,
			chartType: 'all',
			role: 'account',
			showRight: 'all',
			device: onDevice,
			gameId: onGameConf.gameId,
			defaultDateS: {
				'今天': today,
				'昨天': yes,
				['上周(' + lastToday.slice(5) + ")"]: lastToday
			},
			defaultDateMap:[today,yes,lastToday]
		}
	}

	handleChangeNavIndex(i, id, showRight) {
		console.log(i, id, showRight);
		this.setState({
			dSelectNavIndex: i,
			showRight: showRight,
		})
	}

	componentDidMount() {

	}

	componentWillReceiveProps(nextProps) {

	}

	handleDetailData() {
		let data = {
			"cycle": 'hour',
			"device": paramsDevice ? paramsDevice : device,
			"user_dimension": paramsRole ? paramsRole : user_dimension,
			"data_dimension": 'hour_head',
			"appid": paramsGameId ? paramsGameId : gameId,
			"kpi_conf": {
				'dates': {'今天': '', '昨天': '', '上周': ''},
				"kpis": Conf.dealParamsConf(roleName)
			}
		};
	}

	handleReceiveDate(start) {
		let format = 'YYYY-MM-DD';
		const {defaultDateMap,defaultDateS} = this.state;
		let selectDate = moment(start).format(format);
		console.log(defaultDateMap,defaultDateS,selectDate);
	}

	handleReceiveRole(value) {
		console.log(value, '@role')
	}

	handleChangeChartShow(value) {
		console.log(value, '@chart')
	}

	render() {
		const {onNavDataLists} = this.props;
		const {dSelectNavIndex, showRight} = this.state;
		return (
			<div>
				<h2 className="analysis-tit">
					<i className="fa fa-bar-chart" aria-hidden="true"></i>
					数据详情
					<ul className="realTime-detail-nav">
						{onNavDataLists.map((item, i)=> {
							return (
								<li key={i}
									className={dSelectNavIndex == i && 'active'}
									onClick={this.handleChangeNavIndex.bind(this, i, item.id, item.showRight)}
								>
									{item.title}
								</li>
							)
						})}
					</ul>
				</h2>
				<ToolTipModule onText="横轴说明：如10:00的数据代表10:00到10:59期间的数据。如最新的数值较低，或与数据未齐有关。"/>
				<div className="realTime-detail-option-bar">
					<div className="op-bar-l">
						<span>添加对比日期</span>
						<CalenderModule
							onReceiveData={this.handleReceiveDate.bind(this)}
							onStyle={{
								display: 'inline-block',
								marginLeft: '5px'
							}}
						/>
					</div>
					{showRight != 'no' && <div className="op-bar-r">
						{(showRight == 'role' || showRight == 'all') &&
						<SelectRolePage
							onReceiveRollValue={this.handleReceiveRole.bind(this)}
							onStyle={{
								position: 'relative',
								right: 0,
								display: 'inline-block'
							}}
							rollRange={Conf.realTimeRoleConf}
						/>}
						{(showRight == 'chartType' || showRight == 'all') &&
						<ChartTypeToogleModule
							onSelectBarStyle={{display: 'inline-block', width: '122px', marginLeft: '10px'}}
							onDefaultValue="all"
							onReceiveValue={this.handleChangeChartShow.bind(this)}
							onSelectBarData={Conf.realTimeChartTypeBar}
						/>}
					</div>}
				</div>
				<div className="realTime-detail-chart">
				</div>
			</div>
		)
	}
}