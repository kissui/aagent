'use strict';

// import sessionStorage from './session_storage';
import http from './http';
let USER = '';
export const pathNotNeedLoggedIn = [
	'/app/error',
	'/app/login',
	'/app/mock',
	'/401'
];

export function pathNeedLoggedIn(path) {
	return pathNotNeedLoggedIn.indexOf(path) < 0;
}

export default {

	login(email, pass, cb) {
		cb = arguments[arguments.length - 1];
		http.post('/login.php', {username: email, password: pass})
			.then(r => r.data)
			.then(r => {
				if (r.error_code != 0) {
					if (cb) cb(false);
					return
				}
				USER = r.user;
				sessionStorage.setItem('user',r.user);
				if (cb) cb(true);
			})
	},

	getUser() {
		if (sessionStorage.getItem('user')) {
			return sessionStorage.getItem('user');
		}
	},

	getDealerProxy() {

		let user = this.getUser();
		let proxy = "";

		if (user.dealer_proxy !== null) {
			// 无代理商时，为 null
			proxy = user.dealer_proxy;
		}

		return proxy;
	},

	logout(cb) {
		// delete sessionStorage.user;
		if (cb) cb();
		this.onChange(false)
	},
	initGameCof (cb) {
		let gameConf = sessionStorage.getItem('gameConf');
		if(gameConf) return cb( JSON.parse(gameConf));
		http.get('/dudai/?c=analysis.report&ac=gamelist&token=mgame_afs23cgs23')
			.then(res=>res.data)
			.then(res=> {
				let conf;
				if (res.error_code === 0 && res.data.length > 0) {
					conf = {
						gameId: res.data[0].value,
						gameList: res.data
					}
				}
				sessionStorage.setItem('gameConf',JSON.stringify(conf));
				cb(conf);
			})
	},
	sessionStorageFn(conf) {
		sessionStorage.setItem('gameConf',JSON.stringify(conf));
	},
	loggedIn(cb) {
		if (isServer()) {
			// @TODO
			// 由于 match 无法传任意值，所以 server render
			// 无法判断用户是否登录，所以直接返回 true，让前端
			// 检查。但前端有 checksum 不同不渲染的问题
			return Promise.resolve(true);
		}
			return http.get('/dudai/?c=analysis.report&ac=refresh&token=mgame_afs23cgs23')
			.then(r =>r.data)
			.then(r=> {
				if (r.error_code === 0)
					USER = r.data.username;
					sessionStorage.setItem('user',r.data.username) ;
				cb(r.error_code);
			})


	}
}

function pretendRequest(email, pass, cb) {
	setTimeout(() => {
		if (email === 'joe@example.com' && pass === 'password1') {
			cb({
				authenticated: true,
				token: Math.random().toString(36).substring(7)
			})
		} else {
			cb({authenticated: false})
		}
	}, 0)
}


function isServer() {
	return !(typeof window != 'undefined' && window.document);
}
