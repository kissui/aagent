'use strict';

import React from 'react';
import SelectBar from '../../components/box/selectBar';
import JSON from '../../components/json/conf_json';
import HeadPage from '../../components/box/navHeader';
import SurveyPage from './survey';
const testData = JSON.testData;
module.exports = React.createClass({
	getInitialState: function () {
		return{
			chart_conf: null
		}
	},
	handleReceiveSelectDevice: function (value) {
		console.log(value);
	},
	render: function () {
		return (
			<div className="bd-container analysis-body">
				<div className="box-view">
					<div className="view-option">
						<div className="selectDevice">
							<SelectBar
								onSelectBarData={JSON.selectBarDevice}
								onReceiveValue={this.handleReceiveSelectDevice}
								onDefaultValue={'all'}
							/>
						</div>
					</div>
				</div>
				<div className="box-view">
					<HeadPage
						isShowDateForm={true}
						defaultText="概览"
					/>
					<SurveyPage surveyData={testData}/>
				</div>
				<div className="box-view">
					<HeadPage
						isShowDateForm={true}
						defaultText="近期数据"
					/>
				</div>
			</div>

		)
	}
});