'use strict';

/**
 * Lists all k-combinations (without repetition) from an set.
 *
 * Copied from https://github.com/trekhleb/javascript-algorithms (MIT lisenced).
 *
 * @param {*[]} comboOptions Initial array.
 * @param {number} k         Number of items to select.
 *
 * @returns {*[]}            Array of the different combinations (themselves arrays of items).
 */
function combination (comboOptions, k) {
  if (k === 1) {
    return comboOptions.map(comboOption => [comboOption]);
  }

  // Init combinations array.
  const combos = [];

  // Eliminate characters one by one and concatenate them to
  // combinations of smaller lengths.
  comboOptions.forEach((currentOption, optionIndex) => {
    const smallerCombos = combination(
      comboOptions.slice(optionIndex + 1),
      k - 1,
    );

    smallerCombos.forEach((smallerCombo) => {
      combos.push([currentOption].concat(smallerCombo));
    });
  });

  return combos;
};

module.exports = combination;
