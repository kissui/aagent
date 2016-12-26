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
			Auth.initGameCof(res=>{
				if(res.data && res.data.length===0) {
					this.props.router.replace('/app/401')
				} else {
					this.props.router.replace('/app/game')
				}
			});

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

export default withRouter(Login)
