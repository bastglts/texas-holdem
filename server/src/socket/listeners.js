'use strict';

/* ----------------- Dependencies ----------------- */
const updateHiddenTable = require('./utils');
const table = {
  name: '',
  players: [],
  board: ['3C', '8C', 'AS', 'AD', 'QD'],
  pot: 3500,
};


/**
 * Socket listeners.
 */
module.exports = (socket, io) => {
  /* Emit a player's message to everyone in the chat */
  socket.on('send_msg', (data) => {
    io.emit('msg', data);
  });


  // Emit a message when player joins the table
  socket.on('join_table', (player) => {
    table.players.push({
      ID: socket.id,
      username: player.username,
      count: player.count,
      holeCards: ['8H', '8S'],
      hand: 'pair',
      showdown: false,
    });


    updateHiddenTable(table, io);
    io.emit('msg', { msg: `${player.username} has joined the table` });
  });


  // Emit a message when player leaves the table
  socket.on('leave_table', (username) => {
    table.players = table.players.filter(player => player.username !== username);

    updateHiddenTable(table, io);
    io.emit('msg', { msg: `${username} has left the table` });
  });
};
