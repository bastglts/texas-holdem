'use strict';


/**
 * Logs a user out by closing session, sends back JSON response.
 */
module.exports = (req, res) => {
  req.logout();
  res.send({ success: true });
};
