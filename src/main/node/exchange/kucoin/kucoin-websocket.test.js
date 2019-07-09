'use strict'

const kucoinWebSocket = require('./kucoin-websocket')
const sleep = require('../../sleep')



describe('KUCOIN WebSocket Test', () => {
  // TODO: Disabled because or api change
  xtest('Simple', async (done) => {

    let count = 0

    const clients = {
      dispatch: function(message) {
        //TOOD add more assertions
        expect(message.data.symbol).not.toBe(undefined)
        expect(message.exchange).toBe('kucoin')

        count = count + 1
      }
    }

    kucoinWebSocket.start(clients)

    await sleep(15000)
      .then( () => {
        kucoinWebSocket.stop()

        expect(count).not.toBe(0)
        done()
      })


  }, 16000)



})




