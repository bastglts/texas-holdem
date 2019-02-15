'use strict';

/* -------------------- Dependencies ---------------------- */
const updateHiddenTable = require('../../socket/utils/updateHiddenTable');
const shuffleArray = require('../../services/tools/src/shuffleArray');
const parse = require('../../services/hand/parse/src/parse');
const Table = require('../../models/table');


const deck = [
  '2H', '3H', '4H', '5H', '6H', '7H', '8H', '9H', 'TH', 'JH', 'QH', 'KH', 'AH',
  '2C', '3C', '4C', '5C', '6C', '7C', '8C', '9C', 'TC', 'JC', 'QC', 'KC', 'AC',
  '2S', '3S', '4S', '5S', '6S', '7S', '8S', '9S', 'TS', 'JS', 'QS', 'KS', 'AS',
  '2D', '3D', '4D', '5D', '6D', '7D', '8D', '9D', 'TD', 'JD', 'QD', 'KD', 'AD',
];


let shuffledDeck = shuffleArray(deck);


module.exports = async (data) => {
  try {
    // Retrieve document from database
    const table = await Table.findOne({ name: data.tableName });

    // Set state to playing
    table.playing = true;

    // Deal cards to players
    table.players.forEach(player => {
      for (let n = 0; n < 2; n++) {
        player.holeCards.push(shuffledDeck.pop());
      }

      player.folded = false;

      player.hand = parse(player.holeCards.join(' '));
    });

    // Save document
    const newTable = await table.save();

    updateHiddenTable(newTable, data.io);
  } catch (err) {
    console.log(err);
  }
};
