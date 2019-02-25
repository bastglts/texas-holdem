'use strict';

/* ------------------- Dependencies ----------------- */
const Table = require('../../models/table');
const User = require('../../models/user');
const updateHiddenTable = require('../utils/updateHiddenTable');
const nextTurn = require('../utils/nextTurn');
const nextPlayerWins = require('../utils/nextPlayerWins');

/**
 * Remove player from the table.
 *
 * @param {*} data   Hash object containing two properties: tableName and username (strings).
 * @param {*} io     Socket.io instance.
 */
module.exports = async (data, io) => {
  try {
    // Retrieve table from database
    const table = await Table.findOne({ name: data.tableName });


    // Get the amount of chips the user is leaving the table with, its position in the current hand
    // and remove player at the same time
    let chips = 0;
    let seatToEmpty = 0;
    let playerLeavesInTurn = false;

    table.players = table.players.filter(player => {
      if (player.username !== data.username) {
        return true;
      }
      chips = player.count;
      seatToEmpty = player.seat;
      table.currPlayerPos = player.position;
      playerLeavesInTurn = player.isSpeaking;

      return false;
    });

    // Note that player is folding (to skip him in later rounds, see `nextTurn`)
    table.isCurrPlayerFolding = true;

    // Empty the leaving player's seat
    table.occupiedSeats = table.occupiedSeats.filter(seat => seat !== seatToEmpty);
    table.availSeats.push(seatToEmpty);

    // Update leaving player's account
    const player = await User.findOne({ username: data.username });
    player.count += chips;
    await player.save();

    let msgEnd = '';

    // If the leaving player leave behind an empty table, delete it
    if (!table.players.length) {
      await Table.findOneAndDelete({ name: table.name });
    } else {
      // If only one player remains at the table we empty table.round to allow a new hand to start
      // automatically when a new player joins the lonely cowboy (see './joinTable' line 55)
      if (table.players.length === 1) {
        table.round = '';
      }

      // Check if next player wins, or go next turn
      // Get remaining playing players
      const remainingPlayers = table.players.filter(player => !player.hasFolded);

      // If there is just one player left playing the hand, she/he is the winner of this hand
      if (remainingPlayers.length === 1) {
        nextPlayerWins(table, io, remainingPlayers);

        // Set end of message
        msgEnd = ` so ${remainingPlayers[0].username} wins $${table.pot}`;
      } else if (playerLeavesInTurn) {
        // Give the turn to next player or start next round
        nextTurn(table, io);
      } else {
        // Save document
        const newTable = await table.save();

        // Emit events to update font-end accordingly
        updateHiddenTable(newTable, io);
      }
    }

    // Emit events to update font-end accordingly
    io.emit('update_list');
    io.in(table.name).emit('msg', { msg: `${data.username} has left the table` + msgEnd });
  } catch (err) {
    console.log(err);
  }
};
