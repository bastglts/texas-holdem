'use strict';

/* -------------------- Dependencies ---------------------- */
const updateHiddenTable = require('../../socket/utils/updateHiddenTable');
const Table = require('../../models/table');
const findFirstSpeaker = require('../utils/findFirstSpeaker');
const computeHand = require('../utils/computeHand');


module.exports = async (data) => {
  try {
    // Retrieve document from database
    const table = await Table.findOne({ name: data.tableName });

    if (table.round === 'River') {
      // TODO showdown
      console.log('showdown');
    } else {
      /* ----------------- Set table properties ----------------- */
      table.lastBet = 0;
      table.lastRaise = 0;
      table.lastLegalRaiser = '';

      let cards = '';


      if (table.round === 'Preflop') {
        table.round = 'Flop';

        for (let i = 0; i < 3; i++) {
          table.board.push(table.shuffledDeck.pop());
        }

        cards = table.board.join(', ');
      } else {
        cards = table.shuffledDeck.pop();
        table.board.push(cards);

        table.round = (table.round === 'Flop') ? 'Turn' : 'River';
      }

      data.io.in(table.name).emit('msg', {
        msg: `${table.round} is ${cards}`,
      });


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
    }

    // Save document
    const newTable = await table.save();

    // Emit socket events to update font-end accordingly
    updateHiddenTable(newTable, data.io);
  } catch (err) {
    console.log(err);
  }
};
