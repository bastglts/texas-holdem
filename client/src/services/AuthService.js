import axios from 'axios';

const Api = () => axios.create({
  baseURL: 'http://localhost:8081/auth',
  withCredentials: true,
});

export default {
  login(user) {
    return Api().post('login', user);
  },

  register(user) {
    return Api().post('register', user);
  },

  exists(user) {
    return Api().post('exists', user);
  },

  isLoggedIn() {
    return Api().get('isloggedin');
  },

  logout() {
    return Api().get('logout');
  },
};
