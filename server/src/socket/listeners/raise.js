'use strict';

/* ------------------- Dependencies ----------------- */
const Table = require('../../models/table');
const nextTurn = require('../utils/nextTurn');

module.exports = async (data, io) => {
  try {
    // Retrieve table from database
    const table = await Table.findOne({ name: data.tableName });

    // Adjust table values
    table.pot += data.raise.amount;
    table.lastRaise = data.raise.to - table.lastBet;
    table.lastBet = data.raise.to;
    table.lastLegalRaiser = data.username;

    // Loop over players to find the one who is raising
    for (const player of table.players) {
      // Find the right one
      if (player.username === data.username) {
        // Adjust player's bet and end his/her turn
        player.isSpeaking = false;
        player.lastBet = data.raise.to;

        // Set player as last raisr
        player.isLastRaiser = true;

        // Note player's position
        table.currPlayerPos = player.position;

        // Adjust chips count
        player.count -= data.raise.amount;

        // Set all-in property if needed
        player.isAllIn = player.count === 0;

        // Display message
        const allInMsg = player.isAllIn ? 'ALL IN' : '';

        io.in(table.name).emit('msg', {
          msg: `${player.username} raises ` + allInMsg + ` to $${data.raise.to}`,
        });
      } else {
        // Erase last raiser
        player.isLastRaiser = false;

        // If a player was the last true raiser before the current one, i.e. she/he has raised
        // and then faced an incomplete all-in raise ('call plus extra' rule) and the current
        // player is legally re-raising before he/she speaks again, he/she will
        // be able to re-raise again so we must now authorize him/her to do so
        if (!player.canRaise) {
          player.canRaise = true;
        }
      }
    }


    // Give the turn to next player or start next round
    nextTurn(table, io);
  } catch (err) {
    console.log(err);
  }
};
