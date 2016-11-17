'use strict';

import React from 'react';
const defaultRollList = [
    {
        title: '账号',
        value: 'account'
    },
    {
        title: '角色',
        value: 'role'
    },
    {
        title: '设备',
        value: 'device'
    }
]
module.exports = React.createClass({
    getInitialState: function(){
        return {
            defaultSelect: {
                title: '账号',
                value: 'account'
            },
            isShow: false
        }
    },
    handleSelectRoll: function (value,title) {
        const {defaultSelect,isShow} = this.state;
        if (defaultSelect.value === value) return;
        this.setState({
            defaultSelect: {
                value: value,
                title: title
            },
            isShow: !isShow
        })
        this.props.onReceiveValue(value);
    },
    handleToggleDisplay: function() {
        this.setState({
            isShow: !this.state.isShow
        })
    },
    render: function(){
        const {defaultSelect,isShow} = this.state;
        let content = defaultRollList.map((item,i)=>{
            return (
                <li key={i}
                    className={defaultSelect.value == item.value && "active"}
                    onClick={this.handleSelectRoll.bind(null,item.value,item.title)}
                    >
                    {item.title}
                </li>
            )
        });
        return (
            <div className="select_roll">
                <div className="roll_block" onClick={this.handleToggleDisplay}>
                    {defaultSelect.title}
                    <i className="fa fa-caret-down"></i>
                </div>
                <ul className={isShow ? "roll_box" : "hide"}>
                    {content}
                </ul>
            </div>
        )
    }
})
