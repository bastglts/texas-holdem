<template>
  <div class="tables">
    <h3>Tables list:</h3>
    <p>There's just one table for now. <router-link to="/table">Enter here.</router-link> </p>

    <h3>Create new table ?</h3>
    <form @submit.prevent="validateBeforeCreate">
      <input type="text"
             v-model="tableName"
             name="tableName"
             v-validate="'required|unique'"
             data-vv-delay="600"
             placeholder="table name">
      <span v-show="errors.has('tableName')" class="warning">{{ errors.first('tableName') }}</span>
      <button type="submit">Create</button>
    </form>
  </div>

</template>

<script>
import isUnique from '../services/isUnique';
import TableService from '../services/TableService';


export default {
  name: 'Tables',


  data() {
    return {
      tableName: '',
      tables: [],
    };
  },


  methods: {
    validateBeforeCreate() {
      this.$validator.validateAll().then((result) => {
        if (result) {
          this.createTable();
        }
      });
    },

    createTable() {
      TableService.createTable(this.tableName)
        .then(res => console.log(res));
    },
  },


  mounted() {
    isUnique('table');
  },
};
</script>
