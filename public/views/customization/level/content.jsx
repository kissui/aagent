'use strict';
import React from 'react';
import {Table, DatePicker, Radio,Icon} from 'antd';
import http from '../../../lib/http';
import SelectBar from '../../../components/box/selectBar';
import JSON from '../../../components/json/conf_json';
import paramsConf from './paramsconf.js';
import Chart from '../../../components/chart';
import moment from 'moment';
// 推荐在入口文件全局设置 locale
import 'moment/locale/zh-cn';
moment.locale('zh-cn');
export default class LevelConPage extends React.Component {
    constructor(context, props) {
        super(context, props);
        const {onInitConf} = this.props;
        let format = 'YYYY-MM-DD';
        let currentDate = +new Date() - 3600 * 24 * 1000;
        currentDate = moment(new Date(currentDate)).format(format).toString();
        this.state = {
            initConf: onInitConf,
            tableData: null,
            device: 'All',
            showDate: currentDate,
            serverList: null,
            thead: null,
            table: null
        }
    }
    componentDidMount() {
        const {initConf, device, showDate} = this.state;
        this.handleGetServerList({
            gameId: initConf.gameId,
            device: device,
            showDate: showDate
        }, paramsConf[initConf.page]);
    }
    handleGetMetaData(params, metaParams) {
        const {serverSelected, showKpi} = this.state;
        const metaListData = {
            "cycle": 'days',
            "device": params.device,
            "appid": params.gameId,
            "serverid": serverSelected,
            "data_dimension": 'game_content',
            "kpi_conf": {
                'dimension_name': metaParams.title,
                "start": params.showDate,
                "kpis": metaParams.data
            }
        }
        let _this = this;
        metaListData.serverid = params.serverSelected
            ? params.serverSelected
            : (serverSelected
                ? serverSelected
                : data.data[0]);
        http.get('/dudai/?c=analysis.report&ac=get&token=mgame_afs23cgs23', {params: metaListData}).then(response => response.data).then((response) => {
            if (response.data && response.data.table.length > 0) {
                let theads = response.data.theads;
                let table = response.data.table
                _this.setState({
                    thead: theads,
                    showKpi: theads[1],
                    tableData: _this.handleDealTable(theads, table),
                    showChartData: Chart.dealChartData(theads, table, true)
                })
                let showChartApi = showKpi
                    ? showKpi
                    : theads[1]
                Chart.handleShowCustomChart('chart-box', Chart.dealChartData(theads, table, true), showChartApi, theads.slice(0, 1));
            }
        });
    }
    handleGetServerList(params, metaParams) {
        const data = {
            device: params.device,
            appid: params.gameId,
            date: params.showDate
        }
        let _this = this;
        http.get('/dudai/?c=analysis.report&ac=gameserverlist&token=mgame_afs23cgs23', {params: data}).then(data => data.data).then(data => {
            if (data.data && data.data.length > 0) {
                _this.setState({'serverList': data.data, 'serverSelected': data.data[0]})
                _this.handleGetMetaData(params, metaParams)
            }

        })
    }
    componentWillReceiveProps(nextProps) {
        this.setState({initConf: nextProps.onInitConf})
        const {initConf, device, showDate} = this.state;
        this.handleGetServerList({
            gameId: nextProps.onInitConf.gameId,
            device: device,
            showDate: showDate
        }, paramsConf[initConf.page]);
    }
    handleDealTable(thead, data) {
        const columns = [];
        const dataSource = [];
        thead.map((item, i) => {
            ((title, index) => {
                columns.push({
                    title: title,
                    dataIndex: title,
                    key: title,
                    sorter: (a, b) => a[title] - b[title]
                });
            })(item, i)
        })
        data.map((item, i) => {
            const obj = {};
            item.map((superItem, k) => {
                obj[thead[k]] = superItem
                    ? superItem
                    : '-'
            });
            dataSource.push(obj)
        })

        return {columns: columns, dataSource: dataSource};
    }
    handleReceiveSelectDevice(value) {
        const {initConf, device, showDate} = this.state;
        this.setState({device: value})
        this.handleGetServerList({
            gameId: initConf.gameId,
            device: value,
            showDate: showDate
        }, paramsConf[initConf.page]);
    }
    handleChangeDate(date, dateString) {
        const {initConf, device, showDate} = this.state;
        if (date && dateString) {
            this.setState({showDate: dateString})
            this.handleGetServerList({
                gameId: initConf.gameId,
                device: device,
                showDate: dateString
            }, paramsConf[initConf.page]);
        }

    }
    handleServerChange(e) {
        this.setState({serverSelected: e.target.value})
        const {initConf, device, showDate} = this.state;
        this.handleGetMetaData({
            gameId: initConf.gameId,
            device: device,
            showDate: showDate,
            serverSelected: e.target.value
        }, paramsConf[initConf.page]);
    }
    handleSizeChangeKpi(e) {
        const {thead, showChartData} = this.state;
        this.setState({showKpi: e.target.value})
        Chart.handleShowCustomChart('chart-box', showChartData, e.target.value, thead.slice(0, 1));
    }
    render() {
        const {
            tableData,
            device,
            showDate,
            serverList,
            serverSelected,
            thead,
            showKpi,
            initConf
        } = this.state;
        return (
            <div>
                <div className="custom-head">
                    <div className="custom-label">
                        <div className="label-left">
                            <h4 className="title">{initConf.title}</h4>
                        </div>
                        <div className="label-right">
                            <SelectBar onSelectBarData={JSON.selectBarDevice} onReceiveValue={this.handleReceiveSelectDevice.bind(this)} onDefaultValue={device}/>
                        </div>
                    </div>
                    <div className="custom-label">
                        <div className="label-left">
                            <h5>时间：</h5>
                        </div>
                        <div className="label-right">
                            <DatePicker defaultValue={moment(showDate, 'YYYY-MM-DD')} onChange={this.handleChangeDate.bind(this)}/>
                        </div>
                    </div>
                    <div className="custom-label">
                        <div className="label-left">
                            <h5>服务器：</h5>
                        </div>
                        <div className="label-right">
                            {serverList && serverList.length > 0
                                ? <Radio.Group value={serverSelected} onChange={this.handleServerChange.bind(this)}>
                                        {serverList.map((item, i) => {

                                            return (
                                                <Radio.Button value={item} key={i}>{item}</Radio.Button>
                                            )
                                        })}
                                    </Radio.Group>
                                : <p>空</p>}
                        </div>
                    </div>
                </div>
                {tableData ? <div className="custom-chart">
                    <div className="custom-label">
                        <div className="label-left">
                            <h4 className="title">趋势图</h4>
                        </div>
                    </div>
                    <div className="custom-label">
                        <div className="label-left">
                            <h5>指标：</h5>
                        </div>
                        <div className="label-right">
                            {thead && thead.length > 0 && showKpi
                                ? <Radio.Group value={showKpi} onChange={this.handleSizeChangeKpi.bind(this)}>
                                        {thead.map((item, i) => {
                                            if (i > 0)
                                                return (
                                                    <Radio.Button value={item} key={i}>{item}</Radio.Button>
                                                )
                                        })}
                                    </Radio.Group>
                                : <p>空</p>}
                        </div>
                    </div>
                    <div className="chart-box" id='chart-box'></div>
                </div>:<div className="custom-empty"><Icon type="frown-o" />暂无数据</div>}
                {tableData &&
                    <div className="custom-chart brt">
                        <div className="custom-label">
                            <div className="label-left">
                                <h4 className="title">详细数据</h4>
                            </div>
                        </div>
                        <Table rowKey="uid" dataSource={tableData.dataSource} columns={tableData.columns}/>
                    </div>}
            </div>
        )
    }
}
