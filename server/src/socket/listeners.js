'use strict';

/* ----------------- Dependencies ----------------- */
const updateHiddenTable = require('./utils');
const Table = require('../models/table');


/**
 * Socket listeners.
 */
module.exports = (socket, io) => {
  /* Emit a player's message to everyone in the chat */
  socket.on('send_msg', (data) => {
    io.in(data.tableName).emit('msg', data);
  });


  // Emit a message when player joins the table
  socket.on('join_table', (data) => {
    socket.join(`${data.tableName}`);

    Table.findOne({ name: data.tableName })
      .then(table => {
        table.players.push({
          ID: socket.id,
          username: data.player.username,
          count: data.player.count,
          holeCards: ['9H', '9S'],
          hand: 'pair',
          showdown: false,
        });

        table.save();

        updateHiddenTable(table, io);
        io.emit('update_list');
        io.in(table.name).emit('msg', { msg: `${data.player.username} has joined the table` });
      }).catch(err => console.log(err));
  });


  // Emit a message when player leaves the table
  socket.on('leave_table', (data) => {
    Table.findOne({ name: data.tableName })
      .then(table => {
        table.players = table.players.filter(player => player.username !== data.username);

        table.save();

        updateHiddenTable(table, io);
        io.emit('update_list');
        io.in(table.name).emit('msg', { msg: `${data.username} has left the table` });
      }).catch(err => console.log(err));
  });
};
