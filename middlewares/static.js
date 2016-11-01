import express from 'express';
import favicon from 'serve-favicon';
import {join} from 'path';

function setup(app) {

    // expose public folder as static assets
    app.use(express.static(join(__dirname, '/../dist'), {
        etag: false, // 有集群的话，不同机器的 etag 可能会不一样，所以关掉
        maxAge: 2592000000 // 1 month，cache 更好的方法是用 cache-control，来达到 200 (from cache)
    }));

    app.use(favicon(join(__dirname, '/../public/favicon.ico')));

}

export default {
    setup: setup
};
