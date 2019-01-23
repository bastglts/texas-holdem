'use strict';

/* ------------ Authentication handlers ------------- */
module.exports = {
  register: require('./register'),
  login: require('./login'),
  logout: require('./logout'),
  exists: require('./exists'),
  isLoggedIn: require('./isLoggedIn'),
  fetchUserData: require('./fetchUserData'),
};
