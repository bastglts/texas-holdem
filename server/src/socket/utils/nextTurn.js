'use strict';

const updateHiddenTable = require('./updateHiddenTable');
const ee = require('../../node_events/EventEmitter');


module.exports = async function nextTurn (table, io) {
  const nextPosIndex = table.positions.indexOf(table.currPlayerPos) + 1;
  table.nextPlayerPos = table.positions[nextPosIndex % table.positions.length];

  // If curr player is folding or leaving...
  if (table.isCurrPlayerFolding || table.isCurrPlayerLeaving) {
    // ..remove their position for this hand, hence this player will be skipped
    // during ulterior betting rounds
    table.positions.splice(table.positions.indexOf(table.currPlayerPos), 1);
  }

  // Loop over players to find the next player
  for (const nextPlayer of table.players) {
    // Find the right one
    if (nextPlayer.position === table.nextPlayerPos) {
      // Check if betting round is over
      if (nextPlayer.isLastRaiser) {
        // Save table
        await table.save();

        // Emit node event to start next round
        ee.emit('start_next_round', { tableName: table.name, io: io });
      } else if (nextPlayer.isAllIn) {
        table.currPlayerPos = nextPlayer.position;

        nextTurn(table, io);
      } else {
        // Give him/her the turn
        nextPlayer.isSpeaking = true;

        // Set lastRaiser disguise if necessary
        nextPlayer.isLastRaiser = table.disguiseNextPlayer || false;

        // If next player was the last true raiser (i.e. he has raised and then faced an incomplete
        // all-in raise ('call plus extra' rule)) and action comes back to him without any legal
        // re-raise in between, he is NOT facing a raise, therefore as he cannot raise himself, he
        // can only fold or call the extra amount
        if (nextPlayer.username === table.lastLegalRaiser) {
          nextPlayer.canRaise = false;
        }

        // Save table
        const newTable = await table.save();

        // Emit socket events to update font-end accordingly
        updateHiddenTable(newTable, io);
      }

      // End the loop here (no need to loop on remaining players for nothing)
      break;
    }
  }
};
