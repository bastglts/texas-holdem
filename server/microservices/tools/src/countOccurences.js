'use strict';

/**
 * Counts occurences of different values of a hand.
 *
 * @param {Array} values Array of values.
 *
 * @returns {Object}     Key-value object where keys are the cards values (string) and the values
 *                       are the number of occurence, the keys are increasingly sorted,
 *                       e.g. { '5': 1, '6': 1, '14': 3 } for a Three of a kind.
 */
module.exports = (values) => {
  // Looking for pair, three of a kind and four a kind
  const counts = {};

  values.forEach(c => {
    counts[c] = (counts[c] || 0) + 1;
  });

  return counts;
};
