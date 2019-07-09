'use strict'
const errorHandler = require('../../websocket/error-handler')
const translator = require('./translator')
const cache = require('../cache-service')
const binanceSymbols = require('./binance-symbols')
const exchangeLookup = require('../exchange-lookup')

/**
*
*  BINANCE web socket connection
*  https://docs.gdax.com/#protocol-overview
*
**/

const HOST_URI = 'wss://stream.binance.com:9443/'
const ALL_TICKERS_ARRAYS = 'ws/!ticker@arr'
const TEST_TICKERS = 'ethusdt@ticker/btcusdt@ticker'

const WebSocketClient = require('../../websocket/WebSocketClient')

const buildUrl = () => {

  return HOST_URI + 'stream?streams=' +
    registeredSymbols.join('@ticker/') + '@ticker/' +
    registeredSymbols.join('@depth/') + '@depth/'

}

//Need three WebSockets as the URL will only support so many types
const tickerSocket = new WebSocketClient()
const tradeSocket = new WebSocketClient()
const orderSocket = new WebSocketClient()


const start = async (clients) => {

  console.log("Starting BINANCE WebSocket Listener")
  const symbols = await binanceSymbols.fetch()

  //Ticker Socket init

  tickerSocket.open(HOST_URI + 'stream?streams=!ticker@arr')
  tickerSocket.onmessage = (data, flags, messageNumber) => {

    const inputData = JSON.parse(data)

    inputData.data.forEach( ticker => {

      const symbol = translator.symbol(ticker.s)
      const previous = cache.tickerGet('binance', symbol)

      const translatedData = translator.tickerSocket(ticker, previous ? previous : {})

      const message = {
        exchange: 'binance',
        type: 'ticker',
        data: translatedData,
      }

      cache.tickerPut(message)
      clients.dispatch(message)
    })
  }

  //Trade socket init

  tradeSocket.open(HOST_URI + 'stream?streams=' + symbols.join('@trade/'))
  tradeSocket.onmessage = (data, flags, messageNumber) => {
      const inputData = JSON.parse(data)
      const message = {
        exchange: 'binance',
        type: 'trade',
        data: translator.trade(inputData)
      }
      clients.dispatch(message)
  }

  //Order socket init


  orderSocket.open(HOST_URI + 'stream?streams=' + symbols.join('@depth/'))
  orderSocket.onmessage = (data, flags, messageNumber) => {
      const inputData = JSON.parse(data)

      const orderbooks = translator.orderbooks(inputData)
      orderbooks.forEach( orderbook => {
        const message = {
          exchange: 'binance',
          type: 'orderbook',
          data: orderbook,
        }

        clients.dispatch(message)
      })
  }

}

const stop = () => {
  return new Promise( (resolve) => {
     console.log('Terminating Binance WebSocket Listener')
     tickerSocket.terminate()
     orderSocket.terminate()
     tradeSocket.terminate()
     console.log('Terminated')
     resolve()
  })
}

module.exports = {
  start,
  stop
}