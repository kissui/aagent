'use strict';

import React from 'react';
import http from '../../lib/http';

module.exports = React.createClass({
	getInitialState: function () {
		return {
			defaultSidebar: null
		}
	},
	componentDidMount: function () {
		console.log('2345678kajsdfhjkasdhf');
		http.get('/api/?c=table.folder&ac=tree').then(data=>data).then(data=>{
			console.log(data,'@data')
		})
	},
	render: function () {
		console.log('shenme');
		return(
			<div className="sidebar">
				sidebar
			</div>
		)
	}
});