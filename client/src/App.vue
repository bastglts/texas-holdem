<template>
  <div id="app">
    <div class="top-menu">
      <router-link v-if="isloggedIn" to="/profile" >{{ playerName }}</router-link>
      <router-link v-else to="/login" >Login</router-link> |
      <a @click="logout" >Logout</a>
      <a @click="isLoggedIn" > - login test</a>
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
import AuthService from './services/AuthService';
import EventBus from './utils/eventBus';

export default {
  data() {
    return {
      isloggedIn: false,
      playerName: '',
    };
  },

  methods: {
    logout() {
      AuthService.logout()
        .then((response) => {
          this.playerName = '';
          this.isloggedIn = response.data.isLoggedIn;
        }).catch((err) => {
          console.log('logout err:', err);
        });
    },

    checkLoginState() {
      EventBus.$on('login', () => {
        this.isLoggedIn();
      });
    },

    isLoggedIn() {
      AuthService.isLoggedIn()
        .then((response) => {
          console.log('isLoggedIn response:', response);
          this.isloggedIn = response.data.isLoggedIn;
          this.playerName = (response.data.username || '');
        }).catch((err) => {
          console.log('isLoggedIn err:', err);
        });
    },
  },

  created() {
    this.isLoggedIn();
    this.checkLoginState();
  },
};
</script>


<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

a {
  font-weight: bold;
  color: #2c3e50;
  text-decoration: none;
}

a.router-link-exact-active {
  color: #42b983;
}

.top-menu {
  text-align: right;
  background: #2c3e50;
  color: #ffffff;
  padding: 10px;
}

.top-menu a {
  font-weight: bold;
  color: #ffffff;
  text-decoration: none;
  cursor: pointer;
}

.top-menu a.router-link-exact-active {
  color: #42b983;
}

form {
  width: 40%;
  margin: auto;
}

input{
  padding: 10px;
  border: 1px solid #e0dede;
  outline: none;
  font-size: 12px;
  text-align: center;
  width: 100%;
  box-sizing: border-box;
}
button {
  background: #42b983;
  color: #ffffff;
  padding: 10px;
  text-transform: uppercase;
  font-size: 12px;
  font-weight: bold;
  width: 100%;
  border: #42b983;
  cursor: pointer;
}

.warning {
  color: red;
}
</style>
