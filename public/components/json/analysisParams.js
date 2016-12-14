'use strict';

module.exports = {
	tabList: {
		title: '付费情况',
		subList: [
			{
				title: '充值收入',
				key: 'count',
				data: [
					{
						'meta_id': '2819',
						'name': '充值收入 '
					}
				]
			},
			{
				title: '付费角色',
				key: 'cash',
				data: [
					{
						'meta_id': '2818',
						'name': '付费角色 '
					},
					{
						'meta_id': '2914',
						'name': '首次付费角色数 '
					}
				]
			},
			{
				title: '付费率',
				key: 'cash_percent',
				role: 'true',
				data: [
					{
						'meta_id': '2874',
						'name': '角色付费率 ',
						'num_type': 'percent'
					},
					{
						'meta_id': '2816',
						'name': '登录角色'
					},
				]
			},
			{
				title: 'ARRPU',
				key: 'arrpu',
				role: 'true',
				data: [
					{
						'meta_id': '2816',
						'name': '角色ARPU',
						'num_type': 'fixed_2'
					},
					{
						'meta_id': '2875',
						'name': '角色ARPPU',
						'num_type': 'fixed_2'
					},
				]
			},
			{
				title: 'VIP等级分布',
				key: 'vip',
				dimensionName: 'VIP等级',
				data: [
					{
						'meta_id': '2916',
						'name': '收入'
					},
					{
						'meta_id': '2917',
						'name': 'VIP人数'
					},
				]
			},
			{
				title: '充值额度分布',
				key: 'cash_limit',
				dimensionName: '充值项目',
				data: [
					{
						'meta_id': '2918',
						'name': '现金'
					},
					{
						'meta_id': '2919',
						'name': '角色数'
					},
					{
						'meta_id': '2920',
						'name': '元宝'
					},
					{
						'meta_id': '2921',
						'name': '充值次数'
					},
				]
			},
			{
				title: '单位时间价格',
				key: 'price_date',
				data: [
					{
						'meta_id': '2922',
						'name': '单位时间（价格/小时）'
					},
					{
						'meta_id': '2923',
						'name': '7日平均'
					},
					{
						'meta_id': '2924',
						'name': '30日平均'
					},
				]
			}
		]
	},
	playUser: {
		title: '玩家分析',
		subList: [
			{
				title: '各服务器玩家分布',
				key: 'play_map',
				data: [
					{
						'meta_id': '2925',
						'name': '新增角色数'
					},
					{
						'meta_id': '2926',
						'name': '登录角色数'
					}
				]
			},
			{
				title: '平均启动次数',
				key: 'start_num',
				data: [
					{
						'meta_id': '2927',
						'name': '平均启动次数'
					}
				]
			},
			{
				title: '等级分布',
				key: 'level',
				data: [
					{
						'meta_id': '2928',
						'name': '等级分布',
						'num_type': 'fixed_2'
					}
				]
			}
		]
	}
};