'use strict'

const { percentChange } = require('../../util/simple-math')

/**
*
'XRP/JPY':
   { symbol: 'XRP/JPY',
     timestamp: 1520393855662,
     datetime: '2018-03-07T03:37:35.662Z',
     high: 103.45,
     low: 89,
     bid: 95.28,
     ask: 114.787,
     vwap: 99.19317438,
     open: 99,
     close: undefined,
     first: undefined,
     last: 99,
     change: undefined,
     percentage: undefined,
     average: undefined,
     baseVolume: 25967.69928,
     quoteVolume: 2575818.5229284405,
     info:
      { a: [Array],
        b: [Array],
        c: [Array],
        v: [Array],
        p: [Array],
        t: [Array],
        l: [Array],
        h: [Array],
        o: '99.00000000' } },

*
**/

const ticker = (message) => {

  const high = ( message.high == undefined || message.high == null ) ? 0 : message.high
  const low = ( message.low == undefined || message.low == null ) ? 0 : message.low
  const volume_24h = parseFloat(message.baseVolume)

  return {
    symbol: message.symbol,
    open: message.open,
    price: message.last,
    volume_24h: (volume_24h != null) ? volume_24h * message.last : 0,
    change_24h: percentChange(message.last, message.open),
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

//TODO remove?
const tickerAll = (data) => {

  const result = {}

  for (var key in data) {
    result[key] = ticker(data[key])
  }

  return result
}

/**
*
{ symbol: 'BTC/USD',
  open: 10718.4,
  price: 10645.1,
  volume_24h: NaN,
  change_24h: -0.6838707269741685,
  bid: 10633.3,
  ask: 10645.1,
  high: 11023.1,
  low: 10423 }
*
**/

const tickerSocket = (message, previous) => {

  previous = (previous) ? previous : {} //null safe...

  return {
    symbol: message.symbol,
    open: message.open,
    price: message.price,
    volume_24h: (message.volume_24h != null) ? message.volume_24h * message.price: 0,
    change_24h: (message.change_24h != null) ? message.change_24h : 0,
    bid: message.bid,
    bid_trend: ( (previous.bid - message.bid) > 0) ? 'down' : 'up',
    ask: message.ask,
    ask_trend: ( (previous.ask - message.ask) > 0) ? 'down' : 'up',
    high: message.high,
    low: message.low
  }
}

const symbol = (input) => {

  return input
}


/**

{symbol: XRP/BTC,
 asks: [ [ 0.0000723, 1393.556 ],
  [ 0.00007231, 75 ],
  [ 0.00007233, 1045.306 ],
  [ 0.00007234, 1547.782 ],
  [ 0.00007235, 1999 ],
  [ 0.0000725, 3202.001 ],
  [ 0.00007251, 25012.7 ],
  [ 0.00007252, 86 ],
  [ 0.00007254, 613.019 ],
  [ 0.00007258, 8070.7 ] ]
 bids: [ [ 0.00007224, 6130.9 ],
  [ 0.00007223, 8064.472 ],
  [ 0.00007222, 2000 ],
  [ 0.00007216, 1550.698 ],
  [ 0.00007215, 1551.051 ],
  [ 0.00007211, 1202.247 ],
  [ 0.00007198, 9410.851 ],
  [ 0.00007197, 438.699 ],
  [ 0.00007192, 976.899 ],
  [ 0.00007191, 396.771 ] ]
}

**/

const orderbooks = (input) => {

  const result = []

  const convertedSymbol = input.symbol

  input.bids.forEach( bid => {
    result.push({
      symbol: convertedSymbol,
      bid: parseFloat(bid[0]),
      amount: parseFloat(bid[1]),
    })
  })

  input.asks.forEach( ask => {
    result.push({
      symbol: convertedSymbol,
      ask: parseFloat(ask[0]),
      amount: parseFloat(ask[1]),
    })
  })

  return result
}


module.exports = {
  symbol,
  ticker,
  tickers,
  tickerAll,
  tickerSocket,
  orderbooks,
}