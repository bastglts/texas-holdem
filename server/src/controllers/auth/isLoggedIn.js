'use strict';


/**
 * Check if user is logged in, sens a JSON response.
 */
module.exports = (req, res) => {
  if (req.user) {
    res.send({
      isLoggedIn: true,
      userId: req.user._id,
      username: req.user.username,
    });
  } else {
    res.send({ isLoggedIn: false });
  }
};
