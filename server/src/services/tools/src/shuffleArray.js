'use strict';

/**
 * Creates new array with randomly shuffled elements, using Durstenfeld shuffle algorithm.
 *
 * @param {*[]} array Array of any type.
 *
 * @returns {*[]}     New array with randomly shuffled elements.
 *
 */
module.exports = (array) => {
  const copy = array.slice(0);

  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }

  return copy;
};
