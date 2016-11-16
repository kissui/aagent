'use strict';

import React from 'react';
import Reg from '../../components/chart';
module.exports = React.createClass({
	render: function () {
		const {heads, bodys} = this.props;
		return (
			<table className="table table-striped text-center">
				<thead>
				<tr className="text-center">
					{heads ? heads.map((item, i)=> {
						return (
							<th key={i}>{item}</th>
						)
					}) : null}

				</tr>
				</thead>
				<tbody>
				{bodys ? bodys.map((items, i)=> {
					return (
						<tr key={i}>
							{items.map((item, si)=> {
								return (
									<td key={si} className={si === 1 && 'active'}>{item ? Reg.reg(item, true) : 0}</td>
								)
							})}
						</tr>
					)
				}) : null}
				</tbody>
			</table>
		)
	}
});
