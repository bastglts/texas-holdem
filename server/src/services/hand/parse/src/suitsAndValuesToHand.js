'use strict';

const findDuplicates = require('./utils/findDuplicates');
const findFlushOrStraight = require('./utils/findFlushOrStraight');


/**
 * Converts suitsAndValues to numerical values.
 *
 * @param {Object} suitsAndValues Object containing two properties, arrays of suits and values in
 *                                decreasing order. Ex: { suits: ['S', 'S', 'S', 'S', 'S'],
 *                                values: [ 14, 13, 12, 11, 10] }.
 *
 * @returns {Object}     Object containing three properties. Its value property goes
 *                       from 0 for Highcard to 9 for Royal Flush, its name property
 *                       is the name of the hand (string). Its ordered property
 *                       is an array of ordered card values for easy comparing in case of
 *                       a tie, for example [9, 9, 5, 5, 12] for 2 pairs.
 */
module.exports = (suitsAndValues) => {
  const { suits, values } = suitsAndValues;

  // Is there at least one pair ? ...
  const duplicates = (new Set(values)).size !== values.length;

  // ... If there is, find the duplicates and assign hand.value & hand.ordered accordingly,
  // else the hand is either Highcard, Flush or Straight (no need to search for the last two
  // if just analysing the Hole cards)
  if (duplicates) {
    return findDuplicates(values);
  } else if (values.length === 5) {
    return findFlushOrStraight(values, suits);
  }

  // Defaults to Highcard
  return {
    value: 0,
    ordered: values,
    name: 'Highcard',
  };
};
