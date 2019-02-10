'use strict';

/* ------------------- Dependencies ----------------- */
const Table = require('../../models/table');


/**
 * Find every tables. Sends back an array in a JSON.
 */
module.exports = (req, res) => {
  Table.find({})
    .select('name players')
    .then(tables => {
      const list = [];

      tables.forEach(table => {
        list.push({
          name: table.name,
          numPlayers: table.players.length,
        });
      });
      res.send({ tablesList: list });
    });
};
