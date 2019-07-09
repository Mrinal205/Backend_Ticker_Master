'use strict'

const translator = require('./translator')


describe('Binance Translator Test', () => {

  test('tickerSocket', () => {

    const previous = {
      symbol: 'BTC/USDT',
      open: 999,
      price: 1234.45,
      volume_24h: 5801.6220681,
      change_24h: 23.568568568568573,
      bid: 1234,
      bid_trend: 'up',
      ask: 1255,
      ask_trend: 'up',
      high: 19000,
      low: 800
    }

    const message = {
      "e": "24hrTicker",  // Event type
      "E": 123456789,     // Event time
      "s": "BTCUSD",      // Symbol
      "p": "0.0015",      // Price change
      "P": "250.00",      // Price change percent
      "w": "0.0018",      // Weighted average price
      "x": "0.0009",      // Previous day's close price
      "c": "0.0025",      // Current day's close price
      "Q": "10",          // Close trade's quantity
      "b": "1233",      // Best bid price
      "B": "10",          // Bid bid quantity
      "a": "1256",      // Best ask price
      "A": "100",         // Best ask quantity
      "o": "0.0010",      // Open price
      "h": "0.0025",      // High price
      "l": "0.0010",      // Low price
      "v": "10000",       // Total traded base asset volume
      "q": "18",          // Total traded quote asset volume
      "O": 0,             // Statistics open time
      "C": 86400000,      // Statistics close time
      "F": 0,             // First trade ID
      "L": 18150,         // Last trade Id
      "n": 18151          // Total number of trades
   }

    const result = translator.tickerSocket(message, previous)
    expect(result).not.toBe(null)

    //TODO add more validation
    //validate data
    expect(result.bid_trend).toBe('down')
    expect(result.ask_trend).toBe('up')

  })

  test('symbol', () => {

    expect( translator.symbol('BNBBTC') ).toBe( 'BNB/BTC' )
    expect( translator.symbol('BNB/BTC') ).toBe( 'BNB/BTC' )
    expect( translator.symbol('BTCUSDT') ).toBe( 'BTC/USDT' )
    expect( translator.symbol('YOYOWBTC') ).toBe( 'YOYOW/BTC' )
    expect( translator.symbol('STRATBTC') ).toBe( 'STRAT/BTC' )
    expect( translator.symbol('BCCBTC') ).toBe( 'BCH/BTC' )

  })

})