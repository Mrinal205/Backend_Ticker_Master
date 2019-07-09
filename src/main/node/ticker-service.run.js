'use strict'
const tickerService = require('./ticker-service')



tickerService.ticker('binance', 'ETH/BTC')
  .then( data => {

    console.log(data)

})

