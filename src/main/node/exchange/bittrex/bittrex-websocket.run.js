'use strict'

const websocket = require('./bittrex-websocket')
const sleep = require('../../sleep')


const clients = {
  dispatch: function(message) {

    if (message.type === 'ticker') {
        console.log(JSON.stringify(message, null, 2))
    }

  }
}

websocket.start(clients)
