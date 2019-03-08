'use strict';

const strToHand = require('../src/parse');

describe('parse > strToHand', () => {
  test('should parse the string, find and return a hand', () => {
    const handStr = '2H 2S 4C 8D 5S';

    const out = {
      name: 'Pair',
      value: 1,
      ordered: [2, 2, 8, 5, 4],
      handStr: handStr,
    };

    expect(strToHand(handStr)).toEqual(out);
  });
});
