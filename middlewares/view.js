import ReactEngine from 'react-engine';
import redis from 'redis';
import session from '../public/lib/session_storage';
import {join} from 'path';
import routes from '../public/routes.jsx';
function getRedis() {
	let RDS_PORT = 6379,
		RDS_HOST = '192.168.0.184',
		RDS_OPTS = {},
		client = redis.createClient(RDS_PORT,RDS_HOST,RDS_OPTS);
	client.on('connect',()=>{
		console.log(client.get('user',(value,key)=>{
			console.log(value,key,'00000000');
		}));
	})
}
function setup(app) {

	// create the view engine with `react-engine`
	let engine = ReactEngine.server.create({
		routes: routes,
		routesFilePath: join(__dirname, '/../public/routes.jsx'),
		performanceCollector: function (stats) {}
	});

	// set the engine
	app.engine('.jsx', engine);

	// set the view directory
	app.set('views', join(__dirname, '/../public/views'));

	// set jsx as the view engine
	app.set('view engine', 'jsx');

	// finally, set the custom view
	app.set('view', ReactEngine.expressView);
	// add our app routes
	app.get('/', function (req, res) {
		res.redirect('/app/game');
		// @todo 改为下面的写法，减少一次来回请求，
		// 但需 router 挂载多个地
	});
	app.get(['/app/game', '/app/game/*'], function (req, res, next) {
		return res.render(req.url, {
			// movies: movies
		});
	});

}

function errorHandler(err, req, res, next) {
	if (err._type && err._type === ReactEngine.reactRouterServerErrors.MATCH_REDIRECT) {
		return res.redirect(302, err.redirectLocation);
	}
	else if (err._type && err._type === ReactEngine.reactRouterServerErrors.MATCH_NOT_FOUND) {
		return res.redirect('/app/error');
		// return res.status(404).send('Route Not Found!');
	}
	else if (err._type && err._type === ReactEngine.reactRouterServerErrors.MATCH_INTERNAL_ERROR) {
		return res.redirect('/app/error');
		// for ReactEngine.reactRouterServerErrors.MATCH_INTERNAL_ERROR just send the error message back
		// return res.status(500).send(err.message);
	}
	else {
		return next(err);
	}
}

export default {
	setup: setup,
	errorHandler: errorHandler
};
