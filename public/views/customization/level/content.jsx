'use strict';
import React from 'react';
import {Table} from 'antd';
import http from '../../../lib/http';
import SelectBar from '../../../components/box/selectBar';
import JSON from '../../../components/json/conf_json';
const testData = {
    "thead": [
        "等级", "活跃角色数", "新增角色数", "活跃角色平均在线时长(分钟)", "新增角色平均在线时长(分钟)"
    ],
    "data": [
        [
            "0", "1", "0", "3", "0"
        ],
        [
            "2", "3", "2", "12", "17"
        ],
        [
            "5", "1", "0", "161", "0"
        ],
        [
            "8", "2", "1", "40", "70"
        ],
        [
            "10", "1", "0", "27", "0"
        ],
        [
            "12", "2", "0", "34", "0"
        ],
        [
            "13", "1", "0", "22", "0"
        ],
        [
            "16", "1", "0", "2", "0"
        ],
        [
            "20", "1", "0", "11", "0"
        ],
        [
            "21", "1", "0", "2075", "0"
        ],
        [
            "24", "1", "0", "652", "0"
        ],
        [
            "26", "1", "0", "29", "0"
        ],
        [
            "27", "1", "0", "7", "0"
        ],
        [
            "30", "1", "0", "20", "0"
        ],
        [
            "31", "1", "0", "19", "0"
        ],
        [
            "32", "1", "0", "6", "0"
        ],
        [
            "34", "1", "0", "152", "0"
        ],
        [
            "38", "1", "0", "146", "0"
        ],
        [
            "39", "2", "0", "217", "0"
        ],
        [
            "41", "1", "0", "2", "0"
        ],
        [
            "42", "1", "0", "106", "0"
        ],
        [
            "43", "2", "0", "161", "0"
        ],
        [
            "45", "2", "0", "80", "0"
        ],
        [
            "46", "1", "0", "6", "0"
        ],
        [
            "47", "1", "0", "8", "0"
        ],
        [
            "48", "1", "0", "56", "0"
        ],
        [
            "49", "1", "0", "102", "0"
        ],
        [
            "51", "1", "0", "32", "0"
        ],
        [
            "52", "1", "0", "302", "0"
        ],
        [
            "55", "1", "0", "46", "0"
        ],
        [
            "56", "1", "0", "53", "0"
        ],
        [
            "57", "1", "0", "13", "0"
        ],
        [
            "59", "2", "0", "121", "0"
        ],
        [
            "60", "2", "0", "8", "0"
        ],
        [
            "62", "2", "0", "40", "0"
        ],
        [
            "65", "3", "0", "130", "0"
        ],
        [
            "66", "1", "0", "324", "0"
        ],
        [
            "69", "1", "0", "155", "0"
        ],
        [
            "70", "1", "0", "2", "0"
        ],
        ["75", "3", "0", "47", "0"]
    ],
    "options": {
        "otherFilter": "role_level!=-127",
        "compareDim": "role_level",
        "defaultType": "column"
    }
}

export default class LevelConPage extends React.Component {
    constructor(context, props) {
        super(context, props);
        const {onInitConf} = this.props;
        this.state = {
            initConf: onInitConf,
            tableData: null,
            device: 'All'
        }
    }
    componentDidMount() {
        const {initConf,device}=this.state;
        const data = {
            device: device,
            appid: initConf.gameId,
            date:'2017-01-16'
        }
        http.get('/dudai/?c=analysis.report&ac=gameserverlist&token=mgame_afs23cgs23', {params: data}).then(data => data.data).then(data => {
            console.log(data, '@server');
        })
        this.handleDealTable();
        this.setState({tableData: this.handleDealTable()})
    }
    componentWillReceiveProps(nextProps) {
        console.log(`content ${nextProps}`);
        this.setState({initConf: nextProps.onInitConf})
    }
    handleDealTable() {
        const columns = [];
        const dataSource = [];
        testData.thead.map((item, i) => {
            ((title, index) => {
                columns.push({
                    title: title,
                    dataIndex: title,
                    key: title,
                    sorter: (a, b) => a[title] - b[title]
                });
            })(item, i)
        })
        testData.data.map((item, i) => {
            const obj = {};
            item.map((superItem, k) => {
                obj[testData.thead[k]] = superItem
            });
            dataSource.push(obj)
        })

        return {columns: columns, dataSource: dataSource};
    }
    handleReceiveSelectDevice(value) {
        console.log(value);
    }
    render() {
        const {tableData, device} = this.state;
        return (
            <div>
                <div className="custom-label">
                    <div className="label-left">
                        <h4 className="title">等级分布</h4>
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
                    </div>
                </div>
                <div className="custom-label">
                    <div className="label-left">
                        <h5>服务器：</h5>
                    </div>
                    <div className="label-right">

                    </div>
                </div>
                {tableData && <Table dataSource={tableData.dataSource} columns={tableData.columns}/>}
            </div>
        )
    }
}
