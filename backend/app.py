from flask import Flask, jsonify, render_template
import datetime

app = Flask(__name__, static_folder='static', template_folder='templates')

@app.route('/')
def index():
    return render_template('index.html')

def generate_candlestick_data(start_price, num_days):
    data = []
    price = start_price
    for i in range(num_days):
        date = (datetime.date(2023, 1, 1) + datetime.timedelta(days=i)).isoformat()
        open_price = price
        close_price = open_price + (1 if i % 2 == 0 else -1) * (i * 0.1)
        high_price = max(open_price, close_price) + (i * 0.05)
        low_price = min(open_price, close_price) - (i * 0.05)
        data.append({'time': date, 'open': open_price, 'high': high_price, 'low': low_price, 'close': close_price})
        price = close_price
    return data

@app.route('/api/data/<path:symbol>')
def get_data(symbol):
    data = {
        'EUR/USD': generate_candlestick_data(1.10, 30),
        'GBP/USD': generate_candlestick_data(1.38, 30),
        'USD/JPY': generate_candlestick_data(110.0, 30),
        'AUD/USD': generate_candlestick_data(0.75, 30),
        'USD/CAD': generate_candlestick_data(1.25, 30),
        'BTC/USD': generate_candlestick_data(45000, 30),
        'ETH/USD': generate_candlestick_data(3000, 30),
        'ADA/USD': generate_candlestick_data(2.20, 30),
        'DOGE/USD': generate_candlestick_data(0.25, 30),
        'XRP/USD': generate_candlestick_data(1.10, 30),
        'AAPL': generate_candlestick_data(150, 30),
        'GOOGL': generate_candlestick_data(2800, 30),
        'MSFT': generate_candlestick_data(300, 30),
        'AMZN': generate_candlestick_data(3400, 30),
        'TSLA': generate_candlestick_data(750, 30),
    }
    symbol_key = symbol.split(' ')[0]
    return jsonify(data.get(symbol_key, []))

@app.route('/api/ai-suggestion/<path:symbol>')
def get_ai_suggestion(symbol):
    import random
    suggestions = [
        f"Based on recent trends, {symbol} shows strong bullish signals. Consider buying.",
        f"Market sentiment for {symbol} is currently bearish. It may be wise to sell or hold.",
        f"Volatility for {symbol} is high. This could be a good opportunity for short-term traders.",
        f"Our analysis indicates a potential breakout for {symbol}. Keep a close watch.",
        f"A consolidation phase is expected for {symbol}. Long-term investors might consider this a good entry point."
    ]
    suggestion = random.choice(suggestions)
    return jsonify({'suggestion': suggestion})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True, use_reloader=False)