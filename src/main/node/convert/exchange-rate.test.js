'use strict'

const exchangeRate = require('./exchange-rate')


describe( 'Exchange Rate Test', () => {

  test( 'Test Convert - USD', () => {

    const rates = {
      'BTC/USD': 9654,
      'ETH/USD': 498,
      'BTC/EUR': 7321,
      'EUR/USD': 0.81,
      'XXX/BTC': .0045,
      'YYY/ETH': .000000134,
      'BNB/USD': 12.54,
      'GGG/BNB': 2.1,
    }

    let result = exchangeRate.convertToUsd('BTC', 3000, rates)
    expect(result).toBe(28962000)

    result = exchangeRate.convertToUsd('EUR', 3000, rates)
    expect(result).toBe(2430)

    result = exchangeRate.convertToUsd('XXX', 3000, rates)
    expect(result).toBe(130329)

    result = exchangeRate.convertToUsd('YYY', 3000, rates)
    expect(result).toBe(0.200196)

    result = exchangeRate.convertToUsd('GGG', 3000, rates)
    expect(result).toBe(79002)
  })


  test( 'Test Convert - USDT', () => {

    const rates = {
      'BTC/USDT': 9654,
      'ETH/USDT': 498,
      'BTC/EUR': 7321,
      'EUR/USDT': 0.81,
      'XXX/BTC': .0045,
      'YYY/ETH': .000000134,
      'BNB/USDT': 12.54,
      'GGG/BNB': 2.1,
    }

    let result = exchangeRate.convertToUsd('BTC', 5771, rates)
    expect(result).toBe(55713234)

    result = exchangeRate.convertToUsd('EUR', 3000, rates)
    expect(result).toBe(2430)

    result = exchangeRate.convertToUsd('XXX', 3000, rates)
    expect(result).toBe(130329)

    result = exchangeRate.convertToUsd('YYY', 3000, rates)
    expect(result).toBe(0.200196)

    result = exchangeRate.convertToUsd('GGG', 3000, rates)
    expect(result).toBe(79002)

  })


  test( 'Test Convert - Price', () => {

    const rates = {
      'BCH/BTC': 0.09287,
      'BCH/USD': 637.44,
      'BTC/EUR': 5581.39,
      'BTC/USDT': 6654.39,
    }

    let result = exchangeRate.convertToUsd('BTC', 1, rates)
    expect(result).toBe(6654.39)
  })


})