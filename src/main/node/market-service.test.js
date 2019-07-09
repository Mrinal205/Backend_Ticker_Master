'use strict'
const marketService = require('./market-service')

const TIMEOUT = 60000 //

describe('Market Service', () => {

  test('Test Call -- Binance', (done) => {

    marketService.handle('binance')
      .then( result => {
        expect(result).not.toBe(undefined)
        for (let key in result) {
             validate(result[key])
             if (key.includes('BCH/')) {
               fail('Should not include ' + key)
             }
        }

        done()
      })
  }, TIMEOUT)

  test('Test Call -- GDAX', (done) => {

    marketService.handle('gdax')
      .then( result => {
        expect(result).not.toBe(null)
        for (var key in result) {
             validate(result[key])
        }

        done()
      })
  }, TIMEOUT)

  test('Test Call -- Kraken', (done) => {

    marketService.handle('kraken')
      .then( result => {
        expect(result).not.toBe(undefined)
        for (let key in result) {
             validate(result[key])
        }
        done()
      })
   }, TIMEOUT)

  test('Test Call -- Bittrex', (done) => {

   marketService.handle('bittrex')
     .then( result => {
       expect(result).not.toBe(undefined)
       for (let key in result) {
           validate(result[key])
       }
       done()
     })
  }, TIMEOUT)

  test('Test Call -- Poloniex', (done) => {

     marketService.handle('poloniex')
       .then( result => {
         expect(result).not.toBe(undefined)
         for (let key in result) {
           validate(result[key])
         }
         done()
       })
    }, TIMEOUT)

  test ('Test call market for specific coin', (done) => {
    marketService.getMarketInfo('binance', 'ADA/BTC')
    .then(result => {
      expect(result).not.toBe(undefined)
      expect(result.limits).not.toBe(undefined)
      done();
    })
  }, TIMEOUT)

  const validate = (data) => {
    expect(data.volume_24h).not.toBe(null)
    expect(data.volume_24h_usd).not.toBe(null)
    expect(data.precision).not.toBe(null)
    expect(data.symbol).not.toBe(null)
    expect(data.price).not.toBe(null)
    expect(data.price_usd).not.toBe(null)
    expect(data.open).not.toBe(null)
    expect(data.ask).not.toBe(null)
    expect(data.bid).not.toBe(null)
    expect(data.maker).not.toBe(null)
    expect(data.taker).not.toBe(null)
  }


////TODO need to mock out API call, so we don't get billed for this test
//  test('test add USD values', (done) => {
//
//      const input = {
//
//          "BCH/BTC": {
//            symbol: "BCH/BTC",
//            price: 0.09287,
//            volume_24h: 640.83385016,
//            change_24h: 0,
//            bid: 0.09286,
//            ask: 0.09287,
//            high: 0,
//            low: 0
//          },
//          "BCH/USD": {
//            symbol: "BCH/USD",
//            price: 637.44,
//            volume_24h: 5750.14665217,
//            change_24h: 0,
//            bid: 636.73,
//            ask: 636.98,
//            high: 0,
//            low: 0
//          },
//          "BTC/EUR": {
//            symbol: "BTC/EUR",
//            price: 5581.39,
//            volume_24h: 1301.30003088,
//            change_24h: 0,
//            bid: 5578.9,
//            ask: 5580.77,
//            high: 0,
//            low: 0
//          },
//          "BTC/USDT": {
//            symbol: "BTC/USDT",
//            price: 6654.39,
//            volume_24h: 11.2,
//            change_24h: 0,
//            bid: 6654.9,
//            ask: 6654.77,
//            high: 0,
//            low: 0
//          },
//          "BTC/USDC": {
//            symbol: "BTC/USDT",
//            price: 5500.11,
//            volume_24h: 15.2,
//            change_24h: 0,
//            bid: 6654.9,
//            ask: 6654.77,
//            high: 0,
//            low: 0
//          },
//
//
//      }
//
//      marketService.addUSDValues(input)
//        .then( result => {
//          expect(result).not.toBe(undefined)
//
//          expect(result['BCH/BTC'].price_usd).toBe(617.9931993)
//          expect(result['BCH/BTC'].volume_24h_usd).toBe(4264358.364166202)
//
//          expect(result['BTC/USDT'].price_usd).toBe(6654.39)
//          expect(result['BTC/USDT'].volume_24h_usd).toBe(11.2)
//
//          expect(result['BTC/USDC'].price_usd).toBe(5500.11)
//          expect(result['BTC/USDC'].volume_24h_usd).toBe(15.20)
//
//          done()
//        })
//  })

})