'use strict';


module.exports = function dealBoardCards (table) {
  if (table.round === 'Preflop') {
    table.round = 'Flop';

    for (let i = 0; i < 3; i++) {
      table.board.push(table.shuffledDeck.pop());
    }
  } else {
    table.round = (table.round === 'Flop') ? 'Turn' : 'River';

    table.board.push(table.shuffledDeck.pop());
  }
};
