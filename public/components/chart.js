'use strict';
import _ from 'lodash';
const FOOTBAR_FLAG = false;
export default {
	reg (item, type) {
		let reg = /^(\d*\.)+\d+$/;
		let percent = /^(\d*\.)+\d+%$/;
		let china = /^[\u4e00-\u9fa5]/;
		let regDate = /^(\d*\-)+\d+$/;
		if (type) return china.test(item) ? item : reg.test(item) ? ((item * 100).toFixed(1) + '%') : (regDate.test(item) ? item : parseFloat(item));
		return percent.test(item) ? parseFloat(item.slice(0, item.length - 1)) : parseFloat(item);
	},
	filterKey (key, col, type) {
		_.forEach(collection, (item)=> {
			if (key === item && 'percent') {
				return item
			} else {
				return item;
			}
		})
	},
	dealChartData (names, fields) {
		const chartData = [];
		let surveyName = names;
		fields.map((item, i)=> {
			const obj = {};

			item.map((superItem, k)=> {
				obj[surveyName[k]] = surveyName[k] == '日期' ? superItem.split('%')[1] : (superItem === '' ? 0 : this.reg(superItem))
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
		console.log(frame);
		chart.axis('日期', {
			formatter: function (dimValue) {
				return dimValue;
			}
		});
		let colors = ['#45594e', '#8fbeac', '#5e9882', '#fbbe7b', '#fff6e5', '#e89ba5', '#f5de50', '#f6deda', '#fbbe7a'];
		let stackColor = colors.slice(0, indicators.length);
		frame = Frame.combinColumns(frame, indicators, 'population', 'kpi', dimensions, 'di');
		chart.legend(false);
		chart.source(frame);
		chart.interval(['dodge', 'stack']).position('日期*population').color('kpi', stackColor);// 使用图形语法绘制柱状图
		if (dimensions.length > 0) {
			let d = dimensions.slice(1).join('*');
			let reverseColors = colors.reverse();
			dimensions.map((item, i)=> {
				if (i > 0 && i != 0) {
					chart.line().position('日期*' + item).color(reverseColors[i]).size(2).shape('smooth');
					chart.point().position('日期*' + item).color(reverseColors[i]); // 绘制点图
				}
			})

		}
		chart.render();
	}
}