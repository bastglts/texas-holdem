<template>
  <div class="login">
    <h4>Please Login here:</h4>

    <form @submit.prevent="validateBeforeLogin">
      <div>
        <label>Username</label>
        <input v-validate="'required'" type="text" name="username"
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

    <p>Or register <router-link to="/register" >there</router-link>.</p>
  </div>
</template>

<script>
import AuthService from '../services/AuthService';

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
      AuthService.login(this.username, this.password)
        .then(() => {
          this.$router.push({ name: 'tables' });
        }).catch((err) => {
          this.errors.add({
            field: 'password',
            msg: (err.response.status === 401)
              ? `Either ${this.username} does not exist or you entered a wrong password`
              : 'Error during login, please try again later',
          });

          this.errors.first('password');
        });
    },
  },
};
</script>
