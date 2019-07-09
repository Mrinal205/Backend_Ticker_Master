'use strict'
const ccxt = require('ccxt')
const NodeCache = require( "node-cache" );
const fetch = require('node-fetch')

const serviceLookup = require('../service-lookup')
const defaultTickerService = require('../../ticker-service')

const tickerAllCache = new NodeCache({ stdTTL: 3 });
const CACHE_KEY = "KEY"

const ticker = defaultTickerService.ticker

const loadMarket = async (exchange) => {
    await exchange.load_markets()
}

const stats = (exchange, symbol, callback) => {

  fetch(exchange.urls.api + '/' + symbol + '/stats')
    .then(res => res.json())
    .then(json => {
      console.log(json)
      callback()
    })

}

const loadAllTickerData = (exchangeName, exchange, callback) => {

  const translator = serviceLookup[exchangeName].translator
  if (!translator) {
    throw 'Could not find translator for ' + exchangeName
  }

  const promises = []

  for (var key in exchange.markets) {

    promises.push(exchange.fetchTicker(key)
      .then( (tickerValue) => {
        console.log(tickerValue)
        const tickerResult = translator.ticker(tickerValue)
        console.log(tickerResult)

          return tickerResult
      }))
  }

  Promise.all(promises)
    .then( (result) => {
        callback(null, {
              exchange: exchangeName,
              tickers: result.reduce( (map, object) => {
                map[object.symbol] = object;
                    return map;
              }, {})
            })
    })
}


//TODO add cache
const all = async (event, context, callback) => {

  const cachedResult = tickerAllCache.get(CACHE_KEY)
  if (cachedResult) {
    callback(null, {
      exchange: event.exchange,
      tickers: cachedResult
    })
  }
  else {
    console.log('Cache Miss')
    const exchange = new ccxt[event.exchange]({ enableRateLimit: true })
    await loadMarket(exchange)
    loadAllTickerData(event.exchange, exchange, callback)
  }

}

module.exports = {
  all,
  ticker,
  stats
}