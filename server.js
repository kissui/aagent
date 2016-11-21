'use strict';

const PORT = 3001; //ch

import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import auth from './lib/auth';


import enrouten from 'express-enrouten';

import StaticFiles from './middlewares/static';
import CheckAuth from './middlewares/check_auth';
import View from './middlewares/view';
import Proxy from './middlewares/proxy';
import RealIP from './middlewares/ip';
import _ from 'lodash';

//允许代理
import allowsProxy from './middlewares/proxy_allows.js';

import morgan from 'morgan';
import fs from 'fs';

import {setPreflight} from './lib/cors';

const winston = require('winston');
const errorLogFile = __dirname + '/logs/error.log';
const errorLogger = new (winston.Logger)({
    transports: [
        new (winston.transports.File)({filename: errorLogFile})
    ]
});


let app = express();

// set CORS pre-flight
setPreflight(app);

let accessLog = __dirname + '/logs/access.log';

// create a write stream (in append mode)
var accessLogStream = fs.createWriteStream(accessLog, {flags: 'a'})

// 忽略阿里云 SLB 的健康检查
app.head('/', (req, res) => {
    return res.status(204).end();
});

// 获得真实 IP
app.use(RealIP());

// setup the logger
morgan.token('date', function () {
    var p = new Date().toString().replace(/[A-Z]{3}\+/, '+').split(/ /);
    return ( p[2] + '/' + p[1] + '/' + p[3] + ':' + p[4] + ' ' + p[5] );
});
morgan.token('real-ip', function (req, res) {
    return req.clientIP;
});
app.use(morgan(':real-ip [:date] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent" :req[device-id]', {stream: accessLogStream}));

// for parsing application/json
app.use(bodyParser.json({limit: '10mb'}));
// for parsing application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({limit: '10mb', extended: true}));
// cookie parser
app.use(cookieParser())

StaticFiles.setup(app);

// app.use(CheckAuth.middleware());

// 设置自有路由
app.use(enrouten({directory: 'controllers'}));

// 设置 react view
View.setup(app);

// 其它的走代理
Proxy.setup(app);


// 记录错误（即使 401 也记录）
app.use(function(err, req, res, next) {

  errorLogger.error('error', {
    api: req.method + ' ' + req.path,
    err: _.isPlainObject(err) ? err : err.toString(),
    headersSent: res.headersSent
  });

  // http://expressjs.com/en/guide/error-handling.html
  if (res.headersSent) {
    // 如果错误信息已返回给前段，则不再处理
    return;
  }

  // 否则继续处理
  return next(err);
});

// 处理 auth 错误
// app.use(CheckAuth.errorHandler);
// 处理 view 出错
// app.use(View.errorHandler);
// 处理其它出错
app.use(function (err, req, res, next) {

    if (_.isObject(err) && err.code && err.message) {
        // 如果我们规定的规范的 err，则直接返回
        return res.status(400).json(err);
    }

    // return res.redirect('/app/error');
    // @todo 将错误信息隐藏
    // return res.status(500).send(err.message);
});

// 开启服务
const server = app.listen(PORT, function () {
    console.log('Example app listening at http://localhost:%s', PORT);
});
