'use strict';

/* ------------------- Dependencies ----------------- */
const Table = require('../../models/table');
const nextTurn = require('../utils/nextTurn');

module.exports = async (data, io) => {
  try {
    // Retrieve table from database
    const table = await Table.findOne({ name: data.tableName });

    // Adjust table pot
    table.pot += data.callAmount;
    table.lastBet += data.extraAmount;

    // Loop over players to find the one who is calling
    for (const player of table.players) {
      // Find the right one
      if (player.username === data.username) {
        // Adjust player's bet and end his/her turn
        player.isSpeaking = false;
        player.lastBet = player.lastBet + data.callAmount + data.extraAmount;

        // Set lastRaiser property to true if 'call plus extra' scenario
        if (data.extraAmount > 0) {
          player.isLastRaiser = true;
        }

        // Note player's position
        table.currPlayerPos = player.position;

        // Adjust chips count
        player.count -= data.callAmount + data.extraAmount;

        // Set all-in property if needed
        player.isAllIn = player.count === 0;

        // Display message
        const msgEnd = data.callAmount === 0
          ? ' checks'
          : data.extraAmount === 0
            ? ` calls $${data.callAmount}`
            : ` raises to ${table.lastBet + data.extraAmount} (ALL IN)`;
        io.in(table.name).emit('msg', { msg: player.username + msgEnd });
      } else {
        if (data.extraAmount > 0) {
          // Erase last raiser if 'call plus extra' scenario
          player.isLastRaiser = false;
        }
      }
    }


    // Give the turn to next player or start next round
    nextTurn(table, io);
  } catch (err) {
    console.log(err);
  }
};
