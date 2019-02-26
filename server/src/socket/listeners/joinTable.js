'use strict';

/* ------------------- Dependencies ----------------- */
const Table = require('../../models/table');
const User = require('../../models/user');
const updateHiddenTable = require('../utils/updateHiddenTable');
const ee = require('../../node_events/EventEmitter');


/**
 * Add a new player to table.
 *
 * @param {*} data   Hash object containing three properties: `tableName` (string), player's `chips`
 *                   (number) and `username` (string).
 * @param {*} io     Socket.io instance.
 * @param {*} socket Current socket.
 */
module.exports = async (data, io, socket) => {
  try {
    // Add socket to the table group
    socket.join(`${data.tableName}`);

    // Retrieve table from database
    const table = await Table.findOne({ name: data.tableName });

    // Pick a random seat for the player to sit in
    const seat = table.availSeats.splice(Math.floor(Math.random() * table.availSeats.length), 1);
    table.occupiedSeats.push(seat[0]);
    table.occupiedSeats.sort((a, b) => a - b);

    // Update the account of the player joining the table according to the amount of chips
    // he is playing.
    const player = await User.findOne({ username: data.username });
    player.count -= data.chips;
    await player.save();

    // Add the new player
    table.players.push({
      ID: socket.id,
      username: data.username,
      count: data.chips,
      holeCards: [],
      hand: {},
      hasFolded: true,
      position: '',
      lastBet: 0,
      isSpeaking: false,
      isPlaying: false,
      isAllIn: false,
      seat: seat[0],
      canRaise: true,
    });

    // Save the document
    const newTable = await table.save();

    // Emit events to update font-end accordingly
    updateHiddenTable(newTable, io);
    io.emit('update_list');
    io.in(newTable.name).emit('msg', { msg: `${data.username} has joined the table` });

    // If there was only one player sitting a table before, we wait a few seconds for other
    // players to join in, and then start the hand.
    if (newTable.players.length === 2 && !newTable.round) {
      setTimeout(() => ee.emit('start_hand', { tableName: newTable.name, io: io }), 8000);
    }
  } catch (err) {
    console.log(err);
  }
};
