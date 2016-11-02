'use strict';

const React = require('react');
const Auth = require('../lib/auth');
const Shim = require('./shim');
const HeaderPage = require('./layout/header');
// const Link = require('react-router/lib/link');
import Router, {Link, History} from 'react-router';
module.exports = React.createClass({

	getInitialState() {
		return {
			// loggedIn: Auth.loggedIn()
		}
	},
	// updateAuth(loggedIn) {
	//   this.setState({
	//     loggedIn: loggedIn
	//   })
	// },
	// componentWillMount() {
	//   Auth.onChange = this.updateAuth
	//   Auth.login()
	// },

	render: function render() {

		var shimBrowsers = [

			// 'Chrome/50'
			// 修复 iPhone 4s
			// "Mozilla/5.0 (iPhone; CPU iPhone OS 7_1_2 like Mac OS X) AppleWebKit/537.51.2 (KHTML, like Gecko) Mobile/11D257"
			'OS 7',

			// 可以
			// "Dalvik/1.6.0 (Linux; U; Android 4.4.4; HM NOTE 1S MIUI/V6.5.4.0.KHKCNCD)"

			// 不行
			// "Mozilla/5.0 (Linux; U; Android 4.2.1; zh-cn; M351 Build/JOP40D) AppleWebKit/534.30 (KHTML, like Gecko) Version/4.0 Mobile Safari/534.30"
			// "Mozilla/5.0 (Linux; U; Android 4.2.2; zh-cn; L39t Build/14.1.M.1.59) AppleWebKit/534.30 (KHTML, like Gecko) Version/4.0 Mobile Safari/534.30"
			// "Mozilla/5.0 (Linux; Android 4.4.2; HUAWEI MT7-TL00 Build/HuaweiMT7-TL00) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/30.0.0.0 Mobile Safari/537.36"
			// "Mozilla/5.0 (Linux; Android 4.4.2; vivo Xplay3S Build/KVT49L) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/30.0.0.0 Mobile Safari/537.36"
			// "Mozilla/5.0 (Linux; Android 5.0.1; GT-I9507V Build/LRX22C; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/43.0.2357.121 Mobile Safari/537.36"
			// 解决小米、魅族、华为
			'Android 4',
		];

		/*
		 var needShim = shimBrowsers.some((browser) => {
		 let reg = new RegExp(browser);
		 return reg.test(this.props.ua);
		 });
		 */
		var needShim = true;

		var shimScript = '';
		if (needShim) {
			shimScript = <Shim />;
		}

		return (
			<html>
			<head>
				<meta charSet='utf-8'/>
				<meta name="viewport" content="initial-scale=1, maximum-scale=1, user-scalable=no, width=device-width"/>
				<title>独代</title>
				<link rel="stylesheet" href="/bower/bootstrap/dist/css/bootstrap.min.css"/>
				<link rel="stylesheet" href="/bower/font-awesome/css/font-awesome.min.css"/>
				<link rel='stylesheet' href='/styles.css'></link>
			</head>
			<body>
			<HeaderPage/>
			<div className="container">
				{this.props.children}
			</div>
			{shimScript}
			<script src='/bundle.js'></script>
			</body>
			</html>
		);
	}

});
