'use strict'

const { percentChange } = require('../../util/simple-math')
const Big = require('big.js')
const moment = require('moment')


function insert(str, index, value) {
    return str.substr(0, index) + value + str.substr(index);
}

/**

  { symbol: 'BTC/USDT',
    timestamp: 1523417600969,
    datetime: '2018-04-11T03:33:20.969Z',
    high: 6881.87332722,
    low: 6658.71497418,
    bid: 6818.8514351,
    ask: 6822.72113993,
    vwap: undefined,
    open: undefined,
    close: undefined,
    first: undefined,
    last: 6818.8514351,
    change: 0.00905767,
    percentage: undefined,
    average: undefined,
    baseVolume: 1101.2895112,
    quoteVolume: 7484121.65920591,
    info:
     { id: 121,
       last: '6818.85143510',
       lowestAsk: '6822.72113993',
       highestBid: '6818.85143510',
       percentChange: '0.00905767',
       baseVolume: '7484121.65920591',
       quoteVolume: '1101.28951120',
       isFrozen: '0',
       high24hr: '6881.87332722',
       low24hr: '6658.71497418' } }

**/

const ticker = (data, previous) => {

  return {
    symbol: data.symbol,
    open: data.info.low24hr, //TODO this is not right...
    price: parseFloat(data.last),
    volume_24h: parseFloat(data.baseVolume) * parseFloat(data.last),
    change_24h: parseFloat(data.change),
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

  ETH_GAS:
       { id: 199,
         last: '0.03426002',
         lowestAsk: '0.03670144',
         highestBid: '0.03437034',
         percentChange: '-0.06075507',
         baseVolume: '57.91489156',
         quoteVolume: '1573.25282238',
         isFrozen: '0',
         high24hr: '0.04072046',
         low24hr: '0.03319560' },

**/

const tickerAll = (tickers) => {

  const result = {}
  for (var key in tickers) {
    result[symbol(key)] = {
      symbol: symbol(key),
      price: parseFloat(tickers[key].last),
      volume_24h: parseFloat(tickers[key].baseVolume),
      change_24h: parseFloat(tickers[key].percentChange),
      bid: parseFloat(tickers[key].highestBid),
      bid_trend: 'up',
      ask: parseFloat(tickers[key].lowestAsk),
      ask_trend: 'up',
      high: parseFloat(tickers[key]['high24hr']),
      low: parseFloat(tickers[key]['low24hr'])
    }

  }

  return result
}


/**
*
{
  "currencyPair": "ETH_GAS", //Needs to be reversed
  "last": "0.03569523",
  "lowestAsk": "0.03732619",
  "highestBid": "0.03563075",
  "percentChange": "-0.02140852",
  "baseVolume": "55.07517849",
  "quoteVolume": "1489.40490648",
  "isFrozen": 0,
  "24hrHigh": "0.04072046",
  "24hrLow": "0.03319560"
}

{
  "currencyPair": "USDT_LTC",
  "last": "178.00000000",
  "lowestAsk": "178.11900349",
  "highestBid": "178.00000000",
  "percentChange": "0.00233758",
  "baseVolume": "3778700.45923836",
  "quoteVolume": "22020.13596120",
  "isFrozen": 0,
  "24hrHigh": "183.56586846",
  "24hrLow": "158.28200000"
}

*
**/

const tickerSocket = (message, previous) => {

  previous = (previous) ? previous : {}

  return {
    symbol: symbol(message.currencyPair),
    price: parseFloat(message.last),
    volume_24h: parseFloat(message.baseVolume) * parseFloat(message.last),
    change_24h: parseFloat(message.percentChange),
    bid: parseFloat(message.highestBid),
    bid_trend: ( (previous.bid - message.highestBid) > 0) ? 'down' : 'up',
    ask: parseFloat(message.lowestAsk),
    ask_trend: ( (previous.ask - message.lowestAsk) > 0) ? 'down' : 'up',
    high: parseFloat(message['24hrHigh']),
    low: parseFloat(message['24hrLow'])
  }
}


/**

 {symbolPair: "USDT_BTC", rate: '0.00300888', type: 'bid', amount: '3.32349029'},type: 'orderBookModify'}

**/
const orderbook = (input) => {

  const result = {
      symbol: symbol(input.symbolPair),
      amount: parseFloat(input.amount),
  }

  if (input.type === 'bid') {
    result.bid = parseFloat(input.rate)
  }
  if (input.type === 'ask') {
    result.ask = parseFloat(input.rate)
  }

  if (result.ask === undefined && result.bid === undefined) {
    console.log('Warning: undefined type', input.type)
  }

  return result
}


/**
  {
    symbolPair: 'BTC_STR',
    tradeID: '2206199',
    type: 'sell',
    rate: '362.00000002',
    amount: '0.00690480',
    total: '2.49953760',
    date: '2018-04-15T01:17:20.000Z'
  }

**/
const trade = (input) => {

  return {
    symbol: symbol(input.symbolPair),
    price: parseFloat(input.rate),
    amount: parseFloat(input.amount),
    timestamp: moment(input.date).valueOf(),
  }

}



const symbol = (input) => {
  const symbols = input.split('_')
  return symbols[1] + '/' + symbols[0]
}

module.exports = {
  symbol,
  ticker,
  tickers,
  tickerSocket,
  tickerAll,
  trade,
  orderbook,
}