'use strict';

/**
 * Socket listeners.
 */
module.exports = (socket, io) => {
  console.log('connection', socket.id);

  // Emit a player's message to everyone in the chat
  socket.on('send_msg', (data) => {
    io.emit('msg', data);
  });

  // Emit a message when player joins the table
  socket.on('join_table', (data) => {
    io.emit('msg', { msg: `${data.user} has joined the table` });
  });
};
