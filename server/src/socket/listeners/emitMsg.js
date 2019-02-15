'use strict';


/**
 * Emit chat message.
 *
 * @param {*} data Hash object containing three properties: tableName, msg and user (strings).
 * @param {*} io   Socket.io instance.
 */
module.exports = (data, io) => {
  io.in(data.tableName).emit('msg', data);
};
