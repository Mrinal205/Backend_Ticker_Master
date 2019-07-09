'use strict'

const candleStickService = require('./candlestick-service')

//Bittrex
//const event = {
//  exchange: 'bittrex',
//  symbol: 'BTC/USDT',
//  interval: '5m' //Valid are 1m, 5m, 30m, 1h, 1d
//}


//GDAX
//https://docs.gdax.com/#get-historic-rates
//const event = {
//  exchange: 'gdax',
//  symbol: 'BTC/USD',
//  interval: '6h' //Valid are 1m, 5m, 15m, 1h, 6h, 1d (one minute, five minutes, fifteen minutes, one hour, six hours, and one day)
//}

//Binance
//https://github.com/binance-exchange/binance-official-api-docs/blob/master/rest-api.md
const event = {
  exchange: 'binance',
  symbol: 'BTC/USDT',
  interval: '1M', //Valid are 1m 3m 5m 15m 30m 1h 2h 4h 6h 8h 12h 1d 3d 1w 1M
  since: 1517443200000,
}

//Kraken
//https://www.kraken.com/help/api#get-ohlc-data
//const event = {
//  exchange: 'kraken',
//  symbol: 'BTC/USD',
//  interval: '15d' //Valid are  1m, 5m, 30m, 1h, 4h, 1d, 7d, 15d (1 (default), 5, 15, 30, 60, 240, 1440, 10080, 21600 (minutes))
//}





/**

[
    [
        1504541580000, // UTC timestamp in milliseconds, integer
        4235.4,        // (O)pen price, float
        4240.6,        // (H)ighest price, float
        4230.0,        // (L)owest price, float
        4230.7,        // (C)losing price, float
        37.72941911    // (V)olume (in terms of the base currency), float
    ],
    ...
]


**/


candleStickService.handle(event, null, (error, data) => {

  if (error) {
    console.log('Errors: ', error)
    return
  }



  console.log(JSON.stringify(data, null, 2))

})
