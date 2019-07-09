'use strict'

const Clients = require('./clients')
const uuidv4 = require('uuid/v4')


describe('Clients Test', () => {

  test('Test Subscribe & FindAll ', (done) => {

    const myClients = new Clients()
    const id = uuidv4()

    myClients.add(id, {
      someKey: "someValue",
    })

    myClients.add(uuidv4(), {
      someKey: "someCrazyValue",
    })

     const subscription = {
        exchange: 'gdax',
        symbol: 'BTC/USD'
      }

    myClients.subscribe(id, subscription)

    expect(myClients.findAll('gdax').length).toBe(1)

    done()
  })


  test('findOne ', (done) => {

    const myClients = new Clients()
    const id = uuidv4()

    myClients.add(id, {
      exchange: 'gdax',

      someKey: "someValue",
    })

    const subscription = {
      exchange: 'gdax',
      symbol: 'BTC/USD'
    }

    myClients.subscribe(id, subscription)

    myClients.add(uuidv4(), {
      someKey: "someCrazyValue",
    })

    expect(myClients.findOne(id).websocket.someKey).toEqual("someValue")
    done()
  })

})