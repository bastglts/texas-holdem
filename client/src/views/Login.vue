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

<style>
form {
  width: 40%;
  margin: auto;
}

input {
  padding: 2%;
  margin: 1%;
  outline: none;
  text-align: center;
  width: 100%;
  background-color: #f8fff400;
  box-sizing: border-box;
  border-width: 1%;
  border-style: solid;
  border-color: #050517;
}

button {
  background: #050517;
  color: #f8fff4;
  padding: 2%;
  margin: 1%;
  text-transform: uppercase;
  text-align: center;
  justify-content: center;
  font-weight: bold;
  width: 100%;
  cursor: pointer;
  border-color: #050517;
}

.warning {
  color: #cf5c36;
}
</style>
