'use strict';

/* ------------------- Dependencies ----------------- */
const User = require('../../models/user');


/**
 * Finds out if a user exists or not. Sends back a JSON boolean.
 */
module.exports = (req, res) => {
  User.findOne({ username: req.body.value }, (err, user) => {
    // Handle connection errors
    if (err) {
      console.log(err);
    }

    if (user) {
      res.send({
        valid: false,
        msg: 'User already exists :(',
      });
    } else {
      res.send({
        valid: true,
      });
    }
  });
};
