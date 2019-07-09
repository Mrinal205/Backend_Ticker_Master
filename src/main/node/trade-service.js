'use strict'
const ccxt = require('ccxt')
const exchangeLookup = require('./exchange/exchange-lookup')

const validate = (exchange, symbol) => {

  if ( ! exchange ) {
    throw 'No exchange specified'
  }

  if ( ! symbol ) {
    throw 'No Symbol specified'
  }

}

async function fetch(exchangeName, symbol) {

  validate(exchangeName, symbol)

  const result = await exchangeLookup[exchangeName].fetchTrades(symbol)

  return result.sort(function(a,b){
   // Turn your strings into dates, and then subtract them
   // to get a value that is either negative, positive, or zero.
   return new Date(b.timestamp) - new Date(a.timestamp)
 })

}

module.exports = {
  fetch,
}