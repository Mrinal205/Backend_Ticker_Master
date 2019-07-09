'use strict'
const ccxt = require('ccxt')

const validate = (exchange, symbol) => {

  if ( ! exchange ) {
    throw 'No exchange specified'
  }

  if ( ! symbol ) {
    throw 'No Symbol specified'
  }

}


//TODO add cache
module.exports.fetch = (exchange, symbol) => {

  validate(exchange, symbol)

  const exchangeCcxt = new ccxt[exchange]({ enableRateLimit: true })

  return exchangeCcxt.fetchOrderBook(symbol)

}