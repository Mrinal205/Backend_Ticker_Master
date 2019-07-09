'use strict'
const tickerService = require('./ticker-service')
const fiatRateClient = require('./convert/fiat-rate-client')
const exchangeRate = require('./convert/exchange-rate')
const exchangeLookup = require('./exchange/exchange-lookup')
const Big = require('big.js')


const NodeCache = require( "node-cache" );
const marketDataTTL = 5 // In seconds, 0 forever
const marketCache = new NodeCache({ stdTTL: marketDataTTL });


function fetchMarket(exchangeName) {

  return tickerService.tickerAll(exchangeName)
}

function addUSDValues(input) {

  return fiatRateClient.fetchRates()
    .then( fiatRates => {
      //Get fiat returns symbol pair BTC/USD for some reason??
      delete fiatRates['BTC/USD']

      const cryptoRates = {}

      Object.keys(input).map( (key, index) => { cryptoRates[key] = input[key].price })
      const allRates = Object.assign(fiatRates, cryptoRates)

      for (let key in input) {
        const symbols = key.split('/')

        try {
          input[key].price_usd = exchangeRate.convertToUsd(symbols[1], input[key].price, allRates)
          input[key].volume_24h_usd = exchangeRate.convertToUsd(symbols[1], input[key].volume_24h, allRates)
        }
        catch (error) {
          console.log('Error', error, symbols[1], input[key].price, allRates)
        }
      }

      return input
    })

}

function multi(x, y) {

  if (x === undefined || y === undefined) {
    return undefined
  }

  const x1 = new Big(x)
  const y1 = new Big(y)

  return parseFloat(x1.times(y1))
}

//Make sure that every ticker is in the Exchange's market.
//https://github.com/binance-exchange/binance-java-api/issues/9
function filter(tickers, market) {
  const filteredData = {}

  for (let key in tickers) {
    if (key.includes('BCH/')) {
      continue
    }

    if (market[key] !== undefined) {
      filteredData[key] = tickers[key]
    }
  }

  return filteredData
}

function addMarketInfo(marketData, tickers) {

  const response = {}
   for (let key in tickers) {
      if (marketData[key] !== undefined) {
        tickers[key].precision = marketData[key].precision
        tickers[key].maker = marketData[key].maker
        tickers[key].taker = marketData[key].taker
      }
   }

}


const handle = async (exchangeName) => {

  const cachedValue = marketCache.get(exchangeName)
  if (cachedValue) {
    return cachedValue
  }

  const rawMarketData = await fetchMarket(exchangeName)
  const markets = await exchangeLookup[exchangeName].load_markets()

  await fetchMarket
  await markets

  const filteredData = filter(rawMarketData, markets)
  addMarketInfo(markets, filteredData)

  const result = addUSDValues(filteredData)
  marketCache.set(exchangeName, result)
  return result
}

const getMarketInfo = async (exchangeName, symbol) => {
  const client = exchangeLookup[exchangeName]
  const market = await client.market(symbol)
  return Promise.resolve(market);
}

module.exports = {
  handle,
  addUSDValues,
  getMarketInfo
}