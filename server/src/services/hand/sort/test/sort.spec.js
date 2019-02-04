'use strict';

const sort = require('../src/sort');
const parse = require('../../parse/src/parse');
const shuffleArray = require('../../../tools/src/shuffleArray');

describe('sort > sort', () => {
  test('should sort correctly a random array', () => {
    const sorted = [
      'TH JH QH KH AH',
      '3C 5C 6C 4C 7C',
      '2D 4D 3D 5D 6D',
      'KC KH KD 5S KS',
      'TC TD TH 8H TS',
      'KC KH 7C KD 7S',
      '8C 9C 9S 8D 9H',
      'KC 8C 7C 2C 9C',
      '5H 6H 3H JH TH',
      '3C 5D 4H 7C 6S',
      'KH 7C 5S KD KC',
      '5H 5D 7H 2H 5C',
      'KH 5S KC 8D 8C',
      'QH 5S QC 8D 8C',
      '5S 2C AC AH 7D',
      '8S 2C QC QH 4D',
      '2H KC 7D 4H AC',
      '3C 5S 8C JH TS',
    ];

    const expected = sorted.map(str => parse(str));

    expect(sort(shuffleArray(sorted))).toEqual(expected);
  });
});
