'use strict'

const tickerService = require('../../ticker-service')
const cache = require('../cache-service')
const translator = require('./translator')

/**
*
*  KUCOIN web socket connection
*

**/

const start = (clients) => {

  console.log("Starting KUCOIN WebSocket(fake) Listener")


  setInterval(function fetchTicker() {


    tickerService.tickerAll('kucoin')
      .then( data => {

        for (var key in data) {

          const previous = cache.tickerGet('kucoin', data[key].symbol)

          const message = {
            exchange: 'kucoin',
            type: 'ticker',
            data: translator.tickerSocket(data[key], previous)
          }

          if (JSON.stringify(previous) !== JSON.stringify(message.data)) {
            cache.tickerPut(message)
            clients.dispatch(message)
          }

      }


    })
    .catch(error => {
      console.log('Error Fetching KuCoin', error)
    })

  }, 3000)


}

const stop = () => {

}

module.exports = {
  start,
  stop
}
