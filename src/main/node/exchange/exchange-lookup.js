'use strict'

const ccxt = require('ccxt')

const binance = new ccxt['binance']({ enableRateLimit: true })
const bittrex = new ccxt['bittrex']({ enableRateLimit: true })
const gdax = new ccxt['gdax']({ enableRateLimit: true })
const kraken = new ccxt['kraken']({ enableRateLimit: true })
const kucoin = new ccxt['kucoin']({ enableRateLimit: true })
const poloniex = new ccxt['poloniex']({ enableRateLimit: true })
  
  
const exchange_clients = {

  binance,
  bittrex,
  gdax,
  kraken,
  kucoin,
  poloniex,

}

module.exports = exchange_clients