'use strict';

/* ------------------- Dependencies ----------------- */
const passport = require('passport');


/**
 * Log a user in. Sends back a simple JSON response.
 */
module.exports = (req, res) => {
  passport.authenticate('local')(req, res, () => {
    res.send({
      isloggedIn: true,
    });
  });
};
