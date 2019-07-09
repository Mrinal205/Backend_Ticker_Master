'use strict'
const marketService = require('./market-service')


describe('Market Service', () => {

  test('Test Call', done => {

    const event = {
      exchange: 'poloniex'
    }

    marketService.handle(event, null, (error, data) => {
      expect(error).toBe(null)
      done()
    })

  }, 10000)

  test('EMPTY TEST', () => {


  })

})