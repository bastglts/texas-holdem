'use strict';

const suitsAndValuesToHand = require('../src/suitsAndValuesToHand');

describe('parse > suitsAndValuesToHand', () => {
  test('should find highcard on Hole cards', () => {
    const suitsAndValues = {
      suits: ['C', 'S'],
      values: [11, 10],
    };

    const out = {
      name: 'Highcard',
      value: 0,
      ordered: [11, 10],
    };

    expect(suitsAndValuesToHand(suitsAndValues)).toEqual(out);
  });

  test('should find pair on Hole cards', () => {
    const suitsAndValues = {
      suits: ['C', 'S'],
      values: [10, 10],
    };

    const out = {
      name: 'Pair',
      value: 1,
      ordered: [10, 10],
    };

    expect(suitsAndValuesToHand(suitsAndValues)).toEqual(out);
  });

  test('should find and return a Pair', () => {
    const suitsAndValues = {
      suits: ['S', 'S', 'D', 'C', 'S'],
      values: [14, 10, 10, 5, 2],
    };

    const out = {
      name: 'Pair',
      value: 1,
      ordered: [10, 10, 14, 5, 2],
    };

    expect(suitsAndValuesToHand(suitsAndValues)).toEqual(out);
  });

  test('should find and return a Highcard', () => {
    const suitsAndValues = {
      suits: ['S', 'S', 'D', 'C', 'S'],
      values: [14, 11, 10, 5, 2],
    };

    const out = {
      name: 'Highcard',
      value: 0,
      ordered: [14, 11, 10, 5, 2],
    };

    expect(suitsAndValuesToHand(suitsAndValues)).toEqual(out);
  });

  test('should find and return a Flush', () => {
    const suitsAndValues = {
      suits: ['S', 'S', 'S', 'S', 'S'],
      values: [14, 11, 10, 5, 2],
    };

    const out = {
      name: 'Flush',
      value: 5,
      ordered: [14, 11, 10, 5, 2],
    };

    expect(suitsAndValuesToHand(suitsAndValues)).toEqual(out);
  });
});
