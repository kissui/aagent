'use strict';
import _ from 'lodash';
Number.prototype.flover = function(c, d, t) {
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
    reg(item, type) {

        let reg = /^(\d*\.)+\d+$/;
        let percent = /^(\d*\,)+\d+%$/;
        let china = /^[\u4e00-\u9fa5]/;
        let regDate = /^(\d*\-)+\d+$/;
        let contentReg = /^(\d*\,)+\d+(\.?)+\d+$/;
        let letterStart = /^[a-zA-Z]+/;
        if (typeof type != 'number' && type > 1) return china.test(item) ? item : reg.test(item) ? ((item * 100).toFixed(1) + '%') : (regDate.test(item) ? item : parseFloat(item));
        return type === 0 ? item : contentReg.test(item) ? parseFloat(item.split(',').join('')) :
            typeof item == 'string' ? ((china.test(item) || letterStart.test(item)) ? item : parseFloat(item)) : item + '';
    },
    filterKey(key, col, type) {
        _.forEach(collection, (item) => {
            if (key === item && 'percent') {
                return item
            } else {
                return item;
            }
        })
    },
    dealChartData(names, fields, real) {
        const chartData = [];
        let surveyName = names;
        fields.map((item, i) => {
            const obj = {};
            item.map((superItem, k) => {
                obj[surveyName[k]] = surveyName[k] == '日期' ? (real ? superItem.split('%')[0] : superItem.split('%')[1]) :
                    ((superItem === '' || superItem === 0) ? 0 : this.reg(superItem, k))
            });
            chartData.unshift(obj)
        });
        return chartData;
    },
    handleShowChart(id, data, indicators, dimensions, chartConf) {
        let chartDOM = document.getElementById(id);
        if (chartDOM && chartDOM.length > 0)
            chartDOM.innerHTML = null;
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
        var Stat = G2.Stat;
        chart.axis('日期', {
            formatter: function(dimValue) {
                return dimValue;
            }
        });
        chart.legend(false);
        let colors = ['#45594e', '#8fbeac', '#5e9882', '#fbbe7b', '#fff6e5', '#e89ba5', '#f5de50', '#f6deda', '#fbbe7a'];
        let stackColor = colors.slice(0, indicators.length);
        if (_.isObject(chartConf) && chartConf.showType === 'line') {
            let lineIndicators = dimensions.slice(1);
            let lineDimensions = _.concat(dimensions.slice(0, 1), indicators);
            frame = Frame.combinColumns(frame, lineIndicators, 'population', 'kpi', lineDimensions, 'di');
            chart.source(frame);
            chart.interval().position(lineDimensions.join('*')).color(colors.slice(0, 1)); // 使用图形语法绘制柱状图
            chart.line().position('日期*population').color('kpi', colors.slice(1)).size(2).shape('smooth');
            chart.point().position('日期*population').color('kpi', colors.slice(1)); // 绘制点图
            if (chartConf.percent) {
                chart.on('tooltipchange', function(ev) {
                    var items = ev.items; // 获取tooltip要显示的内容
                    items.map((sitem, i) => {
                        if (i > 0 && sitem.value != 0) {

                            sitem.value = sitem.value + '%';
                        }
                    })
                });
            }
        } else {
            frame = Frame.combinColumns(frame, indicators, 'population', 'kpi', dimensions, 'di');
            chart.source(frame);
            chart.interval(['dodge', 'stack']).position('日期*population').color('kpi', stackColor); // 使用图形语法绘制柱状图
            if (dimensions.length > 0) {
                let d = dimensions.slice(1).join('*');
                let reverseColors = colors.reverse();
                dimensions.map((item, i) => {
                    if (i > 0 && i != 0) {
                        chart.line().position('日期*' + item).color(reverseColors[i]).size(2).shape('smooth');
                        chart.on('tooltipchange', function(ev) {
                            var items = ev.items; // 获取tooltip要显示的内容
                            items.map((sitem, i) => {
                                if (sitem.name == item) {
                                    sitem.value = sitem.value + '%';
                                }
                            })
                        });
                        chart.point().position('日期*' + item).color(reverseColors[i]); // 绘制点图
                    }
                })

            }
        }

        chart.render();
    },
    handleShowAnalysisChart(id, data, indicators, dimensions, doubleYLine) {
        let chartDOM = document.getElementById(id);
        let chartRange = document.getElementById('range');
        if (chartRange && chartRange.innerHTML)
            chartRange.innerHTML = null;
        if (chartDOM && chartDOM.innerHTML)
            chartDOM.innerHTML = null;
        var chart = new G2.Chart({
            id: id,
            forceFit: true,
            height: 400,
            plotCfg: {
                margin: [35, 80, 50, 80]
            }
        });
        var Frame = G2.Frame;
        var frame = new Frame(data);
        chart.axis('日期', {
            formatter: function(dimValue) {
                return dimValue;
            },
            title: null
        });
        chart.axis('population', {
            formatter: function(dimValue) {
                return dimValue;
            },
            title: null
        });
        let colors = ['#45594e', '#8fbeac', '#5e9882', '#fbbe7b', '#fff6e5', '#e89ba5', '#f5de50', '#f6deda', '#fbbe7a'];

        chart.legend({
            position: 'top', // 图例的显示位置，有 'top','left','right','bottom'四种位置，默认是'right'
        });
        let dimensionsDodge = dimensions.slice(0, 1);
        let stackColor = colors.slice(0, indicators.length);
        if (doubleYLine === 'line') {
            let lineDimensions = dimensions.slice(0, 1);
            let lineKpis = dimensions.slice(1);
            let stockDimension = _.concat(lineDimensions, indicators);
            frame = Frame.combinColumns(frame, lineKpis, 'population', 'kpi', stockDimension, 'di');
            chart.source(frame, {
                'population': {
                    min: 0
                },
                [indicators.join('')]: {
                    min: 0
                }
            });
            chart.interval().position(dimensionsDodge + '*' + indicators.join('')).color(colors.slice(colors.length - 1));
            chart.line().position(dimensionsDodge + "*population").color('kpi', colors).size(2).shape('smooth');
            chart.point().position(dimensionsDodge + "*population").color('kpi', colors); // 绘制点图
        } else if (doubleYLine === 'single') {
            frame = Frame.combinColumns(frame, indicators, 'population', 'kpi', dimensions, 'di');
            chart.source(frame);
            chart.line().position(dimensionsDodge + "*" + indicators.join('')).color(colors.slice(colors.length - 1)).size(2).shape('smooth');
            chart.point().position(dimensionsDodge + "*" + indicators.join('')).color(colors.slice(colors.length - 1)); // 绘制点图
        } else {
            frame = Frame.combinColumns(frame, indicators, 'population', 'kpi', dimensions, 'di');
            chart.source(frame);
            if (indicators && indicators.length > 0) {
                chart.interval(['dodge', 'stack']).position(dimensionsDodge + '*population').color('kpi', stackColor); // 使用图形语法绘制柱状图
            }
            if (dimensions && dimensions.length > 1) {
                let lineXPosition = dimensions.slice(0, 1);
                let linePosition = dimensions.slice(1);
                let reverseColors = colors.reverse();
                linePosition.map((item, i) => {
                    chart.line().position(lineXPosition + "*" + item).color(reverseColors[i]).size(2).shape('smooth');
                    chart.point().position(lineXPosition + "*" + item).color(reverseColors[i]); // 绘制点图
                });

            }
        }

        chart.render();
    },
    handleShowAnalysisLine(id, data, indicators, dimensions, showRange) {
        let chartDOM = document.getElementById(id);
        let chartRange = document.getElementById('range');
        if (chartRange && chartRange.innerHTML)
            chartRange.innerHTML = null;
        if (chartDOM && chartDOM.innerHTML)
            chartDOM.innerHTML = null;
        var chart = new G2.Chart({
            id: id,
            forceFit: true,
            height: 400,
            plotCfg: {
                margin: [35, 80, 50, 80]
            }
        });
        for (var i = 0; i < data.length; i++) {
            var item = data[i];
            var time = item['日期'];
            item.time = new Date(time).getTime();
        }

        var Frame = G2.Frame;
        var frame = new Frame(data);
        frame.addCol('range', function(obj) { // 添加列
            return [obj.start, obj.end];
        });
        chart.axis('population', {
            formatter: function(dimValue) {
                return dimValue;
            },
            title: null
        });
        chart.axis('日期', {
            formatter: function(dimValue) {
                return dimValue;
            },
            title: null
        });
        let colors = ['#45594e', '#8fbeac', '#5e9882', '#fbbe7b', '#fff6e5', '#e89ba5', '#f5de50', '#f6deda', '#fbbe7a'];
        let stackColor = colors.slice(0, indicators.length);
        frame = Frame.combinColumns(frame, indicators, 'population', 'kpi', dimensions, 'di');
        chart.legend({
            position: 'top', // 图例的显示位置，有 'top','left','right','bottom'四种位置，默认是'right'
        });
        chart.source(frame, {
            '日期': {
                type: 'timeCat',
                nice: false,
                mask: 'mm-dd',
                alias: '时间',
                tickCount: 7
            }
        });
        chart.on('tooltipchange', function(ev) {
            var items = ev.items; // 获取tooltip要显示的内容
            items.map((sitem, i) => {
                if (sitem.name == item) {
                    sitem.value = sitem.value + '%';
                }
            })
        });
        chart.line().position('日期*population').color('kpi', stackColor).size(2).shape('smooth'); // 使用图形语法绘制柱状图
        if (showRange === 'link') {
            var range = new G2.Plugin.range({
                id: "range", // DOM id
                forceFit: true, // 插件的宽度
                height: 30, // 插件的高度
                dim: '日期', // 指定筛选的数据维度
                start: '2016-12-22', // 起始原始数据
                end: '2016-12-26', // 结束原始数据
            });
            range.source(frame); // 载入数据源
            range.link(chart); // 关联 G2 图表对象，支持一个或者多个 chart 对象
            range.render(); // 渲染，将 chart 和 range 插件一起渲染
        }
        chart.render();
    },
    handleShowRealTimeDetail(id, data, blank) {
        let chartDOM = document.getElementById(id);
        if (chartDOM && chartDOM.innerHTML)
            chartDOM.innerHTML = null;
        var chart = new G2.Chart({
            id: id,
            forceFit: true,
            height: 400,
            plotCfg: {
                margin: [35, 80, 50, 80]
            }
        });

        var Frame = G2.Frame;
        var frame = new Frame(data);
        chart.axis('population', {
            formatter: function(dimValue) {
                return dimValue;
            },
            title: null
        });
        chart.axis('日期', {
            formatter: function(dimValue) {
                return dimValue;
            },
            title: null
        });
        let colors = ['#45594e', '#8fbeac', '#5e9882', '#fbbe7b', '#fff6e5', '#e89ba5', '#f5de50', '#f6deda', '#fbbe7a'];
        frame = Frame.combinColumns(frame, blank, 'population', 'kpi', '日期');
        chart.legend({
            position: 'top', // 图例的显示位置，有 'top','left','right','bottom'四种位置，默认是'right'
        });
        chart.source(frame, {
            '日期': {
                tickCount: 12
            }
        });
        chart.line().position('日期*population').color('kpi', colors).size(2).shape('smooth'); // 使用图形语法绘制柱状图
        chart.render();
    },
    handleShowCustomChart(id, data, indicators, dimensions) {
        let chartDOM = document.getElementById(id);
        if (chartDOM && chartDOM.innerHTML)
            chartDOM.innerHTML = null;
        var chart = new G2.Chart({
            id: id,
            forceFit: true,
            height: 400,
            plotCfg: {
                margin: [35, 0, 50, 80]
            }
        });
        var Frame = G2.Frame;
        var frame = new Frame(data);
        chart.axis('日期', {
            formatter: function(dimValue) {
                return dimValue;
            },
            title: null
        });
        chart.axis('population', {
            formatter: function(dimValue) {
                return dimValue;
            },
            title: null
        });
        chart.legend(false);
		// frame = Frame.combinColumns(frame, blank, 'population', 'kpi', '日期');
        chart.source(frame);
        chart.interval().position(dimensions+'*'+indicators).color('#45594e'); // 使用图形语法绘制柱状图
		// chart.line().position(dimensions+'*'+indicators).color('#45594e');
        chart.render();
    },
}
