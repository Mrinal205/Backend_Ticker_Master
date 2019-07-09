'use strict'
const cache = require('../cache-service')

/**
*
*  GDAX web socket connection
*  https://docs.gdax.com/#protocol-overview
*
**/

const WebSocketClient = require('../../websocket/WebSocketClient')
const webSocketClient = new WebSocketClient()
const HOST_URI = 'wss://ws-feed.pro.coinbase.com'
const translator = require('./translator')



const start = (clients) => {

    console.log('Starting GDAX WebSocket Listener')

    const subscribeMessage = {
       type: 'subscribe',
       product_ids: [
         'BCH-BTC',
         'ETC-BTC',
         'ETH-BTC',
         'LTC-BTC',
         'ZRX-BTC',
         'XRP-BTC',
         'XLM-BTC',

         'BCH-USD',
         'BTC-USD',
         'ETC-USD',
         'ETH-USD',
         'LTC-USD',
         'ZRX-USD',
         'XRP-USD',
         'XLM-USD',

         'BCH-EUR',//
         'BTC-EUR',//
         'ETC-EUR',//
         'ETH-EUR',//
         'LTC-EUR',//
         'ZRX-EUR',//
         'XRP-EUR',//
         'XLM-EUR',

         'BCH-GBP',
         'BTC-GBP',
         'ETC-GBP',
         'ETH-GBP',
         'LTC-GBP',

         'BTC-USDC',//
         'ETH-USDC',//
         'BAT-USDC',//
         'CVC-USDC',//
         'DAI-USDC',//
         'DNT-USDC',//
         'GNT-USDC',//
         'LOOM-USDC',//
         'MANA-USDC',//
         //'MKR-USDC',
         'ZEC-USDC',//
         //'ZIL-USDC',
       ],
       channels: [
         'ticker',
//         'full',
//         'heartbeat',
         'level2',
         'matches',
       ]

    }

     webSocketClient.open(HOST_URI)

    webSocketClient.onopen = () => {
      //console.log('OPening websocket')
      webSocketClient.send( JSON.stringify(subscribeMessage) )
    }

    webSocketClient.onmessage = (data, flags, number) => {
      //console.log('websocket onmessage', data)
      const inputData = JSON.parse(data)

      switch (inputData.type) {

        case 'l2update':
          orderbook(inputData, clients)
          break

        case 'ticker':
          ticker(inputData, clients)
          break

        case 'match':
          trade(inputData, clients)
          break

      }
    }

    webSocketClient.onerror = (message) => {
      console.log('GDAX WebSocket Error', message)
    }
}

function ticker(input, clients) {
  const symbol = translator.symbol(input.product_id)
  const previous = cache.tickerGet('gdax', symbol)

  const translatedMessage = translator.tickerSocket(input, previous ? previous : {})
  const message = {
    exchange: 'gdax',
    type: 'ticker',
    data: translatedMessage,
  }


  //  DEBUG console.log('PUT TICKER CACHE _-- GDAX -- ', message)
  cache.tickerPut(message)

  clients.dispatch(message)
}

function orderbook(input, clients) {

  const message = {
    exchange: 'gdax',
    type: 'orderbook',
    data: translator.orderbook(input),
  }

  clients.dispatch(message)
}


function trade(input, clients) {

    const message = {
      exchange: 'gdax',
      type: 'trade',
      data: translator.trade(input),
    }

    clients.dispatch(message)

}


const stop = () => {
  return new Promise( (resolve) => {
     console.log('Terminating GDAX WebSocket Listener')
     webSocketClient.terminate()
     resolve()
  })
}

module.exports = {
  start,
  stop
}
