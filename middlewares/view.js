import ReactEngine from 'react-engine';
import {join} from 'path';
import routes from '../public/routes.jsx';
import Auth from '../lib/auth';

import _ from 'lodash';
import http from '../public/lib/http';

import BPromise from 'bluebird';

// @todo 需要找办法前后端共享该文件
import {pathNeedLoggedIn} from '../public/lib/auth';

import url from 'url';


function setup(app) {

    // create the view engine with `react-engine`
    let engine = ReactEngine.server.create({
        routes: routes,
        routesFilePath: join(__dirname, '/../public/routes.jsx'),
        performanceCollector: function(stats) {
            console.log(stats);
        }
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
    app.get('/', function(req, res) {
        res.redirect('/app');
        // @todo 改为下面的写法，减少一次来回请求，
        // 但需 router 挂载多个地址
        // req.url = '/app';
    });
    app.get(['/app', '/app/*'], function(req, res, next) {
        console.log(req.url,req.user,req.accessToken);
        if (!pathNeedLoggedIn(req.url)) {
            console.log('NOT-NEED logged in');
            // 不需登录

            return res.render(req.url, {
                // movies: movies
            });
        }


        // 因为 render 在 match 时无法传自定义属性，所以需要
        // 在 render 前判断权限、跳转
        // if (!req.user) {
        //     req.url = '/app/login';
        // }

        // console.log('### should get', req.url);

        if (req.accessToken) {
            res.cookie('token', req.accessToken, {
                httpOnly: true,

                // @todo 设置 domain，页面既可能是单独网站，又可能是 iframe。
                // 对于 iframe，不设置 domain，cookie 就都存到 app 的 domain 了，
                // 就泄漏了。但 domain 需判断域名，可能有多域名 yunzhanghu/easemob 等

                // @TODO 设置与 token 相同的 expires（有必要吗？FE 没法拿 cookie、
                // 用 cookie 判断登陆状态及登陆是否过期）
                // expires: Date, Expiry date of the cookie in GMT. If not
                //          specified or set to 0, creates a session cookie.
                // maxAge: String, Convenient option for setting the expiry time
                //         relative to the current time in milliseconds.

                // @TODO 还有一些安全设置可参考：
                // https://stormpath.com/blog/where-to-store-your-jwts-cookies-vs-html5-web-storage/

            });
        }

        var render = function(initialState) {

            let data = {
                // render 时传 ua，以判断是否加载 shim
                ua: req.get('user-agent'),

                // 供首屏加载
                serverSide: !_.isEmpty(initialState),
                initialState: initialState,
                originalQuery: req.query
            };

            console.log('@render', req.path, data);

            // @TODO 只要 url 带 query，render 就会报错，未查出原因，
            // 所以，用 req.path render，query 按 params 传递
            // { [Error: Cannot find module '-DkYDQ7uwt9m2jRhs8x1ebJoZIzp_yqkeifsOoat9GU'] code: 'MODULE_NOT_FOUND' }
            res.render(req.path, data);
        };


        // boss 对体验要求低，不需要服务端取数据、渲染

        render();


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
