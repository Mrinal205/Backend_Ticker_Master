'use strict'
const fiatRateClient = require('./fiat-rate-client')


describe('Fiat Rate Client', () => {

  test('Fetch Rates', (done) => {

    fiatRateClient.fetchRates().
      then( result => {
        expect(result).not.toBe(undefined)
        done()
      })

  })

})

