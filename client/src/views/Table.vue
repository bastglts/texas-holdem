<template>
  <div :style="{height: tableHeight + 'px', width: tableWidth + 'px' }"
       class="table"
       ref="table">

    <table-panel :user="user" :socket="socket"/>
    <chat-panel :user="user" :socket="socket" :tableName="tableName"/>
  </div>
</template>


<script>
import io from 'socket.io-client';
import ChatPanel from '../components/ChatPanel.vue';
import TablePanel from '../components/TablePanel.vue';
import UserService from '../services/UserService';


export default {
  name: 'Table',

  components: {
    ChatPanel,
    TablePanel,
  },

  data() {
    return {
      tableName: '',
      tableWidth: 0,
      tableHeight: 0,
      user: '',
      socket: io('localhost:8081'),
    };
  },


  methods: {
    setTableSize() {
      const H = window.innerHeight * 2;
      const w = window.innerWidth;
      const smallest = (H <= w) ? H : w;

      this.tableWidth = smallest * 0.97;
      this.tableHeight = this.tableWidth * 0.5;
    },

    setTableName() {
      this.tableName = this.$route.params.name;
    },

    fetchUserData() {
      UserService.fetchUserData().then((plyr) => {
        this.user = plyr.username;

        this.socket.emit('join_table', {
          username: this.user,
          chips: 2000,
          tableName: this.tableName,
        });
      });
    },

    playerLeaveTable() {
      this.socket.emit('leave_table', { username: this.user, tableName: this.tableName });
    },
  },


  created() {
    window.addEventListener('resize', this.setTableSize);
    window.addEventListener('beforeunload', this.playerLeaveTable);

    this.setTableSize();
    this.setTableName();
    this.fetchUserData();
  },


  mounted() {
    this.$refs.table.scrollIntoView();
  },


  beforeDestroy() {
    this.playerLeaveTable();

    window.removeEventListener('resize', this.setTableSize);
    window.removeEventListener('beforeunload', this.playerLeaveTable);
  },
};
</script>

<style>
.table {
  display: flex;
  margin: auto;
  border-width: 10%;
  border-style: solid;
  border-color: #050517;
}
</style>
