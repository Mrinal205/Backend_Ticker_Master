'use strict'

const krakenWebSocket = require('./kraken-websocket')


const clients = {
  dispatch: function(message) {
    console.log(JSON.stringify(message, null, 2))
  }
}

krakenWebSocket.start(clients)