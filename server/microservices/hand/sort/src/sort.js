'use strict';

const parse = require('../../parse/src/parse');
const compare = require('./compare');

/**
 * Sorts an array of hands in string format.
 *
 * @param {string[]} handsArr Array of hands in string format.
 *
 * @returns {object[]}        Sorted array of hand hash objects, highest ranked hand first.
 *
 */
module.exports = (handsArr) => {
  // Convert each hand of the array into hand objects
  const hands = handsArr.map(handStr => parse(handStr));

  // Sort the array with compare function
  return hands.sort(compare).reverse();
};
