<template>
  <div class="tables">
    <h3>Tables list:</h3>

    <transition name="fade" mode="out-in">
      <p v-if="!tables" class="loading">Loading...</p>
      <table v-else>
        <thead>
          <tr>
            <th>Name</th>
            <th>Players</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(table,idx) in tables"
              :key="idx"
              class="table-row"
              @click="enterTable({name: 'table', params: { name: table.name }})">
            <td>{{ table.name }}</td>
            <td> {{ table.players.length }} / 6 </td>
          </tr>
        </tbody>
      </table>
    </transition>

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
      tables: undefined,
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
        .then(() => this.fetchTablesList());
    },

    enterTable(to) {
      this.$router.push(to);
    },

    fetchTablesList() {
      TableService.fetchTablesList()
        .then((list) => {
          this.tables = list;
          console.log('tables', list);
        });
    },
  },


  mounted() {
    isUnique('table');
    this.fetchTablesList();
  },
};
</script>

<style>
table {
    margin: auto;
}
th {
  color: #3e3b46;
}
tbody {
  cursor: pointer;
}

.loading {
  font-size: large;
  color: #3e3b46;
}
</style>
