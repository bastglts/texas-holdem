'use strict';

/* ------------------- Dependencies ----------------- */
const Table = require('../../models/table');


/**
 * Finds out if a table exists or not. Sends back a JSON.
 */
module.exports = (req, res) => {
  Table.findOne({ name: req.body.value }, (err, table) => {
    // Handle connection errors
    if (err) {
      console.log(err);
    }

    if (table) {
      res.send({
        valid: false,
        msg: 'Table already exists, enter it :)',
      });
    } else {
      res.send({
        valid: true,
      });
    }
  });
};
