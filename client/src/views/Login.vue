<template>
  <div class="login">
    <h4>Please Login here:</h4>
    <form @submit.prevent="validateBeforeLogin">
      <div>
        <label>Username</label>
        <input v-validate="'required|exists'" type="text" name="username"
          v-model="username" placeholder="username">
        <span v-show="errors.has('username')" class="warning">{{ errors.first('username') }}</span>
      </div>

      <div>
        <label>Password</label>
        <input v-validate="'required'" type="password" name="password"
          v-model="password" placeholder="password">
        <span v-show="errors.has('password')" class="warning">{{ errors.first('password') }}</span>
      </div>

      <button type="submit">Login</button>
    </form>
  </div>
</template>

<script>
import { Validator } from 'vee-validate';
import AuthService from '@/services/AuthService';
import EventBus from '../utils/eventBus';

export default {
  name: 'Login',

  data() {
    return {
      username: '',
      password: '',
    };
  },

  methods: {
    validateBeforeLogin() {
      this.$validator.validateAll().then((result) => {
        if (result) {
          this.login();
        }
      });
    },

    login() {
      AuthService.login({
        username: this.username,
        password: this.password,
      }).then((res) => {
        console.log('login res', res);

        EventBus.$emit('login');
        this.$router.push({ name: 'home' });
      }).catch((err) => {
        console.log('login err:', err.response);

        if (err.response.status === 401) {
          this.errors.add({
            field: 'password',
            msg: `Wrong Password for ${this.username}`,
          });

          this.errors.first('password');
        } else {
          this.errors.add({
            field: 'password',
            msg: 'Error during login, please try again later',
          });

          this.errors.first('password');
        }
      });
    },
  },

  mounted() {
    const existsAlready = usrname => AuthService.exists({
      username: usrname,
    }).then((response) => {
      const output = {
        valid: !response.data.valid,
        data: {
          message: response.data.message,
        },
      };

      console.log('exists validation output', output);
      return output;
    });

    Validator.extend('exists', {
      validate: existsAlready,
      getMessage: (field, params, data) => data.message,
    });
  },
};
</script>
