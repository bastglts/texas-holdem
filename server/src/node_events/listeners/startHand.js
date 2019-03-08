'use strict';

/* -------------------- Dependencies ---------------------- */
const updateHiddenTable = require('../../socket/utils/updateHiddenTable');
const shuffleArray = require('../../services/tools/src/shuffleArray');
const parseHand = require('../../services/hand/parse/src/parse');
const Table = require('../../models/table');
const turnButton = require('../utils/turnButton');

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
    table.sidePots = [];
    table.bestCards = [];
    table.lastBet = table.bigBlind;
    table.lastRaise = 0;
    table.lastLegalRaiser = '';

    // Set betting round to pre-flop
    table.round = 'Preflop';

    // Empty board
    table.board = [];

    // Set table positions (button = small blind for a Heads Up)
    table.positions = numPlayers > 2
      ? positions.slice(0, numPlayers)
      : ['BTN', 'BB'];

    // Turn button position and associate seats to positions
    let ordSeats = [];
    const seatsToPositions = {};

    if (table.isNewOne) {
      table.buttonSeat = table.occupiedSeats[0];
      ordSeats = table.occupiedSeats;
    } else {
      table.buttonSeat = turnButton(table.buttonSeat, table.occupiedSeats);

      const idxOfButtonSeat = table.occupiedSeats.indexOf(table.buttonSeat);

      ordSeats = [
        ...table.occupiedSeats.slice(idxOfButtonSeat),
        ...table.occupiedSeats.slice(0, idxOfButtonSeat),
      ];
    }

    for (let i = 0; i < numPlayers; i++) {
      seatsToPositions[ordSeats[i]] = table.positions[i];
    }


    /* ---------------- Set players properties ---------------- */
    for (const player of table.players) {
      // Every player sitting at the table will automatically play the hand
      player.hasFolded = false;
      player.isAllIn = false;
      player.canRaise = true;

      // Deal cards to player and compute pocket hand's value and name
      player.holeCards = [table.shuffledDeck.pop(), table.shuffledDeck.pop()];
      player.hand = parseHand(player.holeCards.join(' '));

      // Set player's position
      player.position = seatsToPositions[player.seat];

      // Determine who is speaking first
      player.isSpeaking = player.position === (numPlayers > 3 ? 'UTG' : 'BTN');

      // Set blinds
      player.lastBet = player.position === (numPlayers > 2 ? 'SB' : 'BTN')
        ? table.smallBlind
        : player.position === 'BB'
          ? table.bigBlind
          : 0;

      // If player posts a blind
      if (player.lastBet) {
        // Send message
        data.io.in(table.name).emit('msg', {
          msg: `${player.username} posts $${player.lastBet} (${player.position})`,
        });
      }

      // Preflop, if all players fold or call the BB, the player in the BB can check or bet.
      // So we disguise the player to its left as the last raiser, in order to end the round
      // easily if we are in this situation (see src>socket>listeners>call line 54).
      player.isLastRaiser =
        player.position === table.positions[(table.positions.indexOf('BB') + 1) % numPlayers];

      // Adjust chips count
      player.count -= player.lastBet;
    }

    // If table is new, it won't be anymore
    if (table.isNewOne) {
      table.isNewOne = false;
    }

    // Save document
    const newTable = await table.save();

    // Emit socket events to update font-end accordingly
    updateHiddenTable(newTable, data.io);
  } catch (err) {
    console.log(err);
  }
};
