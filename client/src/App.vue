<template>
  <div id="app">
    <div class="top-menu">
      <router-link v-if="loggedIn" to="/profile" >{{ playerName }}</router-link>
      <router-link v-else to="/login" >Login</router-link>
      <a v-if="loggedIn" @click="logout" > | Logout</a>
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
    logout() {
      auth.logout().then((result) => {
        if (result) {
          this.loggedIn = false;

          this.$router.push({ name: 'home' });
        }
      });
    },

    isLoggedIn() {
      auth.isLoggedIn().then((result) => {
        this.loggedIn = result;
        console.log('isloggedin:', result);
      });
    },

    fetchUsername() {
      if (this.loggedIn) {
        auth.fetchUserData().then((data) => {
          this.playerName = data.username;
        });
      } else {
        this.playerName = '';
      }
    },
  },


  watch: {
    // Call isLoggedIn again if the route changes
    $route: 'isLoggedIn',

    // Fetch (or empty) player name only when login status change.
    loggedIn: 'fetchUsername',
  },


  created() {
    this.isLoggedIn();
    this.fetchUsername();
  },
};
</script>


<style>
@import './css/style.css';
</style>
