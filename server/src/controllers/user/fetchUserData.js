'use strict';

/* ------------------- Dependencies ----------------- */
const User = require('../../models/user');


/**
 * Sends a JSON response.
 */
module.exports = (req, res) => {
  User.findOne(req.user, (err, user) => {
    // Handle connection errors
    if (err) {
      console.log(err);
    }

    if (user) {
      console.log('fetchUserData:', user);
      res.send(user);
    } else {
      res.send({ err: 'user does not exist' });
    }
  });
};
