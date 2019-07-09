'use strict'

const translator = require('./translator')


describe('BitTrex Translator Test', () => {

  test('tickerSocket', () => {

    const previous = {
      symbol: 'ETH/USDT',
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

    const message =  {
      pair: 'USDT-ETH',
      last: 518.4534,
      priceChangePercent: 0.08565407722174179,
      sell: 518.54368811,
      buy: 517.44,
      high: 537.62599116,
      low: 507.15500002,
      volume: 9237.02985633,
      timestamp: 1523844913.743
    }

    const result = translator.tickerSocket(message, previous)
    expect(result).not.toBe(null)

    //TODO add more validation
    //validate data
    expect(result.bid_trend).toBe('down')
    expect(result.ask_trend).toBe('down')
    expect(result.price).toBe(518.54368811)

  })

  test('symbol', () => {

    expect( translator.symbol('USDT-ETH') ).toBe( 'ETH/USDT' )

  })

})