'use strict';
import React from 'react';
import CalenderModule from '../../../components/calenderPage';
import ToolTipModule from '../../../components/tooltip';
import SelectRolePage from '../../../components/box/selectRoll'
import ChartTypeToogleModule from '../../../components/box/selectBar'
export default class DetailPage extends React.Component {
	constructor(props, context) {
		super(props, context);
		this.state = {
			d_detail: null,
			dSelectNavIndex: 0,
			chartType: 'all',
			role: 'account',
		}
	}

	handleChangeNavIndex(i, id) {
		this.setState({
			dSelectNavIndex: i
		})
	}

	handleReceiveDate(start) {
		console.log(start, '@date');
	}

	handleReceiveRole(value) {
		console.log(value, '@role')
	}

	handleChangeChartShow(value) {
		console.log(value, '@chart')
	}

	render() {
		const {onNavDataLists} = this.props;
		const {dSelectNavIndex} = this.state;
		const defaultRoll = [
			{
				title: '账号',
				value: 'account'
			},
			{
				title: '角色',
				value: 'role'
			}
		];
		const selectBarData = [
			{
				title: '累计分布',
				value: 'all'
			},
			{
				title: '分时分布',
				value: 'step'
			}
		];
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
									onClick={this.handleChangeNavIndex.bind(this, i, item.id)}
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
					<div className="op-bar-r">
						<SelectRolePage
							onReceiveRollValue={this.handleReceiveRole.bind(this)}
							onStyle={{
								position: 'relative',
								right: 0,
								display: 'inline-block'
							}}
							rollRange={defaultRoll}
						/>
						<ChartTypeToogleModule
							onSelectBarStyle={{display: 'inline-block', width: '122px', marginLeft: '10px'}}
							onDefaultValue="all"
							onReceiveValue={this.handleChangeChartShow.bind(this)}
							onSelectBarData={selectBarData}
						/>
					</div>
				</div>
				<div className="realTime-detail-chart">
				</div>
			</div>
		)
	}
}