'use strict';

/* ------------------- Dependencies ----------------- */
const Table = require('../../models/table');
const updateHiddenTable = require('../utils/updateHiddenTable');


/**
 * Remove player from the table.
 *
 * @param {*} data   Hash object containing two properties: tableName and username (strings).
 * @param {*} io     Socket.io instance.
 */
module.exports = async (data, io) => {
  // Retrieve table from database
  const table = await Table.findOne({ name: data.tableName });

  // Remove player
  table.players = table.players.filter(player => player.username !== data.username);

  // Save document
  const newTable = await table.save();

  // Emit events to update font-end accordingly
  updateHiddenTable(newTable, io);
  io.emit('update_list');
  io.in(newTable.name).emit('msg', { msg: `${data.username} has left the table` });
};
