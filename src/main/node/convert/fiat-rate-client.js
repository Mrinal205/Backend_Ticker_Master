'use strict'
const https = require('https')
const NodeCache = require( "node-cache" )


/**

Service to look up fiat exchange rates

https://openexchangerates.org

https://openexchangerates.org/api/latest.json?app_id=2d0698400f234de2895041810a8b1702

**/

const secondsInDay = 86400
const exchangeRateCache = new NodeCache({ stdTTL: secondsInDay })


function fetchRates() {

  if ( exchangeRateCache.get('CACHE_KEY') ) {
    return Promise.resolve(exchangeRateCache.get('CACHE_KEY'))
  }

  else {

    console.log('Calling FIAT API')

    return callOpenExchangeApi()
      .then( rates => {
          addUSD(rates)
          exchangeRateCache.set('CACHE_KEY', rates)
          return rates
      })
  }

}

function addUSD(input) {

  for (let key in input) {
    input[key + '/USD'] = input[key]
    delete input[key]
  }

}

function callOpenExchangeApi() {

  return new Promise( (resolve, reject) => {
      var options = {
        host: 'openexchangerates.org',
        port: 443,
        path: '/api/latest.json?app_id=2d0698400f234de2895041810a8b1702',
      }

      https.get(options, (response) => {

        if (response.statusCode !== 200) {
          reject('Unexpected response code from exchange service, statusCode:' + response.statusCode)
        }

        var body = ''
        response.setEncoding('utf8')
        response.on('data', (data) => {
          body += data
        })

        response.on('end', () => {
          resolve(JSON.parse(body).rates)
        })
      })
    })

}

function convert(currency, amount) {

  return fetchRates()
    .then( rates => {
      console.log( 'Currency', currency, 'Rate' , rates[currency], 'amount', amount)

      return ( (1 / rates[currency]) * amount)
    })

}

module.exports = {
  convert,
  fetchRates,
}
