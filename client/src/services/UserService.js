import Api from './Api';

export default {
  /**
   * Checks if user is logged in.
   *
   * Sends a get request to the server.
   *
   * @returns {Promise} Promise that resolves to a boolean.
   */
  isLoggedIn() {
    return Api().get('user/isloggedin')
      .then(response => response.data.loggedIn)
      .catch(err => console.log('isLoggedIn err:', err));
  },


  /**
   * Fetches user data.
   *
   * @returns {Promise} Promise that resolves to the data.
   */
  fetchUserData() {
    return Api().get('user/fetchuserdata')
      .then(response => response.data)
      .catch(err => console.log('fetchUserData err:', err));
  },
};
