document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    const chartContainer = document.getElementById('chart');
    let chart = null;
    let series = null;

    const darkTheme = {
        chart: {
            layout: {
                backgroundColor: '#1E1E1E',
                textColor: '#FFFFFF',
            },
            grid: {
                vertLines: { color: '#444' },
                horzLines: { color: '#444' },
            },
        },
        series: {
            upColor: '#26a69a',
            downColor: '#ef5350',
            borderDownColor: '#ef5350',
            borderUpColor: '#26a69a',
            wickDownColor: '#ef5350',
            wickUpColor: '#26a69a',
        }
    };

    const lightTheme = {
        chart: {
            layout: {
                backgroundColor: '#FFFFFF',
                textColor: '#000000',
            },
            grid: {
                vertLines: { color: '#E0E0E0' },
                horzLines: { color: '#E0E0E0' },
            },
        },
        series: {
            upColor: '#26a69a',
            downColor: '#ef5350',
            borderDownColor: '#ef5350',
            borderUpColor: '#26a69a',
            wickDownColor: '#ef5350',
            wickUpColor: '#26a69a',
        }
    };

    function getCurrentTheme() {
        return body.classList.contains('light-theme') ? lightTheme : darkTheme;
    }

    async function renderChart(symbol) {
        if (chart) {
            chart.remove();
            chart = null;
        }

        const currentTheme = getCurrentTheme();
        chart = LightweightCharts.createChart(chartContainer, currentTheme.chart);
        series = chart.addCandlestickSeries(currentTheme.series);

        try {
            const response = await fetch(`http://127.0.0.1:5000/api/data/${symbol}`);
            const data = await response.json();
            series.setData(data);
            chart.timeScale().fitContent();
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    themeToggle.addEventListener('click', (e) => {
        e.preventDefault();
        body.classList.toggle('light-theme');
        if (chart) {
            const currentTheme = getCurrentTheme();
            chart.applyOptions(currentTheme.chart);
            series.applyOptions(currentTheme.series);
        }
    });

    // Initial chart render
    const initialSymbol = document.getElementById('symbol-select').value;
    renderChart(initialSymbol);

    // Add event listener for symbol selection
    document.getElementById('symbol-select').addEventListener('change', (e) => {
        renderChart(e.target.value);
    });
});