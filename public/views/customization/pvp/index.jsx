'use strict';
import React from 'react';
import LayoutPage from '../layout/layout';
import Auth from '../../../lib/auth';
import LevelConPage from '../level/content';
import _ from 'lodash';
const pageLists = [
    {
        page: 'gameLevel',
        title: '游戏等级分布'
    }, {
        page: 'card',
        title: '关卡挑战'
    }, {
        page: 'pvp',
        title: 'PVP详细'
    }, {
        page: 'newuser',
        title: '新手引导'
    }
]
export default class LevelPage extends React.Component {
    constructor(context, props) {
        super(context, props);
        this.state = {
            initConf: null,
        }
        this.context.router;
    }
    componentDidMount() {
        const {location} = this.props;
        Auth.loggedIn(msg => {
            if (msg != 0) {
                this.context.router.push('/app/login')
            } else {
                Auth.initGameCof(res => {
                    if (res) {
                        if (res.data && res.data.length === 0) {
                            this.context.router.push('/app/401')
                        } else {
                            if (location.query && location.query.gameId) {
                                res.gameId = location.query.gameId;
                            }
                            let page = this.props.params ? this.props.params.page : null;
                            let pageIndex=_.findIndex(pageLists,(item=>{return item.page == page}));
                            let title = pageLists[pageIndex].title;
                            res.user = sessionStorage.getItem('user');
                            res.page = page;
                            res.pageIndex = (pageIndex+2)+'';
                            res.title=title;
                            this.setState({initConf: res})
                        }
                    }
                })
            }
        });
    }
    handleReceivePage(page){
        const {initConf} = this.state;
        initConf.page = page.page;
        initConf.title= page.title;
        this.setState({
            initConf:initConf
        })
    }
    handleReceiveGameId(value) {
        const {initConf} = this.state;
        const {location} = this.props;
        initConf.gameId = value;
        this.setState({
            initConf: initConf
        })
        this.context.router.push({pathname:location.pathname,query:{gameId:value}})
    }
    render() {
        const {initConf} = this.state;
        return (
            <div>
                {initConf && <LayoutPage selectedKeys={initConf.pageIndex} onInitConf={initConf} onReceiveGameId={this.handleReceiveGameId.bind(this)} onReceivePage={this.handleReceivePage.bind(this)}>
                    <LevelConPage onInitConf={initConf}/>
                </LayoutPage>}
            </div>
        )
    }
}
LevelPage.contextTypes = {
    router: Object
}
