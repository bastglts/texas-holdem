'use strict';

/* ------------------- Dependencies ----------------- */
const Table = require('../../models/table');
const updateHiddenTable = require('../utils/updateHiddenTable');
const ee = require('../../node_events/EventEmitter');


module.exports = async (data, io) => {
  try {
    // Retrieve table from database
    const table = await Table.findOne({ name: data.tableName });

    // Variables declarations
    let nextPlayerPosition = '';
    let disguiseNextPlayer = false;

    // Loop over players to find the one who is folding
    for (const player of table.players) {
      // Find the right one
      if (player.username === data.username) {
        // If it is the Prelop round and the player folding is the `disguised last raiser`
        // (see src>events>listeners>statHand line 96) we move the disguise to the next player.
        disguiseNextPlayer =
          (table.round === 'Preflop') &&
          !table.lastRaise &&
          player.isLastRaiser;

        // Empty current player's values and set folded to true
        player.holeCards = [];
        player.hand = {};
        player.hasFolded = true;
        player.isLastRaiser = false;
        player.isSpeaking = false;
        player.lastBet = 0;

        // Get next player's position
        const currentPosIndex = table.positions.indexOf(player.position);
        nextPlayerPosition = table.positions[(currentPosIndex + 1) % table.positions.length];

        // Remove this player's position for this hand, hence this player will be skipped
        // during ulterior betting rounds
        table.positions.splice(currentPosIndex, 1);

        // Display message
        io.in(table.name).emit('msg', { msg: `${player.username} folds` });

        // End the loop here (no need to loop on remaining players for nothing)
        break;
      }
    }


    /* -------- Check if next player wins --------- */
    // Get remaining players
    const remainingPlayers = table.players.filter(player => !player.hasFolded);

    // If there is just one player left, she/he is the winner of this hand
    if (remainingPlayers.length === 1) {
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
        }
      }

      // Save table
      await table.save();

      // Start a new hand
      ee.emit('start_hand', { tableName: table.name, io: io });
    } else {
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
          }
          // Give him/her the turn
          nextPlayer.isSpeaking = true;

          // Set lastRaiser disguise if necessary
          nextPlayer.isLastRaiser = disguiseNextPlayer;

          // End the loop here (no need to loop on remaining players for nothing)
          break;
        }
      }

      if (startNextRound) {
        // Save table
        const newTable = await table.save();

        // Emit socket events to update font-end accordingly
        updateHiddenTable(newTable, io);

        // Start next round
        ee.emit('start_next_round', { tableName: table.name, io: io });
      } else {
        // Save table
        const newTable = await table.save();

        // Emit socket events to update font-end accordingly
        updateHiddenTable(newTable, io);
      }
    }
  } catch (err) {
    console.log(err);
  }
};
