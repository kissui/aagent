'use static';

var React = require('react');

var loadComp = React.createClass({
	// getInitialState() {
	//     return {
	//         loadStyle:null 
	//     };
	// },
	// componentDidMount: function() {
	// 	let winH = window.screen.height;
	// 	let style = {
	// 			height:winH
	// 		};
	// 	this.setState({
	// 		loadStyle:style
	// 	})
	// },
    render:function() {
        return (
            <div className="hb-isloading animated fadeIn"><i className="icon-spin4 animate-spin"></i></div>
        );
    }
});
module.exports = loadComp;