'use strict'
const Big = require('big.js')

//New Crypto Review

/**

Converts to USD the symbol given an amount and the rates table.

**/
exports.convertToUsd = function(symbol, amount, rates) {

  if (amount === undefined) {
    return undefined
  }

  if (symbol === 'USD' || symbol === 'USDT' || symbol === 'USDC') {
    return amount
  }

  let rate = rates[symbol + '/USD']
  if (rate) {
    return parseFloat(Big(rate).times(new Big(amount)))
  }

  rate = rates[symbol + '/USDT']
  if (rate) {
    return parseFloat(Big(rate).times(new Big(amount)))
  }

  rate = rates[symbol + '/BTC']
  if (rate) {
    const usdConverter = (rates['BTC/USD']) ?
      'BTC/USD' :
      'BTC/USDT'

    return multiply(rate, amount, rates[usdConverter])
  }

  rate = rates[symbol + '/ETH']
  if (rate) {
    const usdConverter = (rates['ETH/USD']) ?
      'ETH/USD' :
      'ETH/USDT'

    return multiply(rate, amount, rates[usdConverter])
  }

  rate = rates[symbol + '/BNB']
  if (rate) {
    const usdConverter = (rates['BNB/USD']) ?
      'BNB/USD' :
      'BNB/USDT'

    return multiply(rate, amount, rates[usdConverter])
  }

  throw 'Unexpected code result'
}


function multiply(val1, val2, val3) {

  return parseFloat(new Big(val1).times(new Big(val2)).times(new Big(val3)))

}