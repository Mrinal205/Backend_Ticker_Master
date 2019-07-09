'use strict'
const tickerService = require('./ticker-service')


//Theses tests are individual because they each take a while, timeouts would be difficult if grouped

describe('Ticker Service', () => {

//  test('Test Call - Ticker -  binance', done => {
//
//    const symbolPair = 'BTC/USDT'
//
//    tickerService.ticker('bittrex', symbolPair)
//      .then( data => {
//        expect(data).not.toBe(null)
//        expect(data.symbol).toBe(symbolPair)
//        done()
//    })
//
//  })
//
//  test('Test Call - TickerAll -  binance', done => {
//
//    const symbolPair = 'BTC/USDT'
//
//    tickerService.tickerAll('binance')
//      .then( data => {
//        expect(data).not.toBe(null)
//        done()
//    })
//
//  }, 50000)
//
//
//  test('Test Call - Ticker -  bittrex', done => {
//
//    const symbolPair = 'BTC/USDT'
//
//    tickerService.ticker('bittrex', symbolPair)
//      .then( data => {
//        expect(data).not.toBe(null)
//        expect(data.symbol).toBe(symbolPair)
//        done()
//    })
//
//  }, 50000)
//
//  test('Test Call - TickerAll -  bittrex', done => {
//
//    const symbolPair = 'BTC/USDT'
//
//    tickerService.tickerAll('bittrex')
//      .then( data => {
//        expect(data).not.toBe(null)
//        done()
//    })
//
//  }, 50000)

  test('Test Call - TickerAll -  GDAX', done => {

    const symbolPair = 'BTC/USD'

    tickerService.tickerAll('gdax')
      .then( data => {
        expect(data).not.toBe(null)

        for (let key in data) {
          validate(data[key])
        }

        done()
    })

  }, 50000)

//  test('Test Call - Ticker -  GDAX', done => {
//
//    const symbolPair = 'BTC/USD'
//
//    tickerService.ticker('gdax', symbolPair)
//      .then( data => {
//        expect(data).not.toBe(null)
//        expect(data.symbol).toBe(symbolPair)
//        done()
//    })
//
//  }, 50000)
//
//  test('Test Call - TickerAll -  Kraken', done => {
//
//    const symbolPair = 'BTC/USD'
//
//    tickerService.tickerAll('kraken')
//      .then( data => {
//        expect(data).not.toBe(null)
//        done()
//    })
//
//  }, 50000)
//
//  test('Test Call - Ticker -  Kraken', done => {
//
//    const symbolPair = 'BTC/USD'
//
//    tickerService.ticker('kraken', symbolPair)
//      .then( data => {
//        expect(data).not.toBe(null)
//        expect(data.symbol).toBe(symbolPair)
//        done()
//    })
//
//  }, 50000)
//
//
//  test('Test Call - Ticker -  poloniex', done => {
//
//    const symbolPair = 'BTC/USDT'
//
//    tickerService.ticker('poloniex', symbolPair)
//      .then( data => {
//        expect(data).not.toBe(null)
//        expect(data.symbol).toBe(symbolPair)
//        done()
//       })
//
//  }, 50000)
//
//  test('Test Call - TickerAll -  poloniex', done => {
//
//    const symbolPair = 'BTC/USDT'
//
//    tickerService.tickerAll('poloniex')
//      .then( data => {
//        expect(data).not.toBe(null)
//        done()
//      })
//      .catch(done)
//
//  }, 50000)


  function validate(data) {

    expect(data.symbol).not.toBe(undefined)
    expect(data.price).not.toBe(null)
    expect(data.volume_24h).not.toBe(null)
    expect(data.bid).not.toBe(null)
    expect(data.ask).not.toBe(null)
    expect(data.high).not.toBe(null)
  }

})