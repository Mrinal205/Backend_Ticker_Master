'use strict'
const moment = require('moment')

const { percentChange } = require('../../util/simple-math')

/**
*
{  symbol: 'BTC/USD',
   timestamp: 1519580734016,
   datetime: '2018-02-25T17:45:34.016Z',
   high: undefined,
   low: undefined,
   bid: 9444.99,
   ask: 9445,
   vwap: undefined,
   open: undefined,
   close: undefined,
   first: undefined,
   last: 9444.99,
   change: undefined,
   percentage: undefined,
   average: undefined,
   baseVolume: 13806.88185529,
   quoteVolume: undefined,
   info:
    { trade_id: 38100839,
      price: '9444.99000000',
      size: '0.01974536',
      bid: '9444.99',
      ask: '9445',
      volume: '13806.88185529',
      time: '2018-02-25T17:45:34.016000Z' }
*
**/

const ticker = (message) => {

  const high = ( message.high == undefined || message.high == null ) ? 0 : message.high
  const low = ( message.low == undefined || message.low == null ) ? 0 : message.low

  return {
    symbol: message.symbol,
    open: message.open,
    price: message.last,
    volume_24h: parseFloat(message.info.volume) * message.last,
    change_24h: percentChange(message.last, message.open),
    bid: message.bid,
    ask: message.ask,
    high: high,
    low: low
  }
}

const tickerAll = (data) => {

  const result = {}

  for (var key in data) {
    result[key] = ticker(data[key])
  }

  return result
}

/**
*
{ type: 'ticker',
  sequence: 594011462,
  product_id: 'ETH-EUR',
  price: '699.00000000',
  open_24h: '684.17000000',
  volume_24h: '5083.72842425',
  low_24h: '699.00000000',
  high_24h: '698.95000000',
  volume_30d: '803857.70799472',
  best_bid: '698.99',
  best_ask: '699',
  side: 'buy',
  time: '2018-02-26T11:56:12.598000Z',
  trade_id: 3330525,
  last_size: '1.72933271' }
*
**/

const tickerSocket = (message, previous) => {

  const price = parseFloat(message.price)
  const open = parseFloat(message.open_24h)

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
    symbol: symbol(message.product_id),
    open: open,
    price: price,
    volume_24h: parseFloat(message.volume_24h) * price,
    change_24h: percentChange(price, open),
    bid: parseFloat(message.best_bid),
    bid_trend: ( (previous.bid - message.best_bid) > 0) ? 'down' : 'up',
    ask: parseFloat(message.best_ask),
    ask_trend: ( (previous.ask - message.best_ask) > 0) ? 'down' : 'up',
    high: parseFloat(message.high_24h),
    high_trend,
    low: parseFloat(message.low_24h),
    low_trend,
  }
}

const symbol = (input) => {

  return input.replace('-', '/')
}

/**

  { type: 'l2update',
    product_id: 'BTC-GBP',
    time: '2018-04-02T14:36:36.564Z',
    changes: [ [ 'sell', '4967.74000000', '0.08' ] ] }

**/

const orderbook = (input) => {

  if (input.changes.length > 1) (
    console.log('warn', 'More than a single change detected', input)
  )

  const result = {
    symbol: symbol(input.product_id)
  }

  if (input.changes[0][0] === 'sell') {
    result.ask = parseFloat(input.changes[0][1])
    result.amount = parseFloat(input.changes[0][2])
  }
  else {
    result.bid = parseFloat(input.changes[0][1])
    result.amount = parseFloat(input.changes[0][2])
  }

  return result

}

/**

  {
    "type": "match",
    "trade_id": 32051459,
    "maker_order_id": "265dd87d-7f48-48b7-8cf0-0524deb44cf2",
    "taker_order_id": "46acb3b8-5a3a-4278-b479-4b29760f8418",
    "side": "sell",
    "size": "20.54259385",
    "price": "492.70000000",
    "product_id": "ETH-USD",
    "sequence": 3323876431,
    "time": "2018-04-13T03:11:00.000000Z"
  }

**/

function trade(input) {

   return {
      symbol: symbol(input.product_id),
      price: parseFloat(input.price),
      amount: parseFloat(input.size),
      timestamp: moment(input.time).valueOf(),
    }

}

module.exports = {
  symbol,
  ticker,
  tickerAll,
  tickerSocket,
  orderbook,
  trade,
}