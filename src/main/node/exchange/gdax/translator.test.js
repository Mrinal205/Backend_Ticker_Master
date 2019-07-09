'use strict'

const translator = require('./translator')


describe('GDAX Translator Test', () => {

  test('tickerSocket', () => {

    const previous = {
      symbol: 'BTC/USD',
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
      type: 'ticker',
      sequence: 943598371,
      product_id: 'BTC-USD',
      price: '1234.45',
      open_24h: '999',
      volume_24h: '5801.62206810',
      low_24h: '800',
      high_24h: '19000',
      volume_30d: '415075.68730401',
      best_bid: '1233',
      best_ask: '1255'
    }

    const result = translator.tickerSocket(message, previous)
    expect(result).not.toBe(null)

    //validate data
    expect(result.bid_trend).toBe('down')
    expect(result.ask_trend).toBe('up')


    console.log(result)

  })

})