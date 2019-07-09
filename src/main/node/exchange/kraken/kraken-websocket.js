'use strict'

const tickerService = require('../../ticker-service')
const cache = require('../cache-service')
const translator = require('./translator')
const ccxt = require('ccxt')


const NodeCache = require( "node-cache" );
const orderBookCache = new NodeCache({ stdTTL: 0 });


const MAX_ORDERBOOK = 12

const EXCHANGE_NAME = 'kraken'


/**
*
*  BINANCE web socket connection
*  https://docs.gdax.com/#protocol-overview
*
**/



const start = (clients) => {

  console.log("Starting KRAKEN WebSocket(fake) Listener")

  addTickerCall(clients)

  addOrderBookCall(clients)

}

const addOrderBookCall = async (clients) => {

  const exchangeCcxt = new ccxt[EXCHANGE_NAME]({ enableRateLimit: false })

  await exchangeCcxt.load_markets()

  for (var symbol in exchangeCcxt.markets) {

    ((symbol) => {
      if ( ! symbol.includes('.d') ) {
        setInterval(() => {

          exchangeCcxt.fetchOrderBook(symbol)
            .then( result => {

                const asks = result.asks.slice(0, MAX_ORDERBOOK)
                const bids = result.bids.slice(0, MAX_ORDERBOOK)

                const messages = translator.orderbooks({
                  symbol,
                  asks: mergeToZero(orderBookCache.get('ASKS-' + symbol), asks),
                  bids: mergeToZero(orderBookCache.get('BIDS-' + symbol), bids),
                })

                messages.forEach (data => {
                  const message = {
                    exchange: EXCHANGE_NAME,
                    type: 'orderbook',
                    data,
                  }

                  clients.dispatch(message)
                })

                orderBookCache.set('ASKS-' + symbol, asks)
                orderBookCache.set('BIDS-' + symbol, bids)

            })
            .catch(error => {
              console.log('ERROR', error)
            })

        }, 3000)
      }
    }) (symbol)

  }

}


//Takes the data sent previously, sets that to zero. If there is a value in the new array it uses that.
//Used to make sure we send zero amounts to the browser, even if Kraken doesn't send them to us.
const mergeToZero = (array1, array2) => {

  if (array1 === undefined) {
    return array2
  }

  const zeroedArray = []

  for (var i = 0; i < array1.length; i++) {
    var matchFound = false
    for (var j = 0; j < array2.length; j++) {
      if (array1[i][0] === array2[j][0]) {
        matchFound = true
      }
    }
    if (! matchFound) {
      zeroedArray.push([array1[i][0], 0]) //Set previous sent value to 0
    }
  }

  return zeroedArray.concat(array2)
}


const addTickerCall = (clients) => {

  setInterval(function fetchTicker() {

    tickerService.tickerAll(EXCHANGE_NAME)
      .then( data => {

        for (let key in data) {

          const previous = cache.tickerGet(EXCHANGE_NAME, data[key].symbol)

          const message = {
            exchange: EXCHANGE_NAME,
            type: 'ticker',
            data: translator.tickerSocket(data[key], previous)
          }

          if (JSON.stringify(previous) !== JSON.stringify(message.data)) {
            cache.tickerPut(message)
            clients.dispatch(message)
          }

        }

      })

    }, 3000)

}

const stop = () => {

}

module.exports = {
  start,
  stop
}




