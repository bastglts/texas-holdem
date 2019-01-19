<template>
  <div>
    <h3>Tables list:</h3>
    <h3>Create new table ?</h3>
    <form>
      <input type="text"
            ref="input"
            v-model="tableName"
            placeholder="table name"
            @keyup.enter="createTable">
      <button @click="createTable">Create</button>
    </form>
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
};
</script>
