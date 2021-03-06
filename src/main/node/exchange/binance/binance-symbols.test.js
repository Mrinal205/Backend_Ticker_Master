'use strict'


const binanceSymbols = require('./binance-symbols')

const expectedMinSymbols = [
 'ethbtc', 'ltcbtc', 'bnbbtc', 'neobtc', 'gasbtc',
 'qtumeth', 'eoseth', 'snteth', 'bnteth', 'bnbeth', 'btcusdt', 'ethusdt',
 'hsrbtc', 'oaxeth', 'dnteth', 'mcoeth', 'icneth', 'mcobtc', 'wtcbtc', 'wtceth', 'lrcbtc', 'lrceth', 'qtumbtc', 'yoyowbtc', 'omgbtc',
 'omgeth', 'zrxbtc', 'zrxeth', 'stratbtc', 'strateth', 'snglsbtc', 'snglseth', 'bqxbtc', 'bqxeth', 'kncbtc', 'knceth', 'funbtc', 'funeth',
 'snmbtc', 'snmeth', 'neoeth', 'iotabtc', 'iotaeth', 'linkbtc', 'linketh', 'xvgbtc', 'xvgeth', 'saltbtc', 'salteth', 'mdabtc',
 'mdaeth', 'mtlbtc', 'mtleth', 'subbtc', 'subeth', 'eosbtc', 'sntbtc', 'etceth', 'etcbtc', 'mthbtc', 'mtheth', 'engbtc', 'engeth', 'dntbtc', 'zecbtc',
 'zeceth', 'bntbtc', 'astbtc', 'asteth', 'dashbtc', 'dasheth', 'oaxbtc', 'icnbtc', 'btgbtc', 'btgeth', 'evxbtc', 'evxeth', 'reqbtc', 'reqeth',
 'vibbtc', 'vibeth', 'hsreth', 'trxbtc', 'trxeth', 'powrbtc', 'powreth', 'arkbtc', 'arketh', 'yoyoweth', 'xrpbtc', 'xrpeth', 'modbtc', 'modeth',
 'enjbtc', 'enjeth', 'storjbtc', 'storjeth', 'bnbusdt', 'venbnb', 'yoyowbnb', 'powrbnb', 'venbtc', 'veneth', 'kmdbtc', 'kmdeth', 'nulsbnb', 'rcnbtc',
 'rcneth', 'rcnbnb', 'nulsbtc', 'nulseth', 'rdnbtc', 'rdneth', 'rdnbnb', 'xmrbtc', 'xmreth', 'dltbnb', 'wtcbnb', 'dltbtc', 'dlteth', 'ambbtc', 'ambeth',
 'ambbnb', 'batbtc', 'bateth', 'batbnb', 'bcptbtc', 'bcpteth', 'bcptbnb', 'arnbtc', 'arneth', 'gvtbtc', 'gvteth',
 'cdtbtc', 'cdteth', 'gxsbtc', 'gxseth', 'neousdt', 'neobnb', 'poebtc', 'poeeth', 'qspbtc', 'qspeth', 'qspbnb', 'btsbtc', 'btseth', 'btsbnb',
 'xzcbtc', 'xzceth',
 'xzcbnb', 'lskbtc', 'lsketh', 'lskbnb', 'tntbtc', 'tnteth', 'fuelbtc', 'fueleth', 'manabtc', 'manaeth', 'bcdbtc', 'bcdeth', 'dgdbtc', 'dgdeth', 'iotabnb',
 'adxbtc', 'adxeth', 'adxbnb', 'adabtc', 'adaeth', 'pptbtc', 'ppteth', 'cmtbtc', 'cmteth', 'cmtbnb', 'xlmbtc', 'xlmeth', 'xlmbnb', 'cndbtc', 'cndeth',
 'cndbnb', 'lendbtc', 'lendeth', 'wabibtc', 'wabieth', 'wabibnb', 'ltceth', 'ltcusdt', 'ltcbnb', 'tnbbtc', 'tnbeth', 'wavesbtc', 'waveseth', 'wavesbnb',
 'gtobtc', 'gtoeth', 'gtobnb', 'icxbtc', 'icxeth', 'icxbnb', 'ostbtc', 'osteth', 'ostbnb', 'elfbtc', 'elfeth', 'aionbtc', 'aioneth', 'aionbnb', 'neblbtc',
 'nebleth', 'neblbnb', 'brdbtc', 'brdeth', 'brdbnb', 'mcobnb', 'edobtc', 'edoeth', 'wingsbtc', 'wingseth', 'navbtc', 'naveth', 'navbnb', 'lunbtc', 'luneth',
 'trigbtc', 'trigeth', 'trigbnb', 'appcbtc', 'appceth', 'appcbnb', 'vibebtc', 'vibeeth', 'rlcbtc', 'rlceth', 'rlcbnb', 'insbtc', 'inseth', 'pivxbtc', 'pivxeth',
 'pivxbnb', 'iostbtc', 'iosteth', 'chatbtc', 'chateth', 'steembtc', 'steemeth', 'steembnb', 'viabtc', 'viaeth', 'viabnb', 'blzbtc',
 'blzeth', 'blzbnb', 'aebtc', 'aeeth', 'aebnb', 'rpxbtc', 'rpxeth', 'rpxbnb', 'ncashbtc', 'ncasheth', 'ncashbnb', 'ontusdt', 'databtc', 'dataeth',
 'enjbnb', 'nxsbnb', 'nxsbtc', 'nxseth', 'agibnb', 'agibtc', 'agieth', 'qkcbtc', 'qkceth', 'iotxbtc', 'iotxeth', 'thetabnb', 'thetabtc', 'thetaeth',
 'cvcbnb', 'cvcbtc', 'cvceth', 'skybnb', 'skybtc', 'skyeth', 'zenbnb', 'zenbtc', 'zeneth', 'tusdusdt', 'tusdbtc', 'tusdeth', 'tusdbnb'
]

describe('Binance Symbols Test', () => {
//
//  test('Test Fetch', done => {
//
//    binanceSymbols.fetch()
//      .then(result => {
//
//        expectedMinSymbols.forEach((val) => {
//
//          const index = result.indexOf(val)
//          if (index < 0) {
//            console.error('Failed to find ' + val)
//          }
//
//          expect(index).not.toBeLessThan(0)
//        })
//
//        done()
//
//      })
//
//  }, 30000)


  test('Test Fetch async', async done => {

    const result = await binanceSymbols.fetch()
    console.log("Result", result)
    expectedMinSymbols.forEach((val) => {

      const index = result.indexOf(val)
      if (index < 0) {
        console.error('Failed to find ' + val)
      }

      expect(index).not.toBeLessThan(0)
    })

    done()

  }, 30000)

})