'use strict'

const { percentChange } = require('../../util/simple-math')

/**
*
'QSP/ETH':
   { symbol: 'QSP/ETH',
     timestamp: 1520801236000,
     datetime: '2018-03-11T20:47:16.000Z',
     high: 0.000271,
     low: 0.00023,
     bid: 0.000255,
     ask: 0.000261,
     vwap: undefined,
     open: undefined,
     close: undefined,
     first: undefined,
     last: 0.000262,
     change: 13.91,
     percentage: undefined,
     average: undefined,
     baseVolume: 123798.119293,
     quoteVolume: 30.915171,
     info:
      { coinType: 'QSP',
        trading: true,
        symbol: 'QSP-ETH',
        lastDealPrice: 0.000262,
        buy: 0.000255,
        sell: 0.000261,
        change: 0.000032,
        coinTypePair: 'ETH',
        sort: 0,
        feeRate: 0.001,
        volValue: 30.915171,
        high: 0.000271,
        datetime: 1520801236000,
        vol: 123798.119293,
        low: 0.00023,
        changeRate: 0.1391 } }

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
    change_24h: message.info.changeRate,
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
    volume_24h: (message.volume_24h != null) ? message.volume_24h * message.price : 0,
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

module.exports = {
  symbol,
  ticker,
  tickers,
  tickerAll,
  tickerSocket,
}