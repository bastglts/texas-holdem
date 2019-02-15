'use strict';

/* ------------------- Dependencies ----------------- */
const Table = require('../../models/table');
const updateHiddenTable = require('../utils/updateHiddenTable');
const ee = require('../../events/EventEmitter');


/**
 * Add a new player to table.
 *
 * @param {*} data   Hash object containing two properties: tableName (string) and player (hash).
 * @param {*} io     Socket.io instance.
 * @param {*} socket Current socket.
 */
module.exports = async (data, io, socket) => {
  try {
    // Add socket to the table group
    socket.join(`${data.tableName}`);

    // Retrieve table from database
    const table = await Table.findOne({ name: data.tableName });

    // Add the new player
    table.players.push({
      ID: socket.id,
      username: data.player.username,
      count: data.player.count,
      holeCards: [],
      hand: {},
      folded: true,
      position: '',
      bet: 0,
      isSpeaking: false,
    });

    // Save the document
    const newTable = await table.save();

    // Emit events to update font-end accordingly
    updateHiddenTable(newTable, io);
    io.emit('update_list');
    io.in(newTable.name).emit('msg', { msg: `${data.player.username} has joined the table` });

    // Start the round
    if (newTable.players.length > 2) {
      ee.emit('play_round', { tableName: newTable.name, io: io });
    }
  } catch (err) {
    console.log(err);
  }
};
