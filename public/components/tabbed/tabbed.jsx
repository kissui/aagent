'use strict';
import React from 'react';
class Tabbed extends React.Component {
	constructor(props) {
		super(props);
		const {tabList} = this.props;
		this.state = {
			tabList: tabList,
			selected: tabList.subList[0].key
		};
	};

	handleChangeDimension(selectIndex) {
		this.setState({
			selected: selectIndex
		});
		this.props.onReceiveKey(selectIndex);
	};

	render() {
		const {tabList, selected} = this.state;
		let _this = this;
		return (
			<div className="tabbed-box">
				<h4>{tabList.title}</h4>
				<ul>
					{tabList.subList.map((item, key)=> {
						return (
							<li key={key}
								onClick={_this.handleChangeDimension.bind(_this, item.key)}
								className={item.key === selected && 'active'}>
								{item.title}
							</li>
						)
					})}
				</ul>
			</div>
		)
	}
}
module.exports = Tabbed;