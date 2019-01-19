'use strict';

const compare = require('../src/compare');

describe('sort > compare', () => {
  test('should compare hands with same values (A > B)', () => {
    const a = {
      value: 9,
      ordered: [14, 13, 12, 11, 10],
    }; // 'KS 9S QS TS JS';
    const b = {
      value: 9,
      ordered: [6, 5, 4, 3, 2],
    }; // '2H 3H 4H 5H 6H';

    expect(compare(a, b)).toEqual(1);
  });

  test('should compare hands with same values (A < B)', () => {
    const a = {
      value: 1,
      ordered: [14, 14, 7, 6, 4],
    }; // '6S AD 7H 4S AS';
    const b = {
      value: 1,
      ordered: [14, 14, 7, 6, 5],
    }; // 'AH AC 5H 6H 7S';

    expect(compare(a, b)).toEqual(-1);
  });

  test('should compare hands with same values (A = B)', () => {
    const a = {
      value: 0,
      ordered: [14, 6, 5, 4, 2],
    }; // '2S AH 4H 5S 6C';
    const b = {
      value: 0,
      ordered: [14, 6, 5, 4, 2],
    }; // 'AD 4C 5H 6H 2C';

    expect(compare(a, b)).toEqual(0);
  });

  test('should compare hands with different values (A < B)', () => {
    const a = {
      value: 6,
      ordered: [14, 14, 14, 2, 2],
    }; // '2S AH 2H AS AC';
    const b = {
      value: 7,
      ordered: [11, 11, 11, 11, 14],
    }; // 'JS JD JC JH AD';

    expect(compare(a, b)).toEqual(-1);
  });

  test('should compare hands with different values (A > B)', () => {
    const a = {
      value: 3,
      ordered: [14, 14, 14, 3, 2],
    };
    const b = {
      value: 2,
      ordered: [4, 4, 2, 2, 5],
    }; // 2S 2H 4H 5S 4C';

    expect(compare(a, b)).toEqual(1);
  });
});

