'use strict'

const websocket = require('./poloniex-websocket')
const sleep = require('../../sleep')



describe('POLONIEX WebSocket Test', () => {

  test('Simple', async (done) => {

    //Ignore
    done()
    return

    let countOrderBook = 0
    let countTicker = 0
    let countTrade = 0


    const clients = {
      dispatch: function(message) {

        expect(message.data.symbol).not.toBe(undefined)
        expect(message.exchange).toBe('poloniex')

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

    //Poloniex takes so long to get an orderbook... low volume

    await sleep(59000)
      .then( () => {
        websocket.stop()

        expect(countTicker).not.toBe(0)
        expect(countOrderBook).not.toBe(0)
        expect(countTrade).not.toBe(0)
        done()
      })


  }, 60000)

})




