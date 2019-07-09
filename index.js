'use strict'

const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const url = require('url');
const uuidv4 = require('uuid/v4')

const lookupService = require('./src/main/node/exchange/service-lookup')

const Clients = require('./src/main/node/websocket/clients')
const ClientsPrune = require('./src/main/node/websocket/clients-prune')
const tickerService = require('./src/main/node/ticker-service')
const marketService = require('./src/main/node/market-service')
const candlestickService = require('./src/main/node/candlestick-service')
const orderService = require('./src/main/node/order-service')
const tradeService = require('./src/main/node/trade-service')

const gdaxWebsocket = require('./src/main/node/exchange/gdax/gdax-websocket')
const binanceWebsocket = require('./src/main/node/exchange/binance/binance-websocket')
const krakenWebsocket = require('./src/main/node/exchange/kraken/kraken-websocket')
const poloniexnWebsocket = require('./src/main/node/exchange/poloniex/poloniex-websocket')
const kucoinWebsocket = require('./src/main/node/exchange/kucoin/kucoin-websocket')
const bittrexWebsocket = require('./src/main/node/exchange/bittrex/bittrex-websocket')

const websocketConnections = [
  gdaxWebsocket,
  binanceWebsocket,
//  krakenWebsocket,
//  poloniexnWebsocket,
//  kucoinWebsocket,
  bittrexWebsocket
]

const PORT = process.env.PORT || 5000;

const app = express()


app
  .use((request, response, next) => {
    response.header("Access-Control-Allow-Origin", "*");
    response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  })

  .get('/health', (request, response) => {
     response.send({success: true});
  })

  .get('/ordersbook', (request, response) => {

    const url_parts = url.parse(request.url, true);
    const query = url_parts.query;
    console.log("QUERY:", query)

    orderService.fetch(query.exchange, query.symbol)
      .then( result => {

        response.send({
          exchange: query.exchange,
          orders: result
        })

      })
      .catch( error => {
        console.log('Error', error)

        response.status(400).send({
            error: error.message
        })
      })

  })

  .get('/trades', (request, response) => {

    const url_parts = url.parse(request.url, true);
    const query = url_parts.query;
    console.log("QUERY:", query)

    tradeService.fetch(query.exchange, query.symbol)
      .then( result => {

        response.send({
          exchange: query.exchange,
          trades: result
        })

      })
      .catch( error => {
        console.log('Error', error)

        response.status(400).send({
            error: error.message
        })
      })

  })

  .get('/tickers', (request, response) => {

     const url_parts = url.parse(request.url, true);
     const query = url_parts.query;
     console.log("QUERY:", query)
     const event = {
       exchange: query.exchange
     }

     tickerService.tickerAll( query.exchange )
       .then( data => {
         response.send({
            exchange: query.exchange,
            ticker: data
         })

       })
       .catch( error => {
         console.log('Error:', 'Calling Markets', error)
         response.status(400).send({
             error: error.stack
         })
       })

  })

//   .get('/tickers/:exchange', (request, response) => {
//
//       const url_parts = url.parse(request.url, true);
//       const query = url_parts.query;
//       console.log("Request:", request.params)
//
//       const event = {
//         exchange: request.params.exchange,
//         symbol: 'BTC/USD'
//       }
//
//       tickerService.ticker(event, null, (error, data) => {
//         response.send({
//           exchange: data.exchange,
//           ticker: data.ticker
//         })
//       })
//
//    })

  .get('/market', (request, response) => {
    const url_parts = url.parse(request.url, true);
    const query = url_parts.query;
    marketService.getMarketInfo(query.exchange.toLowerCase(), query.symbol)
    .then(data => {
      response.send({
        market: data
      });
    }).catch( error => {
      console.log('Error:', 'Calling /market', error)
      response.status(400).send({
          error: error.stack
      })
    })
  })

  .get('/markets', (request, response) => {

    const url_parts = url.parse(request.url, true);
    const query = url_parts.query;

    marketService.handle(query.exchange)
      .then( data => {
        response.send({
          exchange: query.exchange,
          market: data
        })

      })
      .catch( error => {
        console.log('Error:', 'Calling Markets', error)
        response.status(400).send({
            error: error.stack
        })
      })
  })

  .get('/candlesticks', (request, response) => {

    const url_parts = url.parse(request.url, true);
    const query = url_parts.query;

     const event = {
       exchange: query.exchange,
       symbol: query.symbol,
       interval: query.interval,
       since: query.since,
     }

     candlestickService.handle(event, null, (error, data) => {

        if (error) {
            response.status(400).send({
                error: error.stack
            })
        }
        else {
            response.send({
                 exchange: data.exchange,
                 candleSticks: data.candleSticks
            })
        }

     })

  })

const server = http.createServer(app);
const wss = new WebSocket.Server({ server })
const clients = new Clients()

// Start all WebSocket Proxy connections
websocketConnections.forEach( connection => {
  connection.start(clients)
})


ClientsPrune(clients)

function heartbeat() {
//  console.log('setting alive to true')
  this.isAlive = true;
}

wss.on('connection', function connection(websocket, request) {

  //Keep alive
  websocket.isAlive = true
  websocket.on('pong', heartbeat);

  const id = uuidv4()
  clients.add(id, websocket)

  websocket.on('message', function incoming(message) {

    console.log("Adding subscription:", message)
    clients.subscribe(id, JSON.parse(message))

  })

  websocket.send('connected')
})


wss.on('close', function close(websocket, request) {
  console.log("Closed Connection")
  //TODO remove clients?
})


server.listen(PORT, function listening() {
  console.log('Listening on %d', server.address().port);
})