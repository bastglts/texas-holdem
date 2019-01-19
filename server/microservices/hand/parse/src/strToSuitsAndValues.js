'use strict';

/**
 * Extract suits and values from handStr.
 *
 * @param {String} handStr Hand in string format, e.g. "KS AS TS QS JS".
 *
 * @returns {Object}       Object containing two properties: arrays of suits and values in
 *                         decreasing order. Ex: { suits: [ 'S', 'S', 'S', 'S', 'S' ],
 *                         values: [ 14, 13, 12, 11, 10 ] }.
 */
module.exports = (handStr) => {
  // Table used to convert card values from ten to ace
  const cardValue = { 'T': 10, 'J': 11, 'Q': 12, 'K': 13, 'A': 14 };

  // Output object
  const suitsAndValues = {
    suits: [],
    values: [],
  };

  // First, extract single cards from handStr
  // Then for each card, extract suit and value (converted to a number)
  handStr.split(' ')
    .forEach(card => {
      const cardArr = card.split('');
      suitsAndValues.values.push(cardValue[cardArr[0]] || +cardArr[0]);
      suitsAndValues.suits.push(cardArr[1]);
    });

  // Sort values in decreasing order
  suitsAndValues.values.sort((a, b) => b - a);

  return suitsAndValues;
};
