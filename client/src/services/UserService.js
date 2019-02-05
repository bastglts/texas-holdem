import { Validator } from 'vee-validate';
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


  /**
   * Checks that user does not already exists during registration.
   *
   * Custom Vee-Validate rule that performs async backend validation of the input.
   */
  isUnique() {
    Validator.extend('unique', {
      // Async validation, returns a Promise that resolves to a Boolean
      // The 'value' parameter is the username typed in the form input by the user.
      validate: value => Api()
        .post('user/isunique', { username: value })
        .then(response => ({ valid: response.data.valid })),

      // Error message to display if validate is false
      getMessage: () => 'User already exists :(',
    });
  },
};
