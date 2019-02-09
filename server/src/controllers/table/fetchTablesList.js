'use strict';

/* ------------------- Dependencies ----------------- */
const Table = require('../../models/table');


/**
 * Find every tables. Sends back an array in a JSON.
 */
module.exports = (req, res) => {
  Table.find({})
    .select('name players')
    .then(list => {
      console.log('list', list);
      res.send({ tablesList: list });
    });
};
