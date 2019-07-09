'use strict'

const ccxt = require('ccxt')
const exchangeLookup = require('./exchange/exchange-lookup')
const NodeCache = require( "node-cache" )
const TTL = 10 // In seconds, 0 forever -- note, websockets should be updating this in fewer than 10 seconds

const candleStickCache = new NodeCache({ stdTTL: TTL })

const BITTREX_INTERVALS = ['1m', '5m', '30m', '1h', '1d']

const validate = (event) => {

  const errors = []

  switch (event.exchange) {
    case 'bittrex':
      if ( ! BITTREX_INTERVALS.includes(event.interval) ) {
        errors.push('Invalid interval, valid values are ', BITTREX_INTERVALS)
      }
      break;


    default:

  }

  return errors
}

//It seems CCXT library feature since is not working correctly -- GDAX
//TODO check performance of this filter for larger datasets
function filter(candleSticks, since) {

  if (! since) {
    return candleSticks
  }

  return candleSticks.filter((candle) => {
    return (candle[0] >= since)
  })

}

function addDate(candleSticks) {
  candleSticks.forEach ( (candle) => {

    const date = new Date(candle[0])
    candle.push(date)

  })
}

function getHashForEvent(event) {

  return event.exchange + '_' + event.symbol + '_' + event.interval + '_' + event.since
}


module.exports.handle = (event, context, callback) => {

  const errors = validate(event)

  if (errors.length > 0) {
    callback({stack: errors})
    return
  }

  const hash = getHashForEvent(event)
  const cachedValue = candleStickCache.get(hash)
  if (cachedValue) {
    callback(null, cachedValue)
    return
  }

  (async () => {

       const exchangeName = event.exchange
       const symbol = event.symbol
       const interval = event.interval
       const since = event.since

       exchangeLookup[exchangeName].fetchOHLCV(symbol, interval)
          .then( candleSticks => {

              candleSticks = filter(candleSticks, since)
              addDate(candleSticks)

              const result = {
                exchange: exchangeName,
                candleSticks: candleSticks
              }

              candleStickCache.set(hash, result)

              callback(null, result)
          })
          .catch(callback)

     }) ()

}