'use strict'

const cache = require('./cache-service')


describe('Cache Service', () => {

  test('Simple put / get', () => {

    const message = {
      exchange: 'gdax',
      data:
       { symbol: 'ETH/USD',
         open: 865.8,
         price: 853.97,
         volume_24h: 46044.49368493,
         change_24h: -1.366366366366358,
         bid: 853.97,
         ask: 853.98,
         high: 878,
         low: 853.97 },
      symbol: 'ETH/USD' }

    cache.tickerPut(message)

    const result = cache.tickerGet(message.exchange, message.symbol)
    expect(result).toEqual(message.data)

  })


})