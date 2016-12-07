'use strict';
import _ from 'lodash';
Number.prototype.flover = function (c, d, t) {
	var n = this,
		c = isNaN(c = Math.abs(c)) ? 2 : c,
		d = d == undefined ? "." : d,
		t = t == undefined ? "," : t,
		s = n < 0 ? "-" : "",
		i = String(parseInt(n = Math.abs(Number(n) || 0).toFixed(c))),
		jj = i.length,
		j = jj > 3 ? jj % 3 : 0;
	return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
};
export default {
	reg (item, type) {
		let reg = /^(\d*\.)+\d+$/;
		let percent = /^(\d*\,)+\d+%$/;
		let china = /^[\u4e00-\u9fa5]/;
		let regDate = /^(\d*\-)+\d+$/;
		let contentReg = /^(\d*\,)+\d+(\.?)+\d+$/;
		if (type) return china.test(item) ? item : reg.test(item) ? ((item * 100).toFixed(1) + '%') : (regDate.test(item) ? item : parseFloat(item));
		return contentReg.test(item) ? parseFloat(item.split(',').join('')) : parseFloat(item);
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
		// console.log(chartData,'chartData')
		return chartData;
	},
	handleShowChart (id, data, indicators, dimensions) {
		document.getElementById(id).innerHTML = null;
		var chart = new G2.Chart({
			id: id,
			forceFit: true,
			height: 200,
			plotCfg: {
				margin: [0, 0, 50, 0]
			}
		});
		var Frame = G2.Frame;
		var frame = new Frame(data);
		// console.log(frame);
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
					chart.on('tooltipchange', function (ev) {
						var items = ev.items; // 获取tooltip要显示的内容
						items.map((sitem, i)=> {
							if (sitem.name == item) {
								sitem.value = sitem.value + '%';
							}
						})
					});
					chart.point().position('日期*' + item).color(reverseColors[i]); // 绘制点图
				}
			})

		}
		chart.render();
	}
}