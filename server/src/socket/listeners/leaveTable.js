'use strict';

/* ------------------- Dependencies ----------------- */
const Table = require('../../models/table');
const User = require('../../models/user');
const updateHiddenTable = require('../utils/updateHiddenTable');


/**
 * Remove player from the table.
 *
 * @param {*} data   Hash object containing two properties: tableName and username (strings).
 * @param {*} io     Socket.io instance.
 */
module.exports = async (data, io) => {
  try {
    // Retrieve table from database
    const table = await Table.findOne({ name: data.tableName });


    // Get the amount of chips the user is leaving the table with, its position in the current hand
    // and remove player at the same time
    let chips = 0;
    let position = '';

    table.players = table.players.filter(player => {
      if (player.username !== data.username) {
        return true;
      }
      chips = player.count;
      position = player.position;

      return false;
    });

    // Remove this player's position for the hand currently playing,
    // hence this player will be skipped once he leaves
    table.positions.splice(table.positions.indexOf(position), 1);


    // Update its account
    const player = await User.findOne({ username: data.username });
    player.count += chips;
    await player.save();


    // If the leaving player leave behind an empty table, delete it
    if (!table.players.length) {
      await Table.findOneAndDelete({ name: table.name });

      io.emit('update_list');
    } else {
      // If only one player remains, we empty table.round to allow a new hand to start
      // automatically when a new player joins the lonely cowboy (see './joinTable' line 55)
      if (table.players.length === 1) {
        table.round = '';
        table.players[0].position = '';
      }

      // Save document
      const newTable = await table.save();

      // Emit events to update font-end accordingly
      updateHiddenTable(newTable, io);
      io.emit('update_list');
      io.in(newTable.name).emit('msg', { msg: `${data.username} has left the table` });
    }
  } catch (err) {
    console.log(err);
  }
};
