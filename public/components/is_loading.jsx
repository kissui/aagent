'use static';

var React = require('react');

var loadComp = React.createClass({
    render:function() {
        return (
            <div className="hb-isloading animated fadeIn"><i className="icon-spin4 animate-spin"></i></div>
        );
    }
});
module.exports = loadComp;