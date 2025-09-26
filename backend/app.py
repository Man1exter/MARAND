from flask import Flask, jsonify
from flask_cors import CORS
import datetime

app = Flask(__name__)
CORS(app)

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

@app.route('/api/data/<symbol>')
def get_data(symbol):
    data = {
        'EUR-USD': generate_candlestick_data(1.10, 30),
        'GBP-USD': generate_candlestick_data(1.38, 30),
        'BTC-USD': generate_candlestick_data(45000, 30),
        'ETH-USD': generate_candlestick_data(3000, 30),
        'AAPL': generate_candlestick_data(150, 30),
        'GOOGL': generate_candlestick_data(2800, 30)
    }
    # Use replace to match the format from the frontend select options
    symbol_key = symbol.replace('/', '-')
    return jsonify(data.get(symbol_key, []))

if __name__ == '__main__':
    app.run(debug=True)