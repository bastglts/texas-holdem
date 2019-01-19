'use strict';

/* ------------------- Dependencies ----------------- */
const passport = require('passport');
const User = require('../../models/user');


/**
 * Register and log a user in.
 */
module.exports = (req, res, next) => {
  // The register method is a convinience from passportLocalMongoose
  User.register(new User({ username: req.body.username }), req.body.password, (err) => {
    if (err) {
      console.log('error while user register!', err);
      res.send({
        registered: false,
        err: err,
      });
      return next(err);
    }

    console.log('user registered!');

    // Once registration is completed, immediately log in the user
    passport.authenticate('local')(req, res, () => {
      res.send({
        isloggedIn: true,
      });
    });
  });
};
