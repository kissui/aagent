'use strict';

export default {
	reg (item,type) {
		let reg = /^(\d*\.)+\d+$/;
		let regDate = /^(\d*\-)+\d+$/;
		if(type) return reg.test(item) ? ((item * 100).toFixed(1) + '%') : (regDate.test(item)? item : parseFloat(item));
		return reg.test(item) ? ((item * 100).toFixed(1)) : parseFloat(item);
	},
	dealChartData (names, fields) {
		const chartData = [];
		let surveyName = names;
		fields.map((item, i)=> {
			const obj = {};
			item.map((superItem, k)=> {
				obj[surveyName[k]] = surveyName[k] === '日期' ? superItem : (superItem === '' ? 0 : this.reg(superItem))
			});
			chartData.push(obj)
		});
		return chartData;
	},
	handleShowChart (id, data, indicators, dimensions) {
		document.getElementById(id).innerHTML = null;
		var chart = new G2.Chart({
			id: id,
			forceFit: true,
			height: 200,
			plotCfg: {
				margin: [0, 0, 30, 0]
			}
		});
		var Frame = G2.Frame;
		var frame = new Frame(data);
		chart.axis('日期', {
			formatter: function (dimValue) {
				return dimValue.slice(8) + '';
			}
		});
		frame = Frame.combinColumns(frame, indicators, 'population', 'kpi', dimensions);
		chart.legend(false);
		chart.source(frame);
		chart.interval(['stack']).position('日期*population').color('kpi');// 使用图形语法绘制柱状图
		if (dimensions.length > 1) {
			let d = dimensions.slice(1).join('*');
			chart.line().position(dimensions[0] + '*' + d).color('kpi');
		}
		chart.render();
	}
}