'use strict';

/* ------------------- Dependencies ----------------- */
const Table = require('../../models/table');
const nextTurn = require('../utils/nextTurn');
const nextPlayerWins = require('../utils/nextPlayerWins');


module.exports = async (data, io) => {
  try {
    // Retrieve table from database
    const table = await Table.findOne({ name: data.tableName });

    // Loop over players to find the one who is folding
    for (const player of table.players) {
      // Find the right one
      if (player.username === data.username) {
        // If it is the Prelop round and the player folding is the `disguised last raiser`
        // (see src>events>listeners>statHand line 96) we move the disguise to the next player.
        table.disguiseNextPlayer =
          (table.round === 'Preflop') &&
          !table.lastRaise &&
          player.isLastRaiser;

        // Empty current player's values (except position) and set folded to true
        player.holeCards = [];
        player.hand = {};
        player.hasFolded = true;
        player.isLastRaiser = false;
        player.isAllIn = false;
        player.isSpeaking = false;
        player.lastBet = 0;

        // Note player's position (to find the next player, see `nextTurn`)
        table.currPlayerPos = player.position;

        // Note that player is folding (to skip him in later rounds, see `nextTurn`)
        table.isCurrPlayerFolding = true;

        // Display message
        io.in(table.name).emit('msg', { msg: `${player.username} folds` });

        // End the loop here (no need to loop on remaining players for nothing)
        break;
      }
    }


    // Check if next player wins, or go next turn
    // Get remaining players
    const remainingPlayers = table.players.filter(player => !player.hasFolded);

    // If there is just one player left, she/he is the winner of this hand
    if (remainingPlayers.length === 1) {
      await nextPlayerWins(table, io, remainingPlayers);
    } else {
      // Give the turn to next player or start next round
      await nextTurn(table, io);
    }
  } catch (err) {
    console.log(err);
  }
};