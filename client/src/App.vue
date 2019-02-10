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
    <transition name="fade" mode="out-in">
      <router-view/>
    </transition>
  </div>
</template>

<script>
import AuthService from './services/AuthService';
import UserService from './services/UserService';

export default {
  data() {
    return {
      loggedIn: false,
      playerName: '',
    };
  },

  methods: {
    logout() {
      AuthService.logout().then((result) => {
        if (result) {
          this.loggedIn = false;

          this.$router.push({ name: 'home' });
        }
      });
    },

    isLoggedIn() {
      UserService.isLoggedIn().then((result) => {
        this.loggedIn = result;
      });
    },

    fetchUsername() {
      if (this.loggedIn) {
        UserService.fetchUserData().then((data) => {
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
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #050517;
}

body {
  background-color: #f8fff4;
  background-image: url(./assets/bg.svg);
  background-attachment: fixed;
  background-size: cover;
  /* background by SVGBackgrounds.com */
}

#nav {
  padding: 2%;
}

a {
  font-weight: bold;
  color: #050517;
  text-decoration: none;
}

a.router-link-exact-active {
  color: #cf5c36;
}

.top-menu {
  text-align: right;
  background: #050517;
  color: #f8fff4;
  padding: 1%;
}

.top-menu a {
  font-weight: bold;
  color: #f8fff4;
  text-decoration: none;
  cursor: pointer;
}

.top-menu a.router-link-exact-active {
  color: #cf5c36;
}

.fade-enter-active, .fade-leave-active {
    transition: opacity .5s;
}

.fade-enter, .fade-leave-to {
    opacity: 0;
}
</style>
