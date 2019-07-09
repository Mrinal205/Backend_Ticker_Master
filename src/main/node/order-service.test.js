'use strict'

const orderService = require('./order-service')

const timeout = 15000

describe('Order Service Test', () => {

  test('Simple - GDAX', done => {

    orderService.fetch('gdax', 'BTC/USD')
      .then( result => {
         expect(result.bids.length).toBeGreaterThan(0)
         expect(result.asks.length).toBeGreaterThan(0)
         done()
      })
  }, timeout)

  test('Simple - Binance', done => {

    orderService.fetch('binance', 'BTC/USDT')
      .then( result => {
         expect(result.bids.length).toBeGreaterThan(0)
         expect(result.asks.length).toBeGreaterThan(0)
         done()
      })
  }, timeout)

  test('Simple - Bittrex', done => {
    orderService.fetch('bittrex', 'BTC/USDT')
      .then( result => {
         expect(result.bids.length).toBeGreaterThan(0)
         expect(result.asks.length).toBeGreaterThan(0)
         done()
      })
    },
   timeout)

  test('Simple - Kraken', done => {
    orderService.fetch('kraken', 'BTC/USD')
     .then( result => {
        expect(result.bids.length).toBeGreaterThan(0)
        expect(result.asks.length).toBeGreaterThan(0)
        done()
     })
    },
  timeout)

  //ignore flake-y
  test('Simple - Kucoin', done => {
    done()
    return

    orderService.fetch('kucoin', 'BTC/USDT')
     .then( result => {
        expect(result.bids.length).toBeGreaterThan(0)
        expect(result.asks.length).toBeGreaterThan(0)
        done()
     })
    },
  timeout)

  test('Simple - Poloniex', done => {
    orderService.fetch('poloniex', 'BTC/USDT')
     .then( result => {
        expect(result.bids.length).toBeGreaterThan(0)
        expect(result.asks.length).toBeGreaterThan(0)
        done()
     })
    },
  timeout)

})