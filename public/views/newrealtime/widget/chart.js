export default {
    renderLineChart(data) {
        let chartDOM = document.getElementById('realTimeChartLine');
        chartDOM.innerHTML = null;
        const chart = new G2.Chart({
            id: 'realTimeChartLine',
            forceFit: true,
            height: 300
        });
        let range = 1;

        if (data && data.length > 20) {
            range = 5
        }
        chart.source(data, {
            "日期": {
                alias: '时间',
                range: [0, range]
            },
            "人数": {
                alias: '在线人数'
            }
        });
        chart.line().position('日期*人数').size(2).shape('smooth');
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
                alias: '服务器在线人数'
            }
        });
        chart.interval().position('服务器名称*value').shape('smooth');
        chart.render();
    }
}
