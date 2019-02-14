'use strict';

const findDuplicates = require('../../src/utils/findDuplicates');

describe('parse > utils > findDuplicates', () => {
  test('should find One Pair', () => {
    const test = [14, 11, 10, 10, 3];
    const out = {
      name: 'Pair',
      value: 1,
      ordered: [10, 10, 14, 11, 3],
    };

    expect(findDuplicates(test)).toEqual(out);
  });

  test('should find Two Pair', () => {
    const test = [14, 11, 11, 10, 10];
    const out = {
      name: 'Two pair',
      value: 2,
      ordered: [11, 11, 10, 10, 14],
    };

    expect(findDuplicates(test)).toEqual(out);
  });

  test('should find Three of a kind', () => {
    const test = [14, 10, 10, 10, 3];
    const out = {
      name: 'Three of a kind',
      value: 3,
      ordered: [10, 10, 10, 14, 3],
    };

    expect(findDuplicates(test)).toEqual(out);
  });

  test('should find Four of a kind', () => {
    const test = [14, 10, 10, 10, 10];
    const out = {
      name: 'Four of a kind',
      value: 7,
      ordered: [10, 10, 10, 10, 14],
    };

    expect(findDuplicates(test)).toEqual(out);
  });

  test('should find Full House', () => {
    const test = [14, 14, 10, 10, 10];
    const out = {
      name: 'Full house',
      value: 6,
      ordered: [10, 10, 10, 14, 14],
    };

    expect(findDuplicates(test)).toEqual(out);
  });
});
