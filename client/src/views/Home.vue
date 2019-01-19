<template>
  <div class="home">
    <h3>Welcome to a simple online poker game</h3>
    <p>
      Already have an account? Log in <router-link to="/login" >here</router-link>,
      else register <router-link to="/register" >there</router-link>.
    </p>
  </div>

</template>

<script>
export default {
  name: 'Home',
};
</script>
