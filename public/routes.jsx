'use strict';

import React from 'react';
import { Router, Route,hashHistory, IndexRoute, Redirect } from 'react-router';

import Auth, {pathNeedLoggedIn} from './lib/auth';

import Layout from './views/layout.jsx';
import indexPage from './views/aagent/egent.jsx';
import analysisPage from './views/analysis/analysis.jsx';
import MockPage from './views/mock/mock.jsx';
import LoginPage from './views/login.jsx';
import LogoutPage from './views/logout.jsx';
import realTimePage from './views/realtime/realtime.jsx';
import NewRealTimePage from './views/newrealtime/index.jsx';
import UnauthorizedPage from './views/401.jsx';
import errorPage from './views/error/error.jsx';

// TODO: customization pages start
import LevelPage from './views/customization/level/index.jsx';
import CardPage from './views/customization/card/index.jsx';
import PvpPage from './views/customization/pvp/index.jsx';
import GuidePage from './views/customization/guide/index.jsx';
// @todo 现在有缺少 browserHistory 的报错，但在这儿加了没用，好像是后端 render 的
export default (
    <Router history={hashHistory}>
        <Route path='/'>
            <IndexRoute component={MockPage}/>
            <Route path="/app/game" component={indexPage}/>
            <Route path="/app/game/analysis/survey/report" component={indexPage}/>
            <Route path="/app/game/analysis/survey/analysis" component={analysisPage}/>
            <Route path="/app/game/analysis/survey/hour" component={realTimePage}/>
            <Route path="/app/game/analysis/survey/realTime" component={NewRealTimePage}/>
            <Route path="/app/game/customization/:page" component={LevelPage}/>
            <Route path="/app/game/customization/card/:page" component={CardPage}/>
            <Route path="/app/game/customization/pvp/:page" component={PvpPage}/>
            <Route path="/app/game/customization/user/:page" component={GuidePage}/>
            <Route path="/app/mock" component={MockPage}/>
            <Route path="/app/login" component={LoginPage}/>
            <Route path="/app/logout" component={LogoutPage}/>
            <Route path='/app/401' component={UnauthorizedPage}/>
            <Route path='/app/error' component={errorPage}/>
            <Redirect from='/gohome' to='/'/>
        </Route>
    </Router>
);
