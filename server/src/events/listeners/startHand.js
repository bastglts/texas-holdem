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


module.exports = async (data) => {
  try {
    // Retrieve document from database
    const table = await Table.findOne({ name: data.tableName });

    // Get number of players playing this hand
    const numPlayers = table.players.length;


    /* ----------------- Set table properties ----------------- */
    // Shuffle cards
    table.shuffledDeck = shuffleArray(deck);

    // Set blinds, pot and lastBet values
    table.smallBlind = 10;
    table.bigBlind = 20;
    table.pot = table.bigBlind + table.smallBlind;
    table.lastBet = table.bigBlind;

    // Set table positions (button = small blind for a Heads Up)
    table.positions = numPlayers > 2
      ? positions.slice(0, numPlayers)
      : ['BTN', 'BB'];

    // Set betting round to pre-flop
    table.postFlop = false;


    /* ---------------- Set players properties ---------------- */
    for (let i = 0; i < numPlayers; i++) {
      // Current player
      let player = table.players[i];

      // Every player sitting at the table will automatically play the hand
      player.isPlaying = true;
      player.folded = false;

      // Deal cards to player and compute pocket hand's value and name
      player.holeCards = [table.shuffledDeck.pop(), table.shuffledDeck.pop()];
      player.hand = parseHand(player.holeCards.join(' '));

      // Set player's position
      if (!player.position) { // If new to the table
        player.position = table.positions[i];
      } else { // Else determine the new one based on the previous
        // Decrement position index
        let newPosIndex = table.positions.indexOf(player.position) - 1;

        // Handle BTN edge case
        newPosIndex = (newPosIndex < 0) ? (numPlayers - 1) : newPosIndex;

        // Set position
        player.position = table.positions[newPosIndex];
      }

      // Determine who is speaking first
      player.isSpeaking = player.position === (numPlayers > 3 ? 'UTG' : 'BTN');

      // Set blinds
      player.bet = player.position === (numPlayers > 2 ? 'SB' : 'BTN')
        ? table.smallBlind
        : player.position === 'BB'
          ? table.bigBlind
          : 0;

      // If player posts a blind
      if (player.bet) {
        // Send message
        data.io.in(table.name).emit('msg', {
          msg: `${player.username} posts $${player.bet} (${player.position})`,
        });
      }

      // Set and update count
      const user = await User.findOne({ username: player.username });

      user.count -= player.bet;
      player.count = user.count;

      await user.save();
    }


    // Save document
    const newTable = await table.save();

    // Emit socket events to update font-end accordingly
    updateHiddenTable(newTable, data.io);
  } catch (err) {
    console.log(err);
  }
};
