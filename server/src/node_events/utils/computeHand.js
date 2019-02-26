'use strict';

const combination = require('../../services/tools/src/combination');
const sortHands = require('../../services/hand/sort/src/sort');


module.exports = (cards) => {
  // Create array of all possibles hands (each in string format e.g '5C 4D TH 8D 9S')
  const combinations = combination(cards, 5).map(hand => hand.join(' '));

  // Sort them to find the best one
  return sortHands(combinations)[0];
};
