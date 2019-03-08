'use strict';

/* -------------------- Dependencies ---------------------- */
const dealBoardCards = require('./dealBoardCards');
const showdown = require('./showdown');
const computeHand = require('./computeHand');


module.exports = async function goToShowdown (table, io) {
  // Reveal players's cards and/or board cards
  io.in(table.name).emit('update_table', table);

  // If we arrive to the showdown, determine winner(s), split pot etc...
  if (table.round === 'River') {
    showdown(table, io);
  } else {
    // Deal board cards and increment round
    dealBoardCards(table);

    // Determine hands of the players
    for (const player of table.players) {
      if (!player.hasFolded) {
        player.hand = computeHand(table.board.concat(player.holeCards));
      }
    }

    // Save document
    await table.save();

    // Wait 2sec before dealing next card
    setTimeout(() => {
      // Anounce dealt board card (we don't update table now but at the start of next step)
      io.in(table.name).emit('msg', {
        msg: `${table.round}: ${table.board.join(', ')}`,
      });

      goToShowdown(table, io);
    }, 2000);
  }
};
