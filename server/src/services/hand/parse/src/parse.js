'use strict';

const R = require('ramda');

const strToSuitsAndValues = require('./strToSuitsAndValues');
const suitsAndValuesToHand = require('./suitsAndValuesToHand');


/**
 * Converts handStr to a Hand object.
 *
 * @param {String} handStr Hand in string format, e.g. "KS AS TS QS JS".
 *
 * @returns {Object}     Object containing three properties. Its value property goes
 *                       from 0 for Highcard to 9 for Royal Flush, its name property
 *                       is the name of the hand (string). Its ordered property
 *                       is an array of ordered card values for easy comparing in case of
 *                       a tie, for example [9, 9, 5, 5, 12] for 2 pairs.
 */
module.exports = R.compose(suitsAndValuesToHand, strToSuitsAndValues);
