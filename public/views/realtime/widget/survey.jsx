'use strict';
import React from 'react';
import SelectRolePage from '../../../components/box/selectRoll';
const lists = [
	{"name":"登录用户", "this_hour":"123", "y_this_hour":"234", "7ago_this_hour":"222", "30ago_this_hour":"444", "precent":"30"},
	{"name":"登录用户", "this_hour":"123", "y_this_hour":"234", "7ago_this_hour":"222", "30ago_this_hour":"444", "precent":"30"},
	{"name":"登录用户", "this_hour":"123", "y_this_hour":"234", "7ago_this_hour":"222", "30ago_this_hour":"444", "precent":"-30"},
	{"name":"登录用户", "this_hour":"123", "y_this_hour":"234", "7ago_this_hour":"222", "30ago_this_hour":"444", "precent":"-30"},
	{"name":"登录用户", "this_hour":"123", "y_this_hour":"234", "7ago_this_hour":"222", "30ago_this_hour":"444", "precent":"30"},
	{"name":"登录用户", "this_hour":"123", "y_this_hour":"234", "7ago_this_hour":"222", "30ago_this_hour":"444", "precent":"30"},
	{"name":"登录用户", "this_hour":"123", "y_this_hour":"234", "7ago_this_hour":"222", "30ago_this_hour":"444", "precent":"-30"},
	{"name":"登录用户", "this_hour":"123", "y_this_hour":"234", "7ago_this_hour":"222", "30ago_this_hour":"444", "precent":"-30"},
];
export default class SurveyPage extends React.Component {
	constructor(props, context) {
		super(props, context);
		this.state = {
			defaultDate: null
		}
	}

	handleReceiveRole(value) {
		console.log(value);
	}

	render() {
		let colors = ['#45594e', '#8fbeac', '#5e9882', '#fbbe7b', '#fff6e5', '#e89ba5', '#f5de50', '#f6deda', '#fbbe7a'];
		return (
			<div className="realTime-survey">
				<SelectRolePage
					onReceiveRollValue={this.handleReceiveRole.bind(this)}
					onStyle={{
						position: 'relative',
						right: 0,
						marginTop: '8px'
					}}
				/>
				<div className="realTime-lists row">
					{lists.map((item,i)=>{
						return(
							<div className="col-md-3 real-item" key={i} style={{borderLeft:'4px solid '+ colors[i]}}>
								<p className="name">{item.name}</p>
								<p className="value">{item.this_hour}</p>
								<div className="real-diff">
									<span>实时同比</span>
									<i className={item.precent > 0 ?"fa fa-caret-up font-up size" :"fa fa-caret-down font-down size"}>
									</i>
									<span className={item.precent > 0 ? "font-up":"font-down"}>
										{item.precent}%
									</span>
								</div>
								<div className="item-cash">
									<div className="title">昨日值：</div>
									<div className="value">{item.y_this_hour}</div>
								</div>
								<div className="item-cash">
									<div className="title">7日前：</div>
									<div className="value">{item['7ago_this_hour']}</div>
								</div>
								<div className="item-cash">
									<div className="title">30日前：</div>
									<div className="value">{item['30ago_this_hour']}</div>
								</div>
							</div>
						)
					})}
				</div>
			</div>
		)
	}
}