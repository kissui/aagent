export default {
    renderLineChart(data) {
        let chartDOM = document.getElementById('realTimeChartLine');
        chartDOM.innerHTML = null;

        const chart = new G2.Chart({
            id: 'realTimeChartLine',
            forceFit: true,
            height: 300
        });

        var Frame = G2.Frame;
        var frame = new Frame(data);
        frame = Frame.combinColumns(frame, ['today', 'yesterday'], 'population', 'kpi', '日期');
        let range = 1;

        if (data && data.length >= 20) {
            range = 8
        }
        let colors = ['#45594e', '#8fbeac', '#5e9882', '#fbbe7b', '#fff6e5', '#e89ba5', '#f5de50', '#f6deda', '#fbbe7a'];
        chart.source(frame, {
            "日期": {
                alias: '时间',
                tickCount: range,
            },
            "population": {
                alias: '在线人数'
            }
        });
        chart.line().position('日期*population').color('kpi', colors).size(2).shape('smooth');
        chart.render();
    },
    renderIntervalChart(data) {
        let chartDOM = document.getElementById('realTimeChartInterval');
        chartDOM.innerHTML = null;
        const chart = new G2.Chart({
            id: 'realTimeChartInterval',
            forceFit: true,
            height: 300
        });
        let range = 1;

        if (data && data.length > 20) {
            range = 5
        }
        chart.source(data, {
            "value": {
                alias: '服务器在线人数',
                type: 'linear',
                min: 0,
                // tickInterval: 1000
            }
        });
        chart.legend(false);
        chart.interval().position('服务器名称*value').shape('textInterval').color('服务器名称').size(30);
        chart.render();
    }
}
