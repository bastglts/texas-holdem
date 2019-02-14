'use strict';

const countOccurences = require('../../../../tools/src/countOccurences');


/**
 * Determines if the hand is a Pair, Two Pair, Three of a kind, Four of a kind or Full House.
 *
 * @param {Array} values Values of the hand in decreasing order, e.g. [14, 12, 12, 11, 10],
 *                       containing at least one pair.
 *
 * @returns {Object}     Object containing three properties. Its value property goes
 *                       from 0 for Highcard to 9 for Royal Flush, its name property
 *                       is the name of the hand (string). Its ordered property
 *                       is an array of ordered card values for easy comparing in case of
 *                       a tie, for example [9, 9, 5, 5, 12] for 2 pairs.
 */
module.exports = (values) => {
  const hand = {};

  let fOAK = [],
    tOAK = [],
    pairs = [],
    uniques = [],
    fullHouse = 0;

  const counts = countOccurences(values);

  Object.entries(counts).reverse().forEach(([card, count]) => {
    switch (count) {
      case 4:
        fOAK = Array(4).fill(+card);
        hand.value = 7;
        hand.name = 'Four of a kind';
        break;
      case 3:
        tOAK = Array(3).fill(+card);
        hand.value = 3;
        hand.name = 'Three of a kind';
        ++fullHouse;
        break;
      case 2:
        pairs = [...pairs, +card, +card];
        if (pairs.length === 4) {
          hand.value = 2;
          hand.name = 'Two pair';
        } else {
          hand.value = 1;
          ++fullHouse;
          hand.name = 'Pair';
        }
        break;
      default:
        uniques = [...uniques, +card];
        break;
    }
  });

  hand.ordered = [...fOAK, ...tOAK, ...pairs, ...uniques];

  // If it's not FOAK or TP, must look for FH
  if (fullHouse === 2) {
    hand.value = 6;
    hand.name = 'Full house';
  }

  return hand;
};
