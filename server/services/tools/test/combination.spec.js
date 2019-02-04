'use strict';

const combination = require('../src/combination');

describe('tools > combination', () => {
  test('should list all k-combinaisons from a set of length n', () => {
    expect(combination(['A', 'B'], 3)).toEqual([]);

    expect(combination(['A', 'B'], 1)).toEqual([
      ['A'],
      ['B'],
    ]);

    expect(combination(['A'], 1)).toEqual([
      ['A'],
    ]);

    expect(combination(['A', 'B'], 2)).toEqual([
      ['A', 'B'],
    ]);

    expect(combination(['A', 'B', 'C'], 2)).toEqual([
      ['A', 'B'],
      ['A', 'C'],
      ['B', 'C'],
    ]);

    expect(combination(['A', 'B', 'C'], 3)).toEqual([
      ['A', 'B', 'C'],
    ]);

    expect(combination(['A', 'B', 'C', 'D'], 3)).toEqual([
      ['A', 'B', 'C'],
      ['A', 'B', 'D'],
      ['A', 'C', 'D'],
      ['B', 'C', 'D'],
    ]);

    expect(combination(['A', 'B', 'C', 'D', 'E', 'F', 'G'], 5).length).toEqual(21);
  });
});
