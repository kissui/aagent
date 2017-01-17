import React from 'react';
import {Layout, Menu, Icon, Select} from 'antd';
import {Link} from 'react-router';
const {Header, Sider, Content} = Layout;
const Option = Select.Option;

export default class LayoutContent extends React.Component {
    constructor(context, props) {
        super(context, props);
        const {onInitConf} = this.props;
        this.state = {
            collapsed: false,
            initConf: onInitConf
        };
        this.handleChangeRoute.bind(this);
    }
    componentWillReceiveProps (nextProps) {
        console.log(1);
        this.setState({
            initConf: nextProps.onInitConf
        })
    }
    toggle() {
        this.setState({
            collapsed: !this.state.collapsed
        });
    }
    handleChangeRoute(page) {
        return (item, key, keyPath) => {
            console.log(page, item, key, keyPath)
        }
    }
    handleChangeGame(value) {
        console.log(`selected ${value}`);
        this.props.onReceiveGameId(value);
    }
    render() {
        const {selectedKeys} = this.props;
        const {initConf} = this.state;
        return (
            <Layout className="customization">
                <Sider trigger={null} collapsible collapsed={this.state.collapsed}>
                    <div className="logo"/>
                    <Menu theme="dark" mode="inline" defaultSelectedKeys={[selectedKeys]} style={{
                        background: '#24465a'
                    }}>
                        <Menu.Item key="1">
                            <Icon type="home"/>
                            <Link to={{pathname:'/app/game/',query:{gameId:initConf.gameId}}} className="nav-text">首页</Link>
                        </Menu.Item>
                        <Menu.Item key="2">
                            <Icon type="to-top"/>
                            <Link to={{pathname:"/app/game/customization/level",query:{gameId:initConf.gameId}}} className="nav-text">游戏等级</Link>
                        </Menu.Item>
                        <Menu.Item key="3">
                            <Icon type="rocket"/>
                            <a className="nav-text">关卡挑战</a>
                        </Menu.Item>
                        <Menu.Item key="4">
                            <Icon type="like"/>
                            <a className="nav-text">PVP</a>
                        </Menu.Item>
                        <Menu.Item key="5">
                            <Icon type="user"/>
                            <a className="nav-text">新手引导</a>
                        </Menu.Item>
                    </Menu>
                </Sider>
                <Layout>
                    <Header style={{
                        background: '#24465a',
                        position: 'relative',
                        padding: 0,
                        color: '#fff'
                    }}>
                        <Icon className="trigger" type={this.state.collapsed
                            ? 'menu-unfold'
                            : 'menu-fold'} onClick={this.toggle.bind(this)}/>
                        <div className="head-left">
                            game {initConf&&<Select showSearch style={{
                                width: 200
                            }} placeholder="Select a game"
                                defaultValue={initConf.gameId}
                                onChange={this.handleChangeGame.bind(this)}>
                                {initConf.gameList.map((item,i)=>{
                                    return (
                                        <Option value={item.value} key={i}>{item.title}</Option>
                                    )
                                })}
                            </Select>}
                        </div>
                        <div className='head-right'>
                            {initConf.user}
                        </div>
                    </Header>
                    <Content style={{
                        margin: '10px',
                        padding: 16,
                        background: '#fff',
                        minHeight: 800
                    }}>
                        {this.props.children}
                    </Content>
                </Layout>
            </Layout>
        );
    }
}
