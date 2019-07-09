'use strict'
const errorHandler = require('../../websocket/error-handler')
const translator = require('./translator')
const cache = require('../cache-service')
const Poloniex = require ('poloniex-api-node')

/**
*
*  POLONIEX web socket connection
*  https://poloniex.com/support/api/

   https://poloniex.com/js/plx_exchage.js?v=060617

   https://github.com/dutu/poloniex-api-node (JS library)
*
**/

const poloniex = new Poloniex()
const subscribedPairs = []

const start = (clients) => {

  console.log("Starting POLONIEX WebSocket Listener")

  poloniex.subscribe('ticker')

  poloniex.on('message', (channelName, data, seq) => {

    switch (channelName) {

      case 'ticker':
        const tickerPair = ticker(data, clients)
        subscribeIfNew(tickerPair)
        break

      //All the rest are channels of the symbol pairs... ie BTC_XRP which an array of messages
      default:
        multiMessage(channelName, data, clients)
    }

  })

  poloniex.on('open', () => {
    console.log('Poloniex WebSocket connection open')
  })

  poloniex.on('close', (reason, details) => {
    console.log('Poloniex WebSocket connection disconnected')
  })

  poloniex.on('error', (error) => {
    console.log('An error has occurred')
  })

  poloniex.openWebSocket({ version: 2 })
}

function subscribeIfNew(symbolPair) {

  if (! subscribedPairs.includes(symbolPair)) {
    subscribedPairs.push(symbolPair)
    poloniex.subscribe(symbolPair)
//    console.log('Subscribed to new Poloniex symbol pair', symbolPair)
  }

}

function ticker(input, clients) {

 const previous = cache.tickerGet('poloniex', translator.symbol(input.currencyPair))

  const message = {
    exchange: 'poloniex',
    type: 'ticker',
    data: translator.tickerSocket(input, previous)
  }

  cache.tickerPut(message)

  clients.dispatch(message)

  return input.currencyPair
}

function multiMessage(symbolPair, messages, clients) {

  const translatedSymbol = translator.symbol(symbolPair)

  messages.forEach(socketMessage => {
    socketMessage.data['symbolPair'] = symbolPair

    switch (socketMessage.type) {

      case 'newTrade':
        clients.dispatch({
          exchange: 'poloniex',
          type: 'trade',
          data: translator.trade(socketMessage.data)
        })
        break

      case 'orderBook':
        //ignore these messages, the Client calls the REST api to get this data.
        break

      case 'orderBookModify':
        clients.dispatch({
          exchange: 'poloniex',
          type: 'orderbook',
          data: translator.orderbook(socketMessage.data)
        })
        break

      case 'orderBookRemove':
        socketMessage.data.amount = "0"
        clients.dispatch({
          exchange: 'poloniex',
          type: 'orderbook',
          data: translator.orderbook(socketMessage.data)
        })
        break

      default:
        console.log("FOUND !!!", socketMessage.type)

    }

  })

}


const stop = () => {
  console.log('Terminating POLONIEX WebSocket Listener')
  poloniex.closeWebSocket()
}


module.exports = {
  start,
  stop
}



