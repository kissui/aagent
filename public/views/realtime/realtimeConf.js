'use strict';

export default {
	realTimeRoleConf: [
		{
			title: '账号',
			value: 'account'
		},
		{
			title: '角色',
			value: 'role'
		}
	],
	realTimeChartTypeBar: [
		{
			title: '累计分布',
			value: 'all'
		},
		{
			title: '分时分布',
			value: 'step'
		}
	],
	realTimeDetailNavLists: [
		// {
		// 	title: '实时在线',
		// 	id: '234',
		// 	showRight: 'no'
		// },
		{
			title: '新增',
			id: '234',
			showRight: 'all'
		},
		{
			title: '登录',
			id: '234',
			showRight: 'role'
		},
		{
			title: '收入金额',
			id: '234',
			showRight: 'chartType'
		},
		{
			title: '付费角色',
			id: '234',
			showRight: 'no'
		}
	],
	dealParamsConf(param) {
		let name = param ? param : '账号';
		return [
			{
				'meta_id': '3003',
				'name': '登录' + name,
			},
			{
				'meta_id': '3002',
				'name': '新增' + name,
			},
			{
				'meta_id': '3006',
				'name': '老玩家'+name,
				'self_weidu': 'pcu'
			},
			{
				'meta_id': '3004',
				'name': '付费角色',
			},
			{
				'meta_id': '3008',
				'name': '人均游戏次数',
				'self_weidu': 'all',
				'num_type': 'fixed_2'
			},
			{
				'meta_id': '3005',
				'name': '实时次日留存',
				'num_type': 'percent'
			},
			{
				'meta_id': '3007',
				'name': '付费次数',
				'self_weidu': 'all'
			},
			{
				'meta_id': '3009',
				'name': '充值收入',
				'self_weidu': 'all'
			}
		]
	}
}