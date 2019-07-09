const errorHandler = require('./error-handler')


//TODO use a map of clients by exchange
class Clients {

  constructor() {
    this.clientList = []
  }

  add(id, websocket) {
    console.log('Adding Client')
    const client = {
      id: id,
      websocket: websocket,
      subscription: {},
      errorCount: 0
    }

    this.clientList.push(client)
  }

  findAll(exchange) {
    return this.clientList.filter( (elem) => {
      if (elem.subscription.exchange === exchange) {
        return elem
      }
    })
    .map( (elem) => { return elem.websocket })
  }

  findOne(id) {
    return this.clientList.filter( (elem) => {
       if (elem.id === id) {
         return elem
       }
    })[0]
  }

  subscribe(id, subscription) {
    const client = this.findOne(id)
    client.subscription = subscription
  }


  dispatch(message) {

    this.clientList.forEach( (client, index) => {

      if (client.subscription.exchange === message.exchange
        && client.subscription.symbol === message.data.symbol
        && client.websocket.isAlive === true) {

          client.websocket.send(JSON.stringify(message), (error) => {
            if (error) {
              if ( error.message.includes('WebSocket is not open:') ){
                this.clientList.splice(index, 1)
              }
              else {
                console.log(error)
              }
            }
          })

      }
    })
  }

}

module.exports = Clients