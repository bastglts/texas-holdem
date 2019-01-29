<template>
  <div class="table" ref="table" :style="{height: tableHeight + 'px'}">
    <div class="table-panel">
      <div class="poker-table" ref="pokertable"></div>
      <div class="btm-table-panel">
        <button class="table-panel-btn">Fold</button>
        <button class="table-panel-btn">Check</button>
        <button class="table-panel-btn">Raise</button>
      </div>
    </div>

    <chat-panel :user="user.username" :socket="socket"/>
  </div>
</template>

<script>
import io from 'socket.io-client';
import ChatPanel from '../components/ChatPanel.vue';
import auth from '../utils/auth';


export default {
  name: 'Table',

  components: {
    ChatPanel,
  },

  data() {
    return {
      tableName: '',
      tableHeight: 0,
      user: {},
      socket: io('localhost:8081'),
    };
  },


  methods: {
    setTableHeight() {
      this.tableHeight = window.innerHeight * 0.95;
    },

    fetchUserData() {
      auth.fetchUserData().then((data) => {
        this.user = data;

        this.socket.emit('join_table', { user: this.user.username });
      });
    },
  },


  created() {
    window.addEventListener('resize', this.setTableHeight);
    this.setTableHeight();
    this.fetchUserData();
  },


  mounted() {
    this.$refs.table.scrollIntoView();
  },


  beforeDestroy() {
    window.removeEventListener('resize', this.setTableHeight);

    this.socket.emit('leave_table', { user: this.user.username });
  },
};
</script>
