<template>
  <div class="profile">
    <div>Username: {{user.username}} </div>
    <div>Money: ${{user.count}} </div>
  </div>
</template>

<script>
import UserService from '../services/UserService';


export default {
  name: 'Profile',

  data() {
    return {
      user: {},
    };
  },

  methods: {
    fetchUserData() {
      UserService.fetchUserData().then((data) => {
        this.user = data;
      });
    },
  },

  created() {
    this.fetchUserData();
  },
};
</script>
