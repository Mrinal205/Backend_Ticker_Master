'use strict'

const tradeService = require('./trade-service')

const timeout = 15000

describe('Trade Service Test', () => {
  // TODO: Disabled because or rate limit
  xtest('Simple - GDAX', done => {

    tradeService.fetch('gdax', 'BTC/USD')
      .then( result => {
         expect(result.length).toBeGreaterThan(0)
         done()
      })
  }, timeout)

  // TODO: Disabled because or rate limit
  xtest('Simple - GDAX', done => {

      tradeService.fetch('gdax', 'BTC/USDC')
        .then( result => {
           expect(result.length).toBeGreaterThan(0)
           done()
        })
    }, timeout)

  test('Simple - Binance', done => {

    tradeService.fetch('binance', 'BTC/USDT')
      .then( result => {
         expect(result.length).toBeGreaterThan(0)
         done()
      })
  }, timeout)

  test('Simple - Bittrex', done => {

    tradeService.fetch('bittrex', 'BTC/USDT')
      .then( result => {
         expect(result.length).toBeGreaterThan(0)
         done()
      })
    },
   timeout)

  test('Simple - Kraken', done => {

    tradeService.fetch('kraken', 'BTC/USD')
     .then( result => {
         expect(result.length).toBeGreaterThan(0)
        done()
     })
    },
  timeout)

  // TODO: Disabled because of api incompatibility
  xtest('Simple - Kucoin', done => {

    tradeService.fetch('kucoin', 'BTC/USDT')
     .then( result => {
         expect(result.length).toBeGreaterThan(0)
        done()
     })
    },
  timeout)

  test('Simple - Poloniex', done => {

    tradeService.fetch('poloniex', 'BTC/USDT')
     .then( result => {
         expect(result.length).toBeGreaterThan(0)
        done()
     })
    },
  timeout)




})
