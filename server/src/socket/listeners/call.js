'use strict';

/* ------------------- Dependencies ----------------- */
const Table = require('../../models/table');
const updateHiddenTable = require('../utils/updateHiddenTable');
const ee = require('../../node_events/EventEmitter');

module.exports = async (data, io) => {
  try {
    // Retrieve table from database
    const table = await Table.findOne({ name: data.tableName });

    let nextPlayerPosition = '';

    // Adjust table pot
    table.pot += data.callAmount;

    // Loop over players to find the one who is calling
    for (const player of table.players) {
      // Find the right one
      if (player.username === data.username) {
        // Adjust player's bet and end his/her turn
        player.isSpeaking = false;
        player.lastBet = player.lastBet + data.callAmount;

        // Get next player's position
        const nextPosIndex = table.positions.indexOf(player.position) + 1;
        nextPlayerPosition = table.positions[nextPosIndex % table.positions.length];

        // Display message
        io.in(table.name).emit('msg', { msg: `${player.username} calls $${data.callAmount}` });

        // Adjust chips count
        player.count -= data.callAmount;

        // End the loop here (no need to loop on remaining players for nothing)
        break;
      }
    }


    /* -------- Give the turn to next player --------- */
    let startNextRound = false;

    // Loop over players to find the next player
    for (const nextPlayer of table.players) {
      // Find the right one
      if (nextPlayer.position === nextPlayerPosition) {
        // Check if betting round is over
        if (nextPlayer.isLastRaiser) {
          startNextRound = true;

          // End the loop here
          break;
        } else {
          // Give him/her the turn
          nextPlayer.isSpeaking = true;
        }

        // End the loop here (no need to loop on remaining players for nothing)
        break;
      }
    }

    if (startNextRound) {
      ee.emit('start_next_round', { tableName: table.name, io: io });

      // Save table
      const newTable = await table.save();

      // Emit socket events to update font-end accordingly
      updateHiddenTable(newTable, io);
    } else {
      // Save table
      const newTable = await table.save();

      // Emit socket events to update font-end accordingly
      updateHiddenTable(newTable, io);
    }
  } catch (err) {
    console.log(err);
  }
};
