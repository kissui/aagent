'use strict';

import React from 'react';
import Auth from '../lib/auth';
import {withRouter, Link} from 'react-router'

const Login = React.createClass({

	getInitialState() {
		return {
			error: false
		}
	},

	handleSubmit(event) {
		event.preventDefault();
		const email = this.refs.email.value;
		const pass = this.refs.pass.value;
		Auth.login(email, pass, (loggedIn) => {
			if (!loggedIn)
				return this.setState({error: true});
			this.props.router.replace('/app/game')
		})
	},

	render() {
		return (
			<div className="default-box">
				<div className="logo">
					<img src="/img/logo.png" alt="独代"/>
				</div>
				<div id='login' className="login">
					<h1 className="text-center">Please log in.</h1>
					<form onSubmit={this.handleSubmit} className="text-center">
						<div className="row-block">
							<input ref="email" placeholder="域账户" className="form-control"/>
						</div>
						<div className="row-block">
							<input ref="pass" type="password" placeholder="password" className="form-control"/>
						</div>
						<button type="submit" className="btn btn-primary">登录</button>
						{this.state.error && (
							<p>登录失败</p>
						)}
					</form>
				</div>
			</div>

		)
	}

});


// 本项目用了 react-engine 未实际支持的 react-router 2.*（具体为 ^2.4.0），
// 但 react-router 说过是平滑升级的，所以用了后除了 deprecated 的信息，
// 暂也没发现 BUG：
// https://github.com/reactjs/react-router/blob/master/upgrade-guides/v2.0.0.md
//
// withRouter 就是 2.4.0 中新加的方法（使用时还未发布），如果路由出问题，可以细查：
// https://github.com/reactjs/react-router/blob/master/upgrade-guides/v2.4.0.md
export default withRouter(Login)
