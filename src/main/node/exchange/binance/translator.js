'use strict'

const { percentChange } = require('../../util/simple-math')

const MARKETS = ['BTC', 'ETH', 'USDT', 'BNB', 'USD', 'USDC', 'PAX', 'TUSD', 'USDS']

function insert(str, index, value) {
    return str.substr(0, index) + value + str.substr(index);
}

/**

{
  symbol: 'BTC/USDT',
  timestamp: 1520365692723,
  datetime: '2018-03-06T19:48:12.723Z',
  high: 11710,
  low: 10555.48,
  bid: 10671.7,
  bidVolume: 0.001039,
  ask: 10671.71,
  askVolume: 0.159162,
  vwap: 11093.30734626,
  open: 11664.99,
  close: 11665,
  first: undefined,
  last: 10665,
  change: -999.99,
  percentage: -8.573,
  average: undefined,
  baseVolume: 28371.511518,
  quoteVolume: 314733897.1472513,
  info: {
    symbol: 'BTCUSDT',
    priceChange: '-999.99000000',
    priceChangePercent: '-8.573',
    weightedAvgPrice: '11093.30734626',
    prevClosePrice: '11665.00000000',
    lastPrice: '10665.00000000',
    lastQty: '0.00371600',
    bidPrice: '10671.70000000',
    bidQty: '0.00103900',
    askPrice: '10671.71000000',
    askQty: '0.15916200',
    openPrice: '11664.99000000',
    highPrice: '11710.00000000',
    lowPrice: '10555.48000000',
    volume: '28371.51151800',
    quoteVolume: '314733897.14725128',
    openTime: 1520279292723,
    closeTime: 1520365692723,
    firstId: 24089730,
    lastId: 24335051,
    count: 245322
    }
  }

**/

const ticker = (data, previous) => {

  const price = parseFloat(data.ask)
  const open = parseFloat(data.open)

  return {
    symbol: symbol(data.symbol),
    open: open,
    price: price,
    volume_24h: parseFloat(data.quoteVolume),
    change_24h: percentChange(price, open),
    bid: parseFloat(data.bid),
    ask: parseFloat(data.ask),
    high: parseFloat(data.high),
    low: parseFloat(data.low)
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
*
{
  "e": "24hrTicker",  // Event type
  "E": 123456789,     // Event time
  "s": "BNBBTC",      // Symbol
  "p": "0.0015",      // Price change
  "P": "250.00",      // Price change percent
  "w": "0.0018",      // Weighted average price
  "x": "0.0009",      // Previous day's close price
  "c": "0.0025",      // Current day's close price
  "Q": "10",          // Close trade's quantity
  "b": "0.0024",      // Best bid price
  "B": "10",          // Bid bid quantity
  "a": "0.0026",      // Best ask price
  "A": "100",         // Best ask quantity
  "o": "0.0010",      // Open price
  "h": "0.0025",      // High price
  "l": "0.0010",      // Low price
  "v": "10000",       // Total traded base asset volume
  "q": "18",          // Total traded quote asset volume
  "O": 0,             // Statistics open time
  "C": 86400000,      // Statistics close time
  "F": 0,             // First trade ID
  "L": 18150,         // Last trade Id
  "n": 18151          // Total number of trades
}
*
**/

function tickerSocket(message, previous) {

  const price = parseFloat(message.a)
  const open = parseFloat(message.o)

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
    symbol: symbol(message.s),
    open: open,
    price: price,
    volume_24h: parseFloat(message.q),
    change_24h: percentChange(price, open),
    bid: parseFloat(message.b),
    bid_trend: ( (previous.bid - message.b) > 0) ? 'down' : 'up',
    ask: parseFloat(message.a),
    ask_trend: ( (previous.ask - message.a) > 0) ? 'down' : 'up',
    high: parseFloat(message.h),
    high_trend,
    low: parseFloat(message.l),
    low_trend,
  }
}

const symbol = (input) => {

  if ( input.includes('/')) {
    return input
  }

  if (input.length == 6) {
    return insert(input, 3, '/').replace(/bcc/i, 'BCH')
  }

  let result = undefined

  MARKETS.forEach( (market) => {
    if ( input.substr( input.length - market.length) === market ) {
      result = insert(input, input.length - market.length, '/')
    }
  })

  if (result == undefined) {
    console.log("Failure to lookup symbol correctly " + input)
  }

  return result
}

/**

  { stream: 'strateth@depth',
    data:
     { e: 'depthUpdate',
       E: 1522690372246,
       s: 'STRATETH',
       U: 18479359,
       u: 18479363,
       b: [ [Array], [Array] ],  //All updated bids
       a: [ [Array], [Array], [Array] ] } } //All updated asks

**/
const orderbooks = (input) => {

  const result = []

  const convertedSymbol = symbol(input.data.s)

  input.data.b.forEach( bid => {
    result.push({
      symbol: convertedSymbol,
      bid: parseFloat(bid[0]),
      amount: parseFloat(bid[1]),
    })
  })

  input.data.a.forEach( bid => {
    result.push({
      symbol: convertedSymbol,
      ask: parseFloat(bid[0]),
      amount: parseFloat(bid[1]),
    })
  })

  return result
}

/**

{
  "e": "trade",     // Event type
  "E": 123456789,   // Event time
  "s": "BNBBTC",    // Symbol
  "t": 12345,       // Trade ID
  "p": "0.001",     // Price
  "q": "100",       // Quantity
  "b": 88,          // Buyer order Id
  "a": 50,          // Seller order Id
  "T": 123456785,   // Trade time
  "m": true,        // Is the buyer the market maker?
  "M": true         // Ignore.
}

**/

const trade = (input) => {

  return {
    symbol: symbol(input.data.s),
    price: parseFloat(input.data.p),
    amount: parseFloat(input.data.q),
    timestamp: input.data.E,
  }

}

module.exports = {
  symbol,
  ticker,
  tickers,
  tickerSocket,
  orderbooks,
  trade,
}
