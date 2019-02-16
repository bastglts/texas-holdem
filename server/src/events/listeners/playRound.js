'use strict';

/* -------------------- Dependencies ---------------------- */
const updateHiddenTable = require('../../socket/utils/updateHiddenTable');
const shuffleArray = require('../../services/tools/src/shuffleArray');
const parseHand = require('../../services/hand/parse/src/parse');
const Table = require('../../models/table');
const User = require('../../models/user');


const deck = [
  '2H', '3H', '4H', '5H', '6H', '7H', '8H', '9H', 'TH', 'JH', 'QH', 'KH', 'AH',
  '2C', '3C', '4C', '5C', '6C', '7C', '8C', '9C', 'TC', 'JC', 'QC', 'KC', 'AC',
  '2S', '3S', '4S', '5S', '6S', '7S', '8S', '9S', 'TS', 'JS', 'QS', 'KS', 'AS',
  '2D', '3D', '4D', '5D', '6D', '7D', '8D', '9D', 'TD', 'JD', 'QD', 'KD', 'AD',
];

const positions = ['BTN', 'SB', 'BB', 'UTG', 'MP', 'CO'];


let shuffledDeck = shuffleArray(deck);


module.exports = async (data) => {
  try {
    // Retrieve document from database
    const table = await Table.findOne({ name: data.tableName });

    // Set table state to playing
    table.playing = true;

    // Deal cards to players
    table.players.forEach(async (player, idx) => {
      for (let n = 0; n < 2; n++) {
        player.holeCards.push(shuffledDeck.pop());
      }

      player.position = positions[idx];
      player.isSpeaking = idx === 0;
      player.folded = false;
      player.hand = parseHand(player.holeCards.join(' '));

      // Place blinds
      player.bet = player.position === 'SB'
        ? 10
        : player.position === 'BB'
          ? 20
          : 0;

      if (player.bet) {
        player.count = player.count - player.bet;

        await User.findOneAndUpdate({ username: player.username }, { count: player.count });
      }
    });

    // Save document
    const newTable = await table.save();

    // Emit socket events to update font-end accordingly
    updateHiddenTable(newTable, data.io);
  } catch (err) {
    console.log(err);
  }
};
