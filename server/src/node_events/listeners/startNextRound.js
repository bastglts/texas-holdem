'use strict';

/* -------------------- Dependencies ---------------------- */
const updateHiddenTable = require('../../socket/utils/updateHiddenTable');
const Table = require('../../models/table');
const findFirstSpeaker = require('../utils/findFirstSpeaker');
const computeHand = require('../utils/computeHand');
const dealBoardCards = require('../utils/dealBoardCards');
const showdown = require('../utils/showdown');
const goToShowdown = require('../utils/goToShowdown');
const handleSidePots = require('../utils/handleSidePots');


module.exports = async (data) => {
  try {
    // Retrieve document from database
    const table = await Table.findOne({ name: data.tableName });

    // Remaining players in the hand
    const remainingPlayers = table.players.filter(plyr => !plyr.hasFolded);

    // All all-in players in the hand
    const allInPlayers = remainingPlayers.filter(plyr => plyr.isAllIn);


    /* -------------- Handle side pots if necessary -------------- */
    if (allInPlayers.length) {
      handleSidePots(table, allInPlayers, remainingPlayers);
    }


    // If we arrive to the showdown, determine winner(s), split pot etc...
    if (table.round === 'River') {
      // Reveal players' cards
      data.io.in(table.name).emit('update_table', table);

      showdown(table, data.io);
    } else { // For flop, turn or river
      const fastForward = (remainingPlayers.length - allInPlayers.length) < 2;

      // If all or all except one remainings players are all-in, action is over and
      // we fast-forward through the rounds to the showdown using recursion
      if (fastForward) {
        goToShowdown(table, data.io);
      } else { // Play next round normally
        /* ----------------- Set table properties ----------------- */
        // Reset values
        table.lastBet = 0;
        table.lastRaise = 0;
        table.lastLegalRaiser = '';

        // Deal cards and increment round
        dealBoardCards(table);


        /* ---------------- Set players properties ---------------- */
        // Post-flop the first player to speak is the one closest to the left to the button that
        // has not folded or is not all-in
        const firstSpeaker = findFirstSpeaker(table, 0);

        // Loop over players
        for (const player of table.players) {
          if (!player.hasFolded) {
            // Determine who is speaking first
            player.isSpeaking = player.username === firstSpeaker;

            // Postflop, if all players fold or call the first speaker, the round ends, so we
            // disguise him as the last raiser
            player.isLastRaiser = player.isSpeaking;

            // Determine hand of the player
            player.hand = computeHand(table.board.concat(player.holeCards));

            // Empty bets for players who are not all in, as it is a new betting round
            player.lastBet = 0;
          }
        }

        // Anounce dealt board card
        data.io.in(table.name).emit('msg', {
          msg: `${table.round}: ${table.board.join(', ')}`,
        });

        // Save document
        const newTable = await table.save();

        // Emit socket events to update font-end accordingly
        updateHiddenTable(newTable, data.io);
      }
    }
  } catch (err) {
    console.log(err);
  }
};
