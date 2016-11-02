'use strict';
import React from 'react';

module.exports = React.createClass({
	render: function () {
		return(
			<div className="bd-header">
				<div className="header-view">
					<div className="row">
						<div className="col-md-6">
							<div className="logo">
								<img src="/img/logo.png" alt="logo"/>
							</div>
							<ul className="navigation">
								<li>
									<a>游戏数据</a>
								</li>
								<li>
									<a>发现</a>
								</li>
							</ul>
						</div>
						<div className="col-md-6 text-right">
							shane
						</div>
					</div>

				</div>
			</div>
		)
	}
})