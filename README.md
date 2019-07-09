## Backend Ticker

An application to proxy public exchange APIs




##### Potential Useful libraries

Javascript Web Proxy
https://github.com/nodejitsu/node-http-proxy





###### Example Requests

Tickers

```
curl -H "Content-Type:application/json" -X GET "https://test-moonassist-backend-ticker.herokuapp.com/tickers?exchange=hitbtc2&symbol=BTC/USDT"
```

Markets

```
curl -H "Content-Type:application/json" -X GET "https://test-moonassist-backend-ticker.herokuapp.com/tickers?exchange=gdax&symbol=BTC/USD"
```

CandleSticks

```
curl -H "Content-Type:application/json" -X GET "https://test-moonassist-backend-ticker.herokuapp.com/candlesticks?exchange=gdax&symbol=BTC/USD"
```
