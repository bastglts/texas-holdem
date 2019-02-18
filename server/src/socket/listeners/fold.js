'use strict';

/* ------------------- Dependencies ----------------- */
const Table = require('../../models/table');
const User = require('../../models/user');
const updateHiddenTable = require('../utils/updateHiddenTable');
const ee = require('../../events/EventEmitter');


module.exports = async (data, io) => {
  try {
    // Retrieve table from database
    const table = await Table.findOne({ name: data.tableName });

    let nextPosition = '';

    for (let i = 0; i < table.players.length; i++) {
      // Current player
      let player = table.players[i];

      if (player.username === data.username) {
        // Empty current player's values and set folded to true
        player.holeCards = [];
        player.hand = {};
        player.folded = true;
        player.isSpeaking = false;
        player.bet = 0;

        // Get next player's position
        let nextPosIndex = table.positions.indexOf(player.position) + 1;
        nextPosition = table.positions[nextPosIndex % table.positions.length];

        // Display message
        io.in(table.name).emit('msg', { msg: `${player.username} folds` });

        // Save its current count to database
        await User.findOneAndUpdate({ username: player.username }, { count: player.count });
      }
    }

    /* -------- Give the floor to next player --------- */
    let nextPlayerBet = 0;
    let nextPlayerName = '';
    let opponentsBets = [];

    // Find the next player
    table.players.forEach(player => {
      if (player.position === nextPosition) {
        // Set his isSpeaking property to true
        player.isSpeaking = true;

        // Get his bet and name
        nextPlayerBet = player.bet;
        nextPlayerName = player.username;
      } else {
        // Get the next player's opponents bets
        opponentsBets.push(player.bet);
      }
    });

    // Check if next player wins and if so start new hand
    let nextPlayerWins = opponentsBets.every(bet => bet < nextPlayerBet);

    if (nextPlayerWins) {
      io.in(table.name).emit('msg', { msg: `${nextPlayerName} wins $${table.pot}` });

      // Save its new count to database
      const winner = await User.findOne({ username: nextPlayerName });

      winner.count += table.pot;

      await winner.save();

      // Start a new hand
      ee.emit('start_hand', { tableName: table.name, io: io });
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
