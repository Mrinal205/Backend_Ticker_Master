'use strict'

//const defaultTickerService = require('../ticker-service')
//const defaultMarketService = require('../market-service')

const lookup_map = {

  binance: {
    translator: require('./binance/translator'),
//    market: defaultMarketService
  },

  gdax: {
    translator: require('./gdax/translator'),
//    ticker: require('./gdax/gdax-ticker-service'),
//    market: defaultMarketService
  },

  kraken: {
    translator: require('./kraken/translator'),
//    market: defaultMarketService
  },

  poloniex: {
    translator: require('./poloniex/translator'),
//    market: require('./poloniex/market-service')
  },

  kucoin: {
    translator: require('./kucoin/translator'),
//    market: defaultMarketService
  },

  bittrex: {
    translator: require('./bittrex/translator'),
//    market: defaultMarketService
  }

}


module.exports = lookup_map