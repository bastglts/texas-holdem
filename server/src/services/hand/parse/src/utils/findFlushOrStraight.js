'use strict';

/**
 * Determines if the hand is a Flush, a Straight, a Straight Flush or simply a Highcard.
 *
 * @param {Array} values Values of the hand in decreasing order, e.g. [14, 13, 12, 11, 10].
 * @param {Array} suits  Array of suits, e.g. ['S', 'D', 'C', 'S', 'S'].
 *
 * @returns {Object}     Object containing three properties. Its value property goes
 *                       from 0 for Highcard to 9 for Royal Flush, its name property
 *                       is the name of the hand (string). Its ordered property
 *                       is an array of ordered card values for easy comparing in case of
 *                       a tie, for example [9, 9, 5, 5, 12] for 2 pairs.
 */
module.exports = (values, suits) => {
  const flush = (new Set(suits)).size === 1;

  const lowAceStraight = (values[0] === 14) && (values[1] === 5);
  const straight = values.every((e, i, src) => e === (src[i - 1] || e + 1) - 1) || lowAceStraight;
  const royal = values[4] === 10;

  return {
    ordered: values,
    value: flush
      ? straight
        ? royal
          ? 9
          : 8
        : 5
      : straight
        ? 4
        : 0,
    name: flush
      ? straight
        ? royal
          ? 'Royal flush'
          : 'Straight flush'
        : 'Flush'
      : straight
        ? 'Straight'
        : 'Highcard',
  };
};
