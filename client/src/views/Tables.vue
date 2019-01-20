<template>
  <div>
    <chat-panel user="Bast"/>
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
    <poker-table/>
  </div>

</template>

<script>
import ChatPanel from '../components/ChatPanel.vue';
import PokerTable from '../components/PokerTable.vue';

export default {
  name: 'Tables',

  components: {
    ChatPanel,
    PokerTable,
  },

  props: ['user'],

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
