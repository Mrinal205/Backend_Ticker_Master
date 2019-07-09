'use strict'

/**
  number1: Last Price
  number2: Open Price
**/
const percentChange = (number1, number2) => {
  if (!number1 || !number2 || number1 == null || number2 == null) {
    return 0
  }

  return ((number1 - number2) / number2) * 100
}


module.exports = {
  percentChange
}