'use strict'
const lookupService = require('../../exchange/service-lookup')
const translator = require('./translator')
const Poloniex = require('poloniex-api-node')
const poloniex = new Poloniex()



//TODO add cache
module.exports.handle = (event, context, callback) => {

  (async () => {

    poloniex.returnTicker(function (error, tickers) {
          if (error) {
            callback(error)
          }
          else {

            callback(null, {
              exchange: event.exchange,
              market: translator.tickerAll(tickers)
            })
          }
        })

   }) ()

}