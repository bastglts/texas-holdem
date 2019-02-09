'use strict';

/* ------------------- Dependencies ----------------- */
const Table = require('../../models/table');


/**
 * Creates a new table. Sends back a JSON boolean.
 */
module.exports = (req, res) => {
  const table = new Table({
    name: req.body.name,
  });

  // Save table to database
  table.save()
    .then(() => res.send({ sucess: true, name: req.body.name }))
    .catch(err => res.send({ err: err }));
};
