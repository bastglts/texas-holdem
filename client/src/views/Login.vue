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
  </div>
</template>

<script>
import auth from '../utils/auth';

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
      auth.login(this);
    },
  },
};
</script>
