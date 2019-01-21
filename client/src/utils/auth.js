import { Validator } from 'vee-validate';
import AuthService from '../services/AuthService';
import EventBus from './eventBus';


export default {
  /**
   * Listens to 'check-login' event in order to trigger an authentication backend check.
   *
   * @param {*} ctx This keyword.
   */
  checkLoginState(ctx) {
    EventBus.$on('check-login', () => {
      ctx.isLoggedIn();
    });
  },


  /**
   * Checks if user is logged in.
   *
   * Sends a get request to the server. Sets loggedIn and
   * playerName in the component's data.
   *
   * @param {*} ctx This keyword (the Vue component).
   */
  isLoggedIn(ctx) {
    AuthService.isLoggedIn()
      .then((response) => {
        console.log('isLoggedIn response:', response);

        ctx.loggedIn = response.data.loggedIn;
        ctx.playerName = (response.data.username || '');
      }).catch((err) => {
        console.log('isLoggedIn err:', err);
      });
  },


  /**
   * Logs user out.
   *
   * Sends a get request to the server. Sets loggedIn to false and
   * playerName to '' in the component's data.
   *
   * @param {*} ctx This keyword (the Vue component).
   */
  logout(ctx) {
    AuthService.logout()
      .then((response) => {
        ctx.playerName = '';
        ctx.loggedIn = response.data.loggedIn;
      }).catch((err) => {
        console.log('logout err:', err);
      });
  },


  /**
   * Logs user in.
   *
   * Sends a post request to server. Redirects to home page after success,
   * else adds errors to Vee-Validate.
   *
   * @param {*} ctx This keyword (the Vue component).
   */
  login(ctx) {
    AuthService.login({
      username: ctx.username,
      password: ctx.password,
    }).then(() => {
      EventBus.$emit('check-login');

      ctx.$router.push({ name: 'home' });
    }).catch((err) => {
      if (err.response.status === 401) {
        ctx.errors.add({
          field: 'password',
          msg: `Either ${ctx.username} does not exist or you entered a wrong password`,
        });

        ctx.errors.first('password');
      } else {
        ctx.errors.add({
          field: 'password',
          msg: 'Error during login, please try again later',
        });

        ctx.errors.first('password');
      }
    });
  },


  /**
   * Registers user.
   *
   * Sends a post request to the server. Redirects to home page after success,
   * else adds errors to Vee-Validate.
   *
   * @param {*} ctx This keyword (the Vue component).
   */
  register(ctx) {
    AuthService.register({
      username: ctx.username,
      password: ctx.password,
    }).then(() => {
      EventBus.$emit('check-login');

      ctx.$router.push({ name: 'home' });
    }).catch((err) => {
      console.log('register err:', err);

      ctx.errors.add({
        field: 'password',
        msg: 'Error during register, please try again later',
      });

      ctx.errors.first('password');
    });
  },

  /**
   * Checks that user does not already exists.
   *
   * Custom Vee-Validate rule to performe async backend validation of the input.
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
