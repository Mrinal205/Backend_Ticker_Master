"use strict";


const util = require('util');
const SignalRClient = require('bittrex-signalr-client');
const translator = require('./translator')
const cache = require('../cache-service')
const marketService = require('../../market-service')


//const symbolPairs = ['USDT-BTC', 'USDT-ETH','BTC-ETH', 'BTC-NEO']

let client

/**

  BITTREX web socket connection
  https://github.com/Bittrex/beta
  https://github.com/aloysius-pgast/bittrex-signalr-client

**/

const start = async (clients) => {

  console.log("Starting BITTREX WebSocket Listener")

  const symbolPairs = await fetchSymbolPairs()

  client = new SignalRClient({
      // websocket will be automatically reconnected if server does not respond to ping after 10s
      pingTimeout:10000,
      watchdog:{
          // automatically reconnect if we don't receive markets data for 30min (this is the default)
          markets:{
              timeout: 60000,
              reconnect: true,
          }
      },
      // use cloud scraper to bypass Cloud Fare (default)
      useCloudScraper: true,
      // use legacy endpoint (default) (set to false to use beta endpoint)
      legacy: true,
  })

  client.on('ticker', function(data) {
    ticker(data, clients)
  })

  client.on('orderBook', function(data){
    orderbook(data, clients)

  })
  client.on('orderBookUpdate', function(data){
    orderbook(data, clients)
  })

  client.on('trades', function(data){
    trade(data, clients)
  })

  //-- start subscription
  console.log('=== Subscribing to ' + symbolPairs + ' pairs')
  client.subscribeToTickers(symbolPairs)
  client.subscribeToMarkets(symbolPairs)

}

function fetchSymbolPairs() {

 return marketService.handle('bittrex')
   .then( result => {
     const pairs = Object.keys(result)
     return pairs.map( value => {
       let symbols = value.split('/')
       return symbols[1] + '-' + symbols[0]
     })
   })
}

function trade(data, clients) {
  const trades = translator.trades(data)
  trades.forEach( trade => {

    const message = {
      exchange: 'bittrex',
      type: 'trade',
      data: trade,
    }

    clients.dispatch(message)
  })
}

function orderbook(data, clients) {

  const orderbooks = translator.orderbooks(data)
  orderbooks.forEach( message => {
    clients.dispatch({
      exchange: 'bittrex',
      type: 'orderbook',
      data: message,
    })
  })

}

function ticker(data, clients) {

  const symbol = translator.symbol(data.pair)
  const previous = cache.tickerGet('bittrex', symbol)
  const translatedData = translator.tickerSocket(data.data, previous ? previous : {})

  const message = {
    exchange: 'bittrex',
    type: 'ticker',
    data: translatedData,
  }

  cache.tickerPut(message)

  clients.dispatch(message)
}

const stop = () => {
  client.disconnect()
}

module.exports = {
  start,
  stop
}