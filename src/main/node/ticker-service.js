'use strict'
const ccxt = require('ccxt')
const cache = require('./exchange/cache-service')
const exchangeLookup = require('./exchange/exchange-lookup')
const lookupService = require('./exchange/service-lookup')

async function ticker(exchangeName, symbolPair){

  const exchangeLookupService = lookupService[exchangeName]
  if (exchangeLookupService === undefined) {
    throw 'Could not find translator for ' + exchangeName
  }

  var ticker = await cache.tickerGet(exchangeName, symbolPair)
  if (ticker) {
    return ticker
  }

  ticker = await exchangeLookup[exchangeName].fetchTicker(symbolPair)
  cache.tickerPut({
    exchange: exchangeName,
    symbol: symbolPair,
    data: ticker
  })

  return exchangeLookupService.translator.ticker(ticker)
}

async function tickerAllManual(exchangeName) {

  const promiseArray = []

  console.log('Loading Market Data', exchangeName)
  await exchangeLookup[exchangeName].load_markets()

  for (let symbolPair in exchangeLookup[exchangeName].markets) {
    //Don't search for dark pools (kraken only?)
    if ( ! symbolPair.includes('.d') ) {
      promiseArray.push( ticker(exchangeName, symbolPair) )
    }
  }

  const result = {}
  return Promise.all(promiseArray)
    .then( (tickers) => {

      tickers.forEach ( (tick) => {
        result[tick.symbol] = tick
      })

      return result
    })

}

//TODO Cache?
const tickerAll = (exchangeName) => {

    const client = exchangeLookup[exchangeName]
    if (lookupService[exchangeName] === undefined) {
      throw 'Did not find translator for [' + exchangeName + ']'
    }

    const translator = lookupService[exchangeName].translator

    //GDAX does not have a fetch all tickers in a single call
    if (! client.has.fetchTickers) {
      return tickerAllManual(exchangeName)
    }
    else {
      return client.fetchTickers()
        .then( result => {
          return translator.tickers(result)
        })
    }
}

module.exports = {
  ticker,
  tickerAll,
}