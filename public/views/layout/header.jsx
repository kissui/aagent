'use strict';
import React from 'react';
import {router, Link} from 'react-router';
import _ from 'lodash';
import SelectRollPage from '../../components/box/selectRoll' //选择角色的下拉菜单
import Auth from '../../lib/auth';
let data = [
    {
        id: 'game',
        title: '游戏数据',
        superItem: [
            {
                id: 'analysis',
                title: '基础分析',
                link: '/app/game'
            }, {
                id: 'indicator',
                title: '定制指标',
                link: '/app/game/customization/gameLevel'
            }
        ]
    },
    // {
    // 	id: 'search',
    // 	title: '发现',
    // 	superItem: [
    // 		{
    // 			id: 'test',
    // 			title: 'test'
    // 		}
    // 	]
    // }
];
module.exports = React.createClass({
    contextTypes: {
        router: React.PropTypes.object.isRequired
    },
    getInitialState: function() {

        return {gameConf: this.props.onGameConf, gameId: this.props.onQuery.gameId}
    },
    handleReceiveRoll: function(value) {
        const {onPathName} = this.props;
        this.setState({gameId: value})
        this.context.router.push({
            pathname: onPathName,
            query: {
                gameId: value
            }
        })
    },
    componentWillReceiveProps(nextProps) {
        const {gameId,gameConf} = this.state;
        if (nextProps.onQuery && nextProps.onQuery.gameId) {
            this.setState({gameId: nextProps.onQuery.gameId})
        }
        if(nextProps.onGameConf) {
            if(gameId != nextProps.onGameConf.gameId) {
                this.setState({
                    gameId: nextProps.onGameConf.gameId
                })
            }
        }
    },
    
    render: function() {
        const {headerConf, active, onGameConf, onPathName} = this.props;
        const {gameId} = this.state
            let firstTpl = null,
                secondTpl = null;
            if (active) {
                let index = _.findIndex(data, (attr => {
                    return attr.id == active.one
                }));
                let secondData = data[index].superItem;
                firstTpl = data.map((item, i) => {
                    return (
                        <li key={i}>
                            <Link to={'/app/' + item.id} className={active.one == item.id && 'active'}>
                                {item.title}
                            </Link>
                        </li>
                    )
                });
                secondTpl = secondData.map((item, i) => {
                    return (
                        <li key={i}>
                            <Link to={item.link + '?gameId=' + gameId} className={active.two == item.id && 'active'}>
                                {item.title}
                            </Link>
                        </li>
                    )
                })
            }

            return (
                <div className="bd-header">
                    <div className="header-view">
                        <div className="row">
                            <div className="col-md-6">
                                <div className="logo">
                                    <img src="/img/logo.png" alt="logo"/> {onGameConf && <SelectRollPage onReceiveRollValue={this.handleReceiveRoll} onStyle={{
                                        position: 'relative',
                                        right: '-20px',
                                        display: 'inline-block'
                                    }} gameId={onGameConf.gameId} rollRange={onGameConf.gameList}/>}
                                </div>
                                <ul className="navigation">
                                    {firstTpl}
                                </ul>
                            </div>
                            <div className="col-md-6 text-right">
                                {Auth.getUser()}
                            </div>
                        </div>
                    </div>
                    <div className="header-s-view">
                        <div className="s-nav">
                            <ul>
                                {secondTpl}
                            </ul>
                        </div>
                    </div>
                </div>
            )
        }
    });
