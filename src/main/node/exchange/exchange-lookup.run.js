'use strict'

const exchangeLookup = require('./exchange-lookup')


async function run() {

  try {
    await exchangeLookup['binance'].load_markets()
    console.log('Result', exchangeLookup['binance'].markets)
  }
  catch(error) {
    console.log('Error:', error)
  }

}

run()