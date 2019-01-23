import { Validator } from 'vee-validate';
import AuthService from '../services/AuthService';


export default {
  /**
   * Fetches user data.
   *
   * @returns {Promise} Promise that resolves to the data.
   */
  fetchUserData() {
    return AuthService.fetchUserData()
      .then(response => response.data)
      .catch(err => console.log('isLoggedIn err:', err));
  },


  /**
   * Checks if user is logged in.
   *
   * Sends a get request to the server.
   *
   * @returns {Promise} Promise that resolves to a boolean.
   */
  isLoggedIn() {
    return AuthService.isLoggedIn()
      .then(response => response.data.loggedIn)
      .catch(err => console.log('isLoggedIn err:', err));
  },


  /**
   * Logs user out.
   *
   * Sends a get request to the server.
   *
   * @returns {Promise} Promise that resolves to a boolean (true if logout was successful).
   */
  logout() {
    return AuthService.logout()
      .then(response => response.data.success)
      .catch(err => console.log('logout err:', err));
  },


  /**
   * Logs user in.
   *
   * Sends a post request to server.
   *
   * @param {String} usr Username.
   * @param {String} pwd Password.
   *
   * @returns Axios Promise.
   */
  login(usr, pwd) {
    return AuthService.login({
      username: usr,
      password: pwd,
    });
  },


  /**
   * Registers user.
   *
   * Sends a post request to the server.
   *
   * @param {String} usr Username.
   * @param {String} pwd Password.
   *
   * @returns Axios Promise.
   */
  register(usr, pwd) {
    return AuthService.register({
      username: usr,
      password: pwd,
    });
  },


  /**
   * Checks that user does not already exists.
   *
   * Custom Vee-Validate rule that performs async backend validation of the input.
   */
  unique() {
    const isUnique = usr => AuthService.exists({ username: usr })
      .then((response) => {
        const output = {
          valid: response.data.valid,
          data: {
            message: response.data.message,
          },
        };

        return output;
      });

    Validator.extend('unique', {
      validate: isUnique,
      getMessage: (field, params, data) => data.message,
    });
  },
};
