'use strict';

const strToSuitsAndValues = require('../src/strToSuitsAndValues');

describe('parse > strToSuitsAndValues', () => {
  test('should correctly parse hand from string format to suits and values', () => {
    const handStr = 'KS TS 2H AS QS';

    const out = {
      suits: ['S', 'S', 'H', 'S', 'S'],
      values: [14, 13, 12, 10, 2],
    };

    expect(strToSuitsAndValues(handStr)).toEqual(out);
  });
});
