'use strict';


/**
 * Checks if user is logged in, sends a JSON response.
 */
module.exports = (req, res) => {
  if (req.user) {
    res.send({ loggedIn: true });
  } else {
    res.send({ loggedIn: false });
  }
};
