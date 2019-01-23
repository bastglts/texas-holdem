<template>
  <div class="register">
    <h4>Please Register here:</h4>
    <form @submit.prevent="validateBeforeRegister">
      <div>
        <label>Username</label>
        <input v-validate="'required|unique'" type="text" name="username"
          v-model="username" placeholder="username">
        <span v-show="errors.has('username')" class="warning">{{ errors.first('username') }}</span>
      </div>

      <div>
        <label>Password</label>
        <input v-validate="'required|min:5'" type="password" name="password"
          v-model="password" placeholder="password" ref="password">
        <span v-show="errors.has('password')" class="warning">{{ errors.first('password') }}</span>
      </div>

      <div>
        <label>Password Confirmation</label>
        <input v-validate="'required|confirmed:password'" type="password"
          name="password-check" v-model="passwordCheck" placeholder="confirm password"
          data-vv-as="password">
        <span v-show="errors.has('password-check')" class="warning">
          {{ errors.first('password-check') }} </span>
      </div>

      <button type="submit">Register</button>
    </form>
  </div>
</template>

<script>
import auth from '../utils/auth';

export default {
  name: 'Register',


  data() {
    return {
      username: '',
      password: '',
      passwordCheck: '',
    };
  },


  methods: {
    validateBeforeRegister() {
      this.$validator.validateAll().then((result) => {
        if (result) {
          this.register();
        }
      });
    },

    register() {
      auth.register(this.username, this.password)
        .then(() => {
          this.$router.push({ name: 'tables' });
        }).catch(() => {
          this.errors.add({
            field: 'password',
            msg: 'Error during register, please try again later',
          });

          this.errors.first('password');
        });
    },
  },


  mounted() {
    auth.unique();
  },
};
</script>
