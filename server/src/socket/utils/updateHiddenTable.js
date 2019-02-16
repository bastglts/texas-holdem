'use strict';

/* -------- Dependency ---------- */
const Table = require('../../models/table');

/**
 * Emit an `update_table` event and sends a table with hidden opponnent cards.
 *
 * @param {*} table Table object.
 * @param {*} io    Socket.Io instance.
 */
module.exports = (table, io) => {
  table.players.forEach(async player => {
    // Retrieve fresh document from database
    const freshTable = await Table.findOne({ name: table.name });

    // Hide every opponents cards and hand
    freshTable.players.forEach(opponent => {
      if (opponent.username !== player.username) {
        opponent.holeCards = opponent.folded ? [] : ['back', 'back'];
        opponent.hand = {};
      }
    });
    io.to(`${player.ID}`).emit('update_table', freshTable);
  });
};
