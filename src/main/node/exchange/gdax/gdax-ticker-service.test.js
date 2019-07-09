'use strict'
const tickerService = require('./gdax-ticker-service')

const ccxt = require('ccxt')


describe('Ticker Service', () => {

//  test('Test Call - ticker', done => {
//
//    const event = {
//      query: {
//        exchange: 'gdax',
//        symbol: 'BTC/USD'
//      }
//    }
//
//    tickerService.ticker(event, null, (error, data) => {
//      expect(data.exchange).toBe(event.query.exchange)
//      console.log(data)
//      done()
//    })
//
//  })


//   test('Test Call - tickers - gdax', done => {
//
//      const event = {
//        exchange: 'gdax',
//      }
//
//      tickerService.all(event, null, (error, data) => {
//        expect(data.exchange).toBe(event.exchange)
//
//        console.log(data)
//        done()
//      })
//
//    }, 20000)

   test('Test Call - details', done => {

      const exchange = new ccxt['gdax']({ enableRateLimit: true })

//      tickerService.stats(exchange, 'BTC-USD', () => {
//        done()
//      })

        console.log(exchange.headers)
        done()


     })

})