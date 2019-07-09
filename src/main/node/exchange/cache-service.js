'use strict'

const NodeCache = require( "node-cache" )
const tickerTTL = 0 // In seconds, 0 forever -- note, websockets should be updating this in fewer than 10 seconds
const tickerCache = new NodeCache({ stdTTL: tickerTTL })

const tickerGetOrPut = async (exchange, symbol, ticker, service) => {

  var cacheValue = tickerCache.get(symbol)
  if (cacheValue) {
    return cacheValue
  }
  else {
    const cacheValue = await service()
    tickerCache.set(symbol, cacheValue)
    return cacheValue
  }
}

const tickerGet = (exchange, symbol) => {
  return tickerCache.get(exchange + '-' + symbol)
}

const tickerPut = (message) => {
  tickerCache.set(message.exchange + '-' + message.data.symbol, message.data)
}

module.exports = {
  tickerPut,
  tickerGet,
  tickerGetOrPut
}


