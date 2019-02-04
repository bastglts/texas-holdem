'use strict';

const countOccurences = require('../src/countOccurences');

describe('tools > countOccurences', () => {
  test('should count occurences', () => {
    const test = [10, 10, 2, 14, 14];
    const out = { '2': 1, '10': 2, '14': 2 };

    expect(countOccurences(test)).toEqual(out);
  });
});
