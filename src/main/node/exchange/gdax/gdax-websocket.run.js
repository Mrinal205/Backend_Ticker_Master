'use strict'

const gdaxWebsocket = require('./gdax-websocket')
const sleep = require('../../sleep')



const clients = {
  dispatch: function(message) {

    if (message.data.symbol.includes('USDC'))

      console.log(JSON.stringify(message, null, 2))
  }
}

gdaxWebsocket.start(clients)

