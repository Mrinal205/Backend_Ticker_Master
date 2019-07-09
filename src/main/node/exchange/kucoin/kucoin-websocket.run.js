'use strict'

const tickerService = require('../../ticker-service')
const kucoinWebSocket = require('./kucoin-websocket')
const sleep = require('../../sleep')



//tickerService.tickerAll('kucoin')
//      .then( data => {
//        console.log('data', data)
//      })


const run = async function(){

    const clients = {
      dispatch: function(message) {
        console.log(JSON.stringify(message, null, 2))
      }
    }

    kucoinWebSocket.start(clients)

    await sleep(30000)

    kucoinWebSocket.stop()

}

run()



