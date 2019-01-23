'use strict';

/* ------------------- Dependencies ----------------- */
const passport = require('passport');


/**
 * Logs a user in. Sends back a simple JSON response.
 */
module.exports = (req, res) => {
  passport.authenticate('local')(req, res, () => {
    res.send({
      loggedIn: true,
    });
  });
};
