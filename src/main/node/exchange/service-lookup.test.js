'use strict'
const lookupService = require('./service-lookup')

describe('Test Lookup Service', () => {

  test('Simple Lookup', () => {

    const exchanges = ['binance', 'bittrex', 'gdax', 'kraken', 'kucoin', 'poloniex']

    exchanges.forEach( (exchangeName) => {

      const result = lookupService[exchangeName]
      expect(result).not.toBe(null)
      expect(result).not.toBe(undefined)
      expect(result.translator).not.toBe(undefined)

    })

  })

})