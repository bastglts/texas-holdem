<template>
  <div class="profile">
    <div>Username: {{user.username}} </div>
    <div>Money: ${{user.count}} </div>
  </div>
</template>

<script>
import auth from '../utils/auth';


export default {
  name: 'Profile',

  data() {
    return {
      user: {},
    };
  },

  methods: {
    fetchUserData() {
      auth.fetchUserData().then((data) => {
        this.user = data;
      });
    },
  },

  created() {
    this.fetchUserData();
  },
};
</script>
