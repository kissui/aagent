'use strict';
import React, {Component} from 'react';
import CalendarPage from '../../components/calenderPage'; //时间插件，单天
import moment from 'moment';
import SelectRollPage from '../../components/box/selectRoll' //选择角色的下拉菜单
import { Table, Icon } from 'antd';
import http from '../../lib/http';
export default class ServerRender extends Component {
    constructor(props, content) {
        super(props,content);
        const { onMenu, onGameConf } = this.props;
        let defaultRange = 3600 * 24 * 13 * 1000;
		let oneDay = 3600 * 24 * 1000;
		let endRange = +new Date() - oneDay;
		let startRange = endRange - defaultRange;
		let format = 'YYYY-MM-DD';

        this.initDatePadding = this.initDatePadding.bind(this);
        // this.initDatePadding = this.handleReceiveRoll.bind(this);
        // this.handleReceiveDateRange = this.handleReceiveDateRange.bind(this);
        this.state = {
            dateRange: {
				dateStart: moment(new Date(startRange)).format(format).toString(),
				dateEnd: moment(new Date(endRange)).format(format).toString()
			},
            device: onMenu,
            appid: onGameConf.gameId,
            user_dimension: 'account',
            date: moment(new Date(endRange)).format(format).toString()
        }

    }

    componentDidMount() {
        const data = this.state;
        this.initDatePadding(data);
    }
    initDatePadding (data) {
        http.get('/dudai/?c=analysis.report&ac=serverdata',{params:data})
            .then(data => data.data)
            .then(data => {
                let dealResultData = this.handleDoTableData(data.data.table, data.data.theads );
                this.setState({
                    table: {
                        columns: dealResultData.columns,
                        data: dealResultData.data
                    }
                })
            })
    }
    componentWillReceiveProps(nextProps) {
        let data = this.state;
        data.table = null;
        data.appid = nextProps.onGameConf.gameId;
        data.device = nextProps.onMenu;
        this.initDatePadding(data);
        this.setState({
            appid: nextProps.onGameConf.gameId,
            device: nextProps.onMenu
        })
    }
    handleDoTableData(table, theads) {
        const columns = [];
        const data = [];
        if (theads && theads.length>0) {
            for (var i = 0; i < theads.length; i++) {
                columns.push({
                        title: theads[i],
                        dataIndex: theads[i],
                        key: theads[i]
                });
            }
        }

        if(table && table.length>0) {

            for (var j = 0; j < table.length; j++) {
                let dataItem = {};
                for (var t = 0; t < table[j].length; t++) {
                    ((index) =>{
                        dataItem = _.assignIn({[theads[index]]: table[j][index]},dataItem)
                    })(t)
                }
                data.push(_.assignIn({key:j},dataItem));
            }

        }

        return {
            columns: columns,
            data: data
        }

    }

    handleReceiveDateRange(start,end,type) {
        const format = 'YYYY-MM-DD';
        let data = this.state;
        data.table = null;
        data.date = start.format(format).toString();
        this.initDatePadding(data);
		let dateRangeChange = {
			dateStart: start.format(format).toString(),
			dateEnd: end.format(format).toString()
		};
    }

    handleReceiveRoll(value) {
        let data = this.state;
        data.user_dimension = value;
        data.table = null;
        this.initDatePadding(data);
        this.setState({
            user_dimension: value
        })

    }
    handleChange(){
        console.log('000');
    }
    render() {
        const { dateRange, table } = this.state;
        return (
			<div>
				<div className="analysis-header">
					<div className="tabbed-box"><h4>各服分析</h4></div>
                    <div className="analysis-date">
                        <CalendarPage
                            onReceiveData={this.handleReceiveDateRange.bind(this)}
                            onDefaultDateRange={dateRange}
                        />
                    </div>
				</div>
                <div className="analysis-second-bar" style={{marginBottom: '10px'}}>
				    <SelectRollPage
						onReceiveRollValue={this.handleReceiveRoll.bind(this)}
						onStyle={{
							float: 'right',
							position: 'relative',
							right: 0
						}}
					/>
				</div>
                {table && <Table columns={table.columns} dataSource={table.data} />}
			</div>
        )
    }
}
