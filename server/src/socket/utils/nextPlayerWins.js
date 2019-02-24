'use strict';

const ee = require('../../node_events/EventEmitter');
const updateHiddenTable = require('./updateHiddenTable');


module.exports = async (table, io, remainingPlayers) => {
  // Get the winner's username
  const winner = remainingPlayers[0].username;

  // Send msg
  io.in(table.name).emit('msg', { msg: `${winner} wins $${table.pot}` });

  // Loop over players to find the winner in the table array
  for (const player of table.players) {
    // Find the right one
    if (player.username === winner) {
      // Update their chips count
      player.count += table.pot;

      // End the loop here (no need to loop on remaining players for nothing)
      break;
    }
  }

  // Save table
  const newTable = await table.save();

  // Start a new hand
  if (table.players.length > 1) {
    ee.emit('start_hand', { tableName: table.name, io: io });
  } else {
    // Emit events to update font-end accordingly
    updateHiddenTable(newTable, io);
  }
};
