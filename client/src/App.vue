<template>
  <div id="app">
    <div class="top-menu">
      <router-link v-if="loggedIn" to="/profile" >{{ playerName }}</router-link>
      <router-link v-else to="/login" >Login</router-link>
      <a v-if="loggedIn" @click="logout" > | Logout</a>
      <a @click="isLoggedIn" > | login test</a>
    </div>
    <h1>Online Texas Hold'em Poker</h1>
    <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/tables">Tables</router-link> |
      <router-link to="/about">About</router-link>
    </div>
    <router-view/>
  </div>
</template>

<script>
import auth from './utils/auth';

export default {
  data() {
    return {
      loggedIn: false,
      playerName: '',
    };
  },

  methods: {
    async logout() {
      const { loggedIn, playerName } = await auth.logout();

      this.loggedIn = loggedIn;
      this.playerName = playerName;

      this.$router.push({ name: 'home' });
    },


    async isLoggedIn() {
      const { loggedIn, playerName } = await auth.isLoggedIn();

      this.loggedIn = loggedIn;
      this.playerName = playerName;
    },
  },


  created() {
    this.isLoggedIn();
    auth.checkLoginState(this);
  },
};
</script>


<style>
@import './css/style.css';
</style>
