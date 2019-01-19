'use strict';

/**
 * Compares two hands.
 *
 * @param {Object} handA First hand in hash object format.
 * @param {Object} handB Second hand in hash object format.
 *
 * @returns {Number}     Returns 1 if handA ranks higher than B, -1 if lower, 0 if they tie.
 *
 */
module.exports = (handA, handB) => {
  // If the two hands have the same value, compare their cards' heights
  if (handA.value === handB.value) {
    for (let k = 0; k < 5; k++) {
      if (handA.ordered[k] > handB.ordered[k]) {
        return 1;
      } else if (handA.ordered[k] < handB.ordered[k]) {
        return -1;
      }
    }

    return 0;
  }

  return (handA.value > handB.value ? 1 : -1);
};
