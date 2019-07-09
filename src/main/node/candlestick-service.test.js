'use strict'

const candlestickService = require('./candlestick-service')

describe('Candle Stick Service Test', () => {

  test('Test GDAX', (done) => {

    const event = {
      exchange: 'gdax',
      symbol: 'BTC/USD',
      interval: '1M',
      since: 1517443200000,
    }

    candlestickService.handle(event, {}, (error, result) => {

      expect(error).toBe(null)
      expect(result).not.toBe(undefined)
      expect(result.exchange).toBe(event.exchange)
      expect(result.candleSticks.length).not.toBe(0)
      done()

    })

  })

  test('Test GDAX - with cache', (done) => {

      const event = {
        exchange: 'gdax',
        symbol: 'BTC/USD',
        interval: '1M',
        since: 1517443200000,
      }

      //Calls the service 10 times. Should all be cached.
      const promiseArray = []

      Array.from(Array(10)).forEach(i => {

        promiseArray.push(

          candlestickService.handle(event, {}, (error, result) => {

            expect(error).toBe(null)
            expect(result).not.toBe(undefined)
            expect(result.exchange).toBe(event.exchange)
            expect(result.candleSticks.length).not.toBe(0)
            return new Promise((resolve, reject) => {
              if (error !== null) reject(error)
              else resolve(result)
            })

          })
        )

      })

      Promise.all(promiseArray)
        .then(() => {
          done()
        })
        .catch(done.fail)

    })

})
