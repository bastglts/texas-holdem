'use strict';

/* ------------ Authentication handlers ------------- */
module.exports = {
  register: require('./register'),
  login: require('./login'),
  logout: require('./logout'),
};
