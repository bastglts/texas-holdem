'use strict';

/* ------------------- Dependencies ----------------- */
const User = require('../../models/user');


/**
 * Finds out if a user exists or not. Sends back a JSON boolean.
 */
module.exports = (req, res) => {
  User.findOne({ username: req.body.username }, (err, user) => {
    // Handle connection errors
    if (err) {
      console.log(err);
    }

    if (user) {
      res.send({
        valid: false,
      });
    } else {
      res.send({
        valid: true,
      });
    }
  });
};
