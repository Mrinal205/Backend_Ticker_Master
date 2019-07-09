'use strict'

const poloniex = require('./poloniex-websocket')
const sleep = require('../../sleep')


const run = async function(){

  const tradeHistorySymbols = []


  const clients = {
    dispatch: function(message) {

      if (message.type === 'trade') {
//        console.log(JSON.stringify(message, null, 2))

        if ( ! tradeHistorySymbols.includes(message.data.symbol)) {

          tradeHistorySymbols.push(message.data.symbol)
          console.log(JSON.stringify(message, null, 2))
        }

      }
    }
  }

  poloniex.start(clients)

//  await sleep(30000)
//
//  poloniex.stop()
}

run()