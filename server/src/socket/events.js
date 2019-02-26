'use strict';

/* ------------------- Dependencies -------------------- */
const listeners = require('./listeners/index');


/* ------------------- Socket events ------------------- */
module.exports = (socket, io) => {
  // Emit chat message
  socket.on('send_msg', (data) => listeners.emitMsg(data, io));

  // Create table
  socket.on('create_table', () => io.emit('update_list'));

  // Add new player to the table
  socket.on('join_table', (data) => listeners.joinTable(data, io, socket));

  // Remove player from the table
  socket.on('leave_table', (data) => listeners.leaveTable(data, io));

  // Player folds
  socket.on('fold', (data) => listeners.fold(data, io));

  // Player calls
  socket.on('call', (data) => listeners.call(data, io));

  // Player raises
  socket.on('raise', (data) => listeners.raise(data, io));
};
