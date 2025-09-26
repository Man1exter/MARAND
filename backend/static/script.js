window.addEventListener('error', function(event) {
    const chartContainer = document.getElementById('chart');
    if (chartContainer) {
        chartContainer.innerHTML = `<p style="color: red; font-size: 1.2em;">JavaScript Error: ${event.message}</p>`;
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    const chartContainer = document.getElementById('chart');
    const userNameInput = document.getElementById('user-name');
    const saveNameButton = document.getElementById('save-name');
    const aiSuggestionContainer = document.getElementById('ai-suggestion');

    // Load and display the saved user name
    const savedName = localStorage.getItem('userName');
    if (savedName) {
        userNameInput.value = savedName;
    }

    // Save the user name to local storage
    saveNameButton.addEventListener('click', () => {
        const newName = userNameInput.value;
        if (newName) {
            localStorage.setItem('userName', newName);
            alert('Name saved!');
        }
    });

    let chart = null;
    let series = null;

    const darkTheme = { chart: { layout: { backgroundColor: '#1E1E1E', textColor: '#FFFFFF' }, grid: { vertLines: { color: '#444' }, horzLines: { color: '#444' } } }, series: { upColor: '#26a69a', downColor: '#ef5350', borderDownColor: '#ef5350', borderUpColor: '#26a69a', wickDownColor: '#ef5350', wickUpColor: '#26a69a' } };
    const lightTheme = { chart: { layout: { backgroundColor: '#FFFFFF', textColor: '#000000' }, grid: { vertLines: { color: '#E0E0E0' }, horzLines: { color: '#E0E0E0' } } }, series: { upColor: '#26a69a', downColor: '#ef5350', borderDownColor: '#ef5350', borderUpColor: '#26a69a', wickDownColor: '#ef5350', wickUpColor: '#26a69a' } };

    function getCurrentTheme() {
        return body.classList.contains('light-theme') ? lightTheme : darkTheme;
    }

    async function getAiSuggestion(symbol) {
        try {
            const response = await fetch(`/api/ai-suggestion/${symbol}`);
            const data = await response.json();
            aiSuggestionContainer.innerHTML = `<p>${data.suggestion}</p>`;
        } catch (error) {
            console.error('Error fetching AI suggestion:', error);
            aiSuggestionContainer.innerHTML = `<p style="color: red;">Error: ${error.message}</p>`;
        }
    }

    async function renderChart(symbol) {
        if (chart) {
            chart.remove();
            chart = null;
        }

        chartContainer.innerHTML = ''; // Clear previous error messages

        const currentTheme = getCurrentTheme();
        chart = LightweightCharts.createChart(chartContainer, currentTheme.chart);
        series = chart.addCandlestickSeries(currentTheme.series);

        try {
            const response = await fetch(`/api/data/${symbol}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            series.setData(data);
            chart.timeScale().fitContent();
            getAiSuggestion(symbol);
        } catch (error) {
            console.error('Error fetching data:', error);
            chartContainer.innerHTML = `<p style="color: red;">Error: ${error.message}</p>`;
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

    const initialSymbol = document.getElementById('symbol-select').value;
    renderChart(initialSymbol);

    document.getElementById('symbol-select').addEventListener('change', (e) => {
        renderChart(e.target.value);
    });
});