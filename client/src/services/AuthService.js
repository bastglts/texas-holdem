import Api from './Api';


export default {
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
    return Api().post('auth/login', {
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
    return Api().post('auth/register', {
      username: usr,
      password: pwd,
    });
  },


  /**
   * Logs user out.
   *
   * Sends a get request to the server.
   *
   * @returns {Promise} Promise that resolves to a boolean (true if logout was successful).
   */
  logout() {
    return Api().get('auth/logout')
      .then(response => response.data.success)
      .catch(err => console.log('logout err:', err));
  },
};
