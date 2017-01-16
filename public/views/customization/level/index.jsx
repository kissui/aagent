'use strict';
import React from 'react';
import LayoutPage from '../layout/layout';
import Auth from '../../../lib/auth';
import LevelConPage from './content';
export default class LevelPage extends React.Component {
    constructor(context, props) {
        super(context, props);
        this.state = {
            initConf: null
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
                            res.user = sessionStorage.getItem('user')
                            this.setState({initConf: res})
                        }
                    }
                })
            }
        });
    }
    handleReceiveGameId(value) {
        const {initConf} = this.state;
        initConf.gameId = value;
        this.setState({
            initConf: initConf
        })
    }
    render() {
        const {initConf} = this.state
        return (
            <div>
                {initConf && <LayoutPage selectedKeys="2" onInitConf={initConf} onReceiveGameId={this.handleReceiveGameId.bind(this)}>
                    <LevelConPage onInitConf={initConf}/>
                </LayoutPage>}
            </div>
        )
    }
}
