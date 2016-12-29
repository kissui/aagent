''
'use strict';
import React from 'react';

export default class TooltipModule extends React.Component {
	constructor(props, context) {
		super(props, context);
		const {onStyle} = this.props;
		this.state = {
			style: onStyle ? onStyle : {
				width: '100%',
				height: '30px',
				lineHeight: '30px',
				background: '#eb7e68',
				color: '#fff',
				fontSize: '14px',
				borderRadius: '5px',
				padding: '0 10px'
			},
			isShow: true
		}
	}

	handleCloseTip() {
		this.setState({
			isShow: false
		})
	}

	render() {
		const {style, isShow} = this.state;
		return (
			<div style={isShow ? style : {display: 'none'}}>
				<i className="fa fa-info-circle"></i>
				<span>{this.props.onText}</span>
				<i className="fa fa-window-close text-right"
				   style={{
					   float: 'right',
					   marginTop: '7px'
				   }}
				   onClick={this.handleCloseTip.bind(this)}
				>
				</i>
			</div>
		)
	}
}