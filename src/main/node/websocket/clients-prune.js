'use strict'

function noop() {}

module.exports = (clients) => {

  //TODO still need to remove this from the client list

  setInterval(function ping() {

//    console.log("--- Pruning ----")

    clients.findAll().forEach(function each(ws) {
      if (ws.isAlive === false) return ws.terminate()

      ws.isAlive = false
      ws.ping(noop)
    })

  }, 3000)

}

