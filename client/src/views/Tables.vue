<template>
  <div class="tables">
    <h3>Tables list:</h3>
    <p>There's just one table for now. <router-link to="/table">Enter here.</router-link> </p>

<!--     <h3>Create new table ?</h3>
    <form>
      <input type="text"
            v-model="tableName"
            placeholder="table name"
            @keyup.enter="createTable">
      <button @click="createTable">Create</button>
    </form> -->
  </div>

</template>

<script>
export default {
  name: 'Tables',

  data() {
    return {
      tableName: '',
    };
  },

  methods: {
    createTable() {
      console.log('create table');
    },
  },
};

</script>
