'use strict'

const binanceWebsocket = require('./binance-websocket')
const marketService = require('../../market-service')
const tickerService = require('../../ticker-service')
const sleep = require('../../sleep')



const clients = {
  dispatch: function(message) {

//    if (message.data.symbol === 'ETH/BTC' && message.type === 'ticker') {
//        console.log(JSON.stringify(message, null, 2))
//    }

     if (message.type === 'orderbook') {
       console.log(JSON.stringify(message, null, 2))
     }
   }
}

binanceWebsocket.start(clients)