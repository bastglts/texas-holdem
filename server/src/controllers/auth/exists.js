'use strict';

/* ------------------- Dependencies ----------------- */
const User = require('../../models/user');


/**
 * Find out if a user exists or not. Sends back a Vee-Validate formated response.
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
        message: 'user already exists',
      });
    } else {
      res.send({
        valid: true,
        message: 'user does not exist',
      });
    }
  });
};
