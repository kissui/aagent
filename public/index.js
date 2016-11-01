'use strict';

// import the react-router routes
import Routes from './routes.jsx';
// import the react-engine's client side booter
const ReactEngineClient = require('react-engine/lib/client');

// boot options
const options = {
    routes: Routes,

    // supply a function that can be called
    // to resolve the file that was rendered.
    viewResolver: function (viewName) {
        return require('./views/' + viewName);
    }
};

document.addEventListener('DOMContentLoaded', function onLoad() {
    // boot the app when the DOM is ready
    ReactEngineClient.boot(options);
});
