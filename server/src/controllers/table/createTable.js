'use strict';

/* ------------------- Dependencies ----------------- */
const Table = require('../../models/table');


/**
 * Creates a new table. Sends back a JSON boolean.
 */
module.exports = (req, res) => {
  const table = new Table({
    name: req.body.name,
    round: '',
    isNewOne: true,
    availSeats: [0, 1, 2, 3, 4, 5],
    occupiedSeats: [],
  });

  // Save table to database
  table.save()
    .then(() => res.send({ sucess: true, name: req.body.name }))
    .catch(err => res.send({ err: err }));
};
