'use strict';

const findFlushOrStraight = require('../../src/utils/findFlushOrStraight');

describe('parse > utils > findFlushOrStraight', () => {
  test('should find a Flush', () => {
    const suits = Array(5).fill('H');
    const values = [7, 5, 4, 3, 2];

    const out = {
      value: 5,
      ordered: values,
    };

    expect(findFlushOrStraight(values, suits)).toEqual(out);
  });

  test('should find a Straight Flush', () => {
    const suits = Array(5).fill('H');
    const values = [6, 5, 4, 3, 2];

    const out = {
      value: 8,
      ordered: values,
    };

    expect(findFlushOrStraight(values, suits)).toEqual(out);
  });

  test('should find a Straight', () => {
    const suits = [...Array(4).fill('H'), 'S'];
    const values = [6, 5, 4, 3, 2];

    const out = {
      value: 4,
      ordered: values,
    };

    expect(findFlushOrStraight(values, suits)).toEqual(out);
  });

  test('should find a Royal Flush', () => {
    const suits = Array(5).fill('H');
    const values = [14, 13, 12, 11, 10];

    const out = {
      value: 9,
      ordered: values,
    };

    expect(findFlushOrStraight(values, suits)).toEqual(out);
  });

  test('should find a Highcard', () => {
    const suits = [...Array(4).fill('H'), 'S'];
    const values = [14, 10, 4, 3, 2];

    const out = {
      value: 0,
      ordered: values,
    };

    expect(findFlushOrStraight(values, suits)).toEqual(out);
  });
});
