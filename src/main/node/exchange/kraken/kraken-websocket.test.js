'use strict'

const kucoinWebSocket = require('./kraken-websocket')
const sleep = require('../../sleep')



describe('KRAKEN WebSocket Test', () => {

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
        expect(message.exchange).toBe('kraken')

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

    kucoinWebSocket.start(clients)

    await sleep(9000)
      .then( () => {
        kucoinWebSocket.stop()

        expect(countTicker).not.toBe(0)
        expect(countOrderBook).not.toBe(0)
//        expect(countTrade).not.toBe(0) //TODO add
        done()
      })


  }, 10000)

})




