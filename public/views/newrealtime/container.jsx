'use strict';
import React from 'react';
import SelectBar from '../../components/box/selectBar';
import JSON from '../../components/json/conf_json';
import SelectRolePage from '../../components/box/selectRoll' //选择角色的下拉菜单
import LoadingPage from '../../components/is_loading'
import Auth from '../../lib/auth';
import ToolTipModule from '../../components/tooltip';
import _ from 'lodash';
import ShowChart from './widget/chart';
import http from '../../lib/http';
import { Table, Icon } from 'antd';
import moment from 'moment';
const realTimeRoleConf=[
    {
        title: '账号',
        value: 'account'
    },
    {
        title: '角色',
        value: 'role'
    }
];
module.exports = React.createClass({
	contextTypes: {
		router: React.PropTypes.object.isRequired
	},
	getInitialState: function () {
        console.log(this.props.gameConf);
		return {
			chart_conf: null,
			device: 'All',
            user_dimension: 'account',
            serverId: '',
			gameConf: this.props.gameConf,
            gameId: this.props.gameConf.gameId,
            tipIsShow: false
		}
	},
    handleDoTableData: function(table, theads) {
        const columns = [];
        const data = [];
        if (theads && theads.length>0) {

            for (var i = 0; i < theads.length; i++) {
                columns.push({
                        title: theads[i],
                        dataIndex: theads[i],
                        key: theads[i]
                });
                let dataItem = {};
                if(table[i] && table[i].length>0) {
                    for (var j = 0; j < table[i].length; j++) {
                        ((index) =>{
                            dataItem = _.assignIn({[theads[index]]: table[i][index]},dataItem)
                        })(j)
                    }
                    data.push(_.assignIn({key:i},dataItem));
                }
            }
        }

        return {
            columns: columns,
            data: data
        }

    },
    handleGetData:function(device,serverId,dimension,gameId) {
        const paramsData = {
            device: device,
            user_dimension: dimension,
            appid: gameId,
            serverid: serverId,
        }
        http.get('/dudai/?c=analysis.report&ac=nowdata',{params: paramsData}).then(data=>data.data).then(data=>{
            ShowChart.renderLineChart(data.data.online);
            ShowChart.renderIntervalChart(data.data.servers);
            this.setState({
                realTimeDatas: data.data,
                dataShowTime: moment(new Date(data.data.datetime*1000 + 3600*1000)).format('YYYY-MM-DD HH:mm:ss'),
                ServerList: data.data.server_list,
                table: this.handleDoTableData(data.data.table.table, data.data.table.theads)
            })
        })
    },
    componentDidMount: function() {
        const {device,user_dimension,gameId,serverId} = this.state;
        this.handleGetData(device,serverId,user_dimension,gameId);
        this.timer = setInterval((()=>{
            this.handleGetData(device,serverId,user_dimension,gameId);
        }).bind(this),60000)
    },
    componentWillUnmount: function(){
        this.timer && clearTimeout(this.timer);
    },
	handleReceiveSelectDevice: function (value) {
        const {device,user_dimension,gameId,serverId} = this.state;

		if (device === value) return;
		this.setState({
			device: value
		});
        this.handleGetData(value,serverId,user_dimension,gameId);
	},
	componentWillReceiveProps: function (nextProps) {

		if (nextProps.gameConf && nextProps.gameConf.gameId) {
			this.setState({
				gameConf: nextProps.gameConf
			});
		}
	},
    handleToggleTip: function(value) {
		this.setState({
			tipIsShow: value
		})
	},
    handleReceiveRole(value) {
		const {device,user_dimension,gameId,serverId} = this.state;
		this.setState({
			user_dimension: value
		});
		this.handleGetData(device,serverId,value,gameId);
	},
    handleReceiveServer(value) {
	    const {device,user_dimension,gameId,serverId} = this.state;
		this.setState({
			serverId: value
		});
		this.handleGetData(device,value,user_dimension,gameId);
	},
    renderSurveyModule: function() {
        let colors = ['#45594e', '#8fbeac', '#5e9882', '#fbbe7b', '#fff6e5', '#e89ba5', '#f5de50', '#f6deda', '#fbbe7a'];
        const {tipIsShow, realTimeDatas, dataShowTime} = this.state;
        return(
            <div>
                <h2 className="analysis-tit" onMouseLeave={this.handleToggleTip.bind(this, false)}>
                    <i className="fa fa-bar-chart" aria-hidden="true">
                    </i>
                    <span>数据概览</span>
                    <i className="fa fa-info-circle" aria-hidden="true"
                       onMouseEnter={this.handleToggleTip.bind(this, true)}>
                    </i>
                    {tipIsShow && <div className="tooltip-box">
                        <p>由于实时页面的角色/帐号、付费等指标与近期概况、运营报表和定制指标 页面计算逻辑不完全一致，数值上会有一定的偏差，敬请留意。</p>
                        <h4>登录帐号/角色：</h4>
                        <p>实时统计当日有过登录行为的帐号/角色去重数量</p>
                        <h4>新增帐号/角色：</h4>
                        <p>实时统计当日首次出现登录行为的帐号/角色去重数量</p>
                        <h4>老玩家帐号/角色：</h4>
                        <p>实时统计当日非首次出现过登录行为帐号/角色去重数量</p>
                        <h4>付费帐号/角色：</h4>
                        <p>实时统计当日有充值行为的帐号/角色去重数量</p>
                        <h4>人均游戏次数：</h4>
                        <p>实时统计角色当日人均登录游戏的累计次数</p>
                        <h4>实时次日留存帐号/角色：</h4>
                        <p>实时统计前1日新增用户在当日有过登录行为的帐号/角色去重数量</p>
                        <h4>付费次数：</h4>
                        <p>实时统计角色当日充值的累计次数</p>
                        <h4>今日收入：</h4>
                        <p>实时统计角色当日充值的累计金额</p>
                    </div>}
                    <span className="time">{dataShowTime}</span>
                </h2>
                <div className="realTime-survey">
					<SelectRolePage
						onReceiveRollValue={this.handleReceiveRole}
						onStyle={{
							position: 'relative',
							right: 0,
							marginTop: '8px'
						}}
						rollRange={realTimeRoleConf}
					/>
					<div className="realTime-new-lists row">
						{(realTimeDatas && realTimeDatas.lists) ? realTimeDatas.lists.map((item, i)=> {
							return (
								<div className="col-md-2 real-item" key={i}
									 style={{borderLeft: '4px solid ' + colors[i],width: '20%'}}>
									<p className="name">{item.name}</p>
									<p className="value">{item.this_day}</p>
									<div className="real-diff">
										{item.percent != 0 && <div className="title">
											<span>实时同比</span>
											<i className={item.percent > 0 ? "fa fa-caret-up font-up size" : "fa fa-caret-down font-down size"}>
											</i>
											<span className={item.percent > 0 ? "font-up" : "font-down"}>
												{item.percent < 0 ? -item.percent : item.percent}%
											</span>
										</div>
										}
									</div>
									<div className="item-cash">
										<div className="title">昨日值：</div>
										<div className="value">{item.y_day}</div>
									</div>
									<div className="item-cash">
										<div className="title">7日前：</div>
										<div className="value">{item['7ago_day']}</div>
									</div>
									<div className="item-cash">
										<div className="title">30日前：</div>
										<div className="value">{item['30ago_day']}</div>
									</div>
								</div>
							)
						}) : <LoadingPage/>}
					</div>
				</div>
            </div>
        )
    },
    renderOnlineChart: function() {
        const {ServerList} = this.state;
        return (
            <div>
                <h2 className="analysis-tit">
                    <i className="fa fa-bar-chart" aria-hidden="true"></i>
                    实时在线人数
                </h2>
                <ToolTipModule onText="横轴说明：如10:00的数据代表10:00到10:59期间的数据。如最新的数值较低，或与数据未齐有关。"/>
                <div style={{width: '100%',height:'40px',position:'relative'}}>
                {ServerList && ServerList.length > 0 && <SelectRolePage
                    onReceiveRollValue={this.handleReceiveServer}
                    onStyle={{
                        position: 'absolute',
                        right: 0,
                        margin: '16px 0',
                        float: 'right',
                        zIndex: 111111111
                    }}
                    rollRange={ServerList}
                />}</div>
                <div id="realTimeChartLine"></div>
            </div>
        )
    },
    renderIntervalChart: function() {
        return (
            <div>
                <h2 className="analysis-tit">
                    <i className="fa fa-bar-chart" aria-hidden="true"></i>
                    在线人数TOP10的服务器
                </h2>
                <div id="realTimeChartInterval"></div>
            </div>
        )
    },
	render: function () {
		const {gameConf, device, table} = this.state;
		return (
			<div className="bd-container analysis-body">
				<div className="box-view">
					<div className="view-option">
						<div className="selectCycle">
							<SelectBar
								onSelectBarData={JSON.selectBarDevice}
								onReceiveValue={this.handleReceiveSelectDevice}
								onDefaultValue={device}
							/>
						</div>
					</div>
				</div>
				<div className="box-view analysis-show-box">
				    {this.renderSurveyModule()}
                    {table && <Table columns={table.columns} dataSource={table.data} />}
				</div>
				<div className="box-view analysis-show-box">
                    {this.renderOnlineChart()}
                    {this.renderIntervalChart()}
				</div>
			</div>
		)
	}
});
