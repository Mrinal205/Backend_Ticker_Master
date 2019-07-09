'use strict'

const websocket = require('./gdax-websocket')
const sleep = require('../../sleep')



describe('GDAX WebSocket Test', () => {

  test('Simple', async (done) => {

    let countOrderBook = 0
    let countTicker = 0
    let countTrade = 0


    const clients = {
      dispatch: function(message) {

        expect(message.data.symbol).not.toBe(undefined)
        expect(message.exchange).toBe('gdax')
          console.log('here message ', message)
        if (message.type === 'ticker') {
          countTicker++
        }

        if (message.type === 'orderbook') {
          countOrderBook++
        }

        if (message.type === 'trade') {
          countTrade++
        }

      }
    }

    websocket.start(clients)

    await sleep(9000)
      .then( () => {
        websocket.stop()

        expect(countTicker).not.toBe(0)
        expect(countOrderBook).not.toBe(0)
        expect(countTrade).not.toBe(0)
        done()
      })


  }, 10000)

})




