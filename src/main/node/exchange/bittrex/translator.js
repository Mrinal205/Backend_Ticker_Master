'use strict'

const { percentChange } = require('../../util/simple-math')


/**

{ symbol: 'BTC/USDT',
      timestamp: 1521041215570,
      datetime: '2018-03-14T15:26:55.570Z',
      high: 9332,
      low: 8561,
      bid: 8667.98096611,
      ask: 8689.9,
      vwap: undefined,
      open: undefined,
      close: undefined,
      first: undefined,
      last: 8667.98096611,
      change: -0.03583041722557483,
      percentage: undefined,
      average: undefined,
      baseVolume: 3479.61481393,
      quoteVolume: 31076101.11719335,
      info:
       { MarketName: 'USDT-BTC',
         High: 9332,
         Low: 8561,
         Volume: 3479.61481393,
         Last: 8667.98096611,
         BaseVolume: 31076101.11719335,
         TimeStamp: '2018-03-14T15:26:55.57',
         Bid: 8667.98096611,
         Ask: 8689.9,
         OpenBuyOrders: 4570,
         OpenSellOrders: 4948,
         PrevDay: 8990.10000001,
         Created: '2015-12-11T06:31:40.633' } }

**/


const ticker = (message) => {

  const high = ( message.high == undefined || message.high == null ) ? 0 : message.high
  const low = ( message.low == undefined || message.low == null ) ? 0 : message.low

  return {
    symbol: message.symbol,
    open: message.info.PrevDay,
    price: message.last,
    volume_24h: message.baseVolume * message.last,
    change_24h: percentChange(message.last, message.info.PrevDay),
    bid: message.bid,
    ask: message.ask,
    high: high,
    low: low
  }
}

const tickers = (data) => {

  const result = {}
  for (let key in data) {
    result[key] = ticker(data[key])
  }

  return result
}

/**

  {
    pair: 'USDT-ETH',
    last: 518.44368811,
    priceChangePercent: 0.08565407722174179,
    sell: 518.54368811,
    buy: 517.44,
    high: 537.62599116,
    low: 507.15500002,
    volume: 9237.02985633,
    timestamp: 1523844913.743
  }

**/

function tickerSocket(message, previous) {

  previous = (previous) ? previous : {} //null safe...


  //Only update trends here if they change
  let low_trend = (previous.low === parseFloat(message.l) && previous.low_trend) ?
    previous.low_trend :
    undefined
  low_trend = ( ! low_trend && (previous.low - parseFloat(message.l)) > 0) ? 'down' : 'up'

  let high_trend = (previous.high === parseFloat(message.h) && previous.high_trend) ?
    previous.high_trend :
    undefined
  high_trend = ( ! high_trend && (previous.high - parseFloat(message.h)) > 0) ? 'down' : 'up'

  return {
    symbol: symbol(message.pair),
    price: message.sell,
    volume_24h: message.volume * message.sell,
    change_24h: message.priceChangePercent,
    bid: parseFloat(message.buy),
    bid_trend: ( (previous.bid - message.buy) > 0) ? 'down' : 'up',
    ask: parseFloat(message.sell),
    ask_trend: ( (previous.ask - message.sell) > 0) ? 'down' : 'up',
    high: message.high,
    high_trend,
    low: message.low,
    low_trend,
  }
}

/**

{
  "pair": "BTC-NEO",
  "cseq": 17137,
  "data": {
    "buy": [
      {
        "action": "update",
        "rate": 0.00832393,
        "quantity": 3.2175
      },
      {
        "action": "update",
        "rate": 0.00812842,
        "quantity": 1137.964
      },
      {
        "action": "remove",
        "rate": 0.00812689,
        "quantity": 0
      },
      {
        "action": "remove",
        "rate": 0.00710926,
        "quantity": 0
      }
    ],
    "sell": [
      {
        "action": "remove",
        "rate": 0.00842416,
        "quantity": 0
      },
      {
        "action": "update",
        "rate": 0.00842417,
        "quantity": 42.27
      },
      {
        "action": "update",
        "rate": 0.00842419,
        "quantity": 9.49646197
      },
      {
        "action": "remove",
        "rate": 0.00938091,
        "quantity": 0
      }
    ]
  }
}

**/
const orderbooks = (input) => {

  const result = []

  const convertedSymbol = symbol(input.pair)

  input.data.buy.forEach( bid => {
    result.push({
      symbol: convertedSymbol,
      bid: parseFloat(bid.rate),
      amount: parseFloat(bid.quantity),
    })
  })

  input.data.sell.forEach( ask => {
    result.push({
      symbol: convertedSymbol,
      ask: parseFloat(ask.rate),
      amount: parseFloat(ask.quantity),
    })
  })

  return result
}


/**

 { pair: 'BTC-ETH',
  data:
   [ { id: 229572848,
       quantity: 0.00868656,
       rate: 0.06331624,
       price: 0.00055,
       orderType: 'sell',
       timestamp: 1523847229.837 },
     { id: 229572810,
       quantity: 0.04331031,
       rate: 0.06338,
       price: 0.002745,
       orderType: 'buy',
       timestamp: 1523847218.9 },
     { id: 229572803,
       quantity: 0.00871288,
       rate: 0.06312495,
       price: 0.00055,
       orderType: 'sell',
       timestamp: 1523847217.523 },
     { id: 229572762,
       quantity: 0.01847566,
       rate: 0.06349218,
       price: 0.00117305,
       orderType: 'buy',
       timestamp: 1523847207.523 },

**/
const trades = (input) => {

  const result = []

  const translatedSymbol = symbol(input.pair)

  input.data.forEach( message => {
    result.push({
      symbol: translatedSymbol,
      price: parseFloat(message.rate),
      amount: parseFloat(message.quantity),
      timestamp: message.timestamp,
    })
  })

  return result
}


const symbol = (input) => {
  const splitString = input.split(['-'])
  return splitString[1] + '/' + splitString[0]
}

module.exports = {
  symbol,
  ticker,
  tickers,
  tickerSocket,
  orderbooks,
  trades,
}