'use strict';

/* -------- Dependency ---------- */
const Table = require('../../models/table');


/**
 * Emit an `update_table` event and sends a table with hidden opponnent cards.
 *
 * @param {*} table Table object.
 * @param {*} io    Socket.Io instance.
 */
module.exports = async (table, io) => {
  for (let i = 0; i < table.players.length; i++) {
    // Current player
    let player = table.players[i];

    // Retrieve fresh document from database
    const freshTable = await Table.findOne({ name: table.name });

    // Hide deck of cards
    freshTable.shuffledDeck = [];

    // Hide every opponents cards and hand
    freshTable.players.forEach(opponent => {
      if (opponent.username !== player.username) {
        opponent.holeCards = opponent.folded ? [] : ['back', 'back'];
        opponent.hand = {};
      }
    });

    io.to(`${player.ID}`).emit('update_table', freshTable);
  }
};
