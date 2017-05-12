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
						'name': '充值收入 ',
						'self_weidu': 'ALL'
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
						'name': '单位时间（价格/小时）',
						'num_type': 'fixed_2'
					},
					{
						'meta_id': '2923',
						'name': '7日平均',
						'num_type': 'fixed_2'
					},
					{
						'meta_id': '2924',
						'name': '30日平均',
						'num_type': 'fixed_2'
					},
				]
			}
		]
	},
	playUser: {
		title: '玩家分析',
		subList: [
			// {
			// 	title: '各服务器玩家分布',
			// 	key: 'play_map',
			// 	dimensionName: '服务器',
			// 	stockItem: ['登录角色数', '新增角色数'],
			// 	data: [
			// 		{
			// 			'meta_id': '2925',
			// 			'name': '新增角色数'
			// 		},
			// 		{
			// 			'meta_id': '2926',
			// 			'name': '登录角色数'
			// 		}
			// 	]
			// },
			{
				title: '平均启动次数',
				key: 'start_num',
				lineItem: ['平均启动次数'],
				stockItem: ['平均启动次数'],
				chartShow: 'single',
				data: [
					{
						'meta_id': '2927',
						'name': '平均启动次数',
						'num_type': 'fixed_2'
					}
				]
			},
			{
				title: '等级分布',
				key: 'level',
				dimensionName: '等级',
				lineItem: ['等级分布'],
				stockItem: ['等级分布'],
				chartShow: 'single',
				data: [
					{
						'meta_id': '2928',
						'name': '等级分布',

					}
				]
			}
		]
	},
	channelAnalysis: {
		title: '渠道分析',
		role: true,
		subList: [
			{
				title: '登录',
				key: 'play_login',
				dimensionName: '渠道',
				showRange: ['登录', '新增'],
				stockItem: ['登录', '新增'],
				data: [
					{
						'meta_id': '2929',
						'name': '登录角色'
					},
					{
						'meta_id': '2930',
						'name': '新增角色数'
					},
					{
						'meta_id': '2931',
						'name': '付费率',
						'num_type': 'percent'
					},
					{
						'meta_id': '2932',
						'name': '渠道充值占比',
						'num_type': 'percent'
					},
					{
						'meta_id': '2933',
						'name': '充值总金额'
					},
					{
						'meta_id': '2934',
						'name': 'ARPU',
						'num_type': 'fix_2'
					},
					{
						'meta_id': '2935',
						'name': 'ARPPU',
						'num_type': 'fix_2'
					},
					{
						'meta_id': '2930',
						'name': '新增角色数'
					},
					{
						'meta_id': '2936',
						'name': '次日留存',
						'num_type': 'percent'
					},
					{
						'meta_id': '2937',
						'name': '第3日留存',
						'num_type': 'percent'
					},
					{
						'meta_id': '2938',
						'name': '第7日留存',
						'num_type': 'percent'
					}
				]
			},
			{
				title: '付费',
				key: 'play_cash',
				dimensionName: '渠道',
				stockItem: ['充值总金额'],
				lineItem: ['付费率', '渠道充值占比'],
				percent: true,
				data: [
					{
						'meta_id': '2929',
						'name': '登录角色'
					},
					{
						'meta_id': '2930',
						'name': '新增角色数'
					},
					{
						'meta_id': '2931',
						'name': '付费率',
						'num_type': 'percent'
					},
					{
						'meta_id': '2932',
						'name': '渠道充值占比',
						'num_type': 'percent'
					},
					{
						'meta_id': '2933',
						'name': '充值总金额'
					},
					{
						'meta_id': '2934',
						'name': 'ARPU',
						'num_type': 'fix_2'
					},
					{
						'meta_id': '2935',
						'name': 'ARPPU',
						'num_type': 'fix_2'
					},
					{
						'meta_id': '2930',
						'name': '新增角色数'
					},
					{
						'meta_id': '2936',
						'name': '次日留存',
						'num_type': 'percent'
					},
					{
						'meta_id': '2937',
						'name': '第3日留存',
						'num_type': 'percent'
					},
					{
						'meta_id': '2938',
						'name': '第7日留存',
						'num_type': 'percent'
					}
				]
			},
			{
				title: 'ARPU',
				key: 'play_arpu',
				dimensionName: '渠道',
				stockItem: ['ARPU', 'ARPPU'],
				data: [
					{
						'meta_id': '2929',
						'name': '登录角色'
					},
					{
						'meta_id': '2930',
						'name': '新增角色数'
					},
					{
						'meta_id': '2931',
						'name': '付费率',
						'num_type': 'percent'
					},
					{
						'meta_id': '2932',
						'name': '渠道充值占比',
						'num_type': 'percent'
					},
					{
						'meta_id': '2933',
						'name': '充值总金额'
					},
					{
						'meta_id': '2934',
						'name': 'ARPU',
						'num_type': 'fix_2'
					},
					{
						'meta_id': '2935',
						'name': 'ARPPU',
						'num_type': 'fix_2'
					},
					{
						'meta_id': '2930',
						'name': '新增角色数'
					},
					{
						'meta_id': '2936',
						'name': '次日留存',
						'num_type': 'percent'
					},
					{
						'meta_id': '2937',
						'name': '第3日留存',
						'num_type': 'percent'
					},
					{
						'meta_id': '2938',
						'name': '第7日留存',
						'num_type': 'percent'
					}
				]
			},
			{
				title: '留存',
				key: 'play_save',
				dimensionName: '渠道',
				stockItem: ['新增'],
				lineItem: ['次日留存', '第3日留存', '第7日留存'],
				chartShow:'line',
				percent: true,
				data: [
					{
						'meta_id': '2929',
						'name': '登录角色'
					},
					{
						'meta_id': '2930',
						'name': '新增角色数'
					},
					{
						'meta_id': '2931',
						'name': '付费率',
						'num_type': 'percent'
					},
					{
						'meta_id': '2932',
						'name': '渠道充值占比',
						'num_type': 'percent'
					},
					{
						'meta_id': '2933',
						'name': '充值总金额'
					},
					{
						'meta_id': '2934',
						'name': 'ARPU',
						'num_type': 'fix_2'
					},
					{
						'meta_id': '2935',
						'name': 'ARPPU',
						'num_type': 'fix_2'
					},
					{
						'meta_id': '2930',
						'name': '新增角色数'
					},
					{
						'meta_id': '2936',
						'name': '次日留存',
						'num_type': 'percent'
					},
					{
						'meta_id': '2937',
						'name': '第3日留存',
						'num_type': 'percent'
					},
					{
						'meta_id': '2938',
						'name': '第7日留存',
						'num_type': 'percent'
					}
				]
			}
		]
	},
	economy: {
		title: '经济情况',
		subList: [
			{
				title: '元宝回收产出比',
				key: 'gold_back',
				stockItem: ['元宝回收量', '元宝产出量'],
				lineItem: ['元宝回收产出比'],
				data: [
					{
						'meta_id': '2939',
						'name': '元宝回收量',
					},
					{
						'meta_id': '2940',
						'name': '元宝产出量',
					},
					{
						'meta_id': '2941',
						'num_type':'fixed_2',
						'name': '元宝回收产出比',
					}
				]
			},
			{
				title: '元宝产出途径',
				key: 'gold_product',
				dimensionName: '途径',
				stockItem: ['产出元宝数量'],
				lineItem: ['产出元宝角色数', '产出元宝次数'],
				chartShow:'line',
				data: [
					{
						'meta_id': '2942',
						'name': '产出元宝数量',
					},
					{
						'meta_id': '2943',
						'name': '产出元宝次数',
					},
					{
						'meta_id': '2944',
						'name': '产出元宝角色数',
					}
				]
			},
			{
				title: '元宝回收途径',
				key: 'gold_back_approach',
				dimensionName: '途径',
				stockItem: ['回收元宝数量'],
				lineItem: ['回收元宝次数', '回收元宝角色数'],
				chartShow:'line',
				data: [
					{
						'meta_id': '2945',
						'name': '回收元宝数量',
					},
					{
						'meta_id': '2946',
						'name': '回收元宝次数',
					},
					{
						'meta_id': '2947',
						'name': '回收元宝角色数',
					}
				]
			}
		]
	}
};
