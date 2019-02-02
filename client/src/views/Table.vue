<template>
  <div class="table"
       ref="table"
       :style="{height: tableHeight + 'px', width: tableWidth + 'px' }">
    <div class="table-panel">
      <div class="poker-table" ref="pokertable">


        <div v-for="(player, idx) in table.players" :key="idx" class="player"
             :id="`player${idx + 1}`">
          <div class="crop">
            <img id="hc1" :src="require(`../assets/cards/${player.hc1}.svg`)" :alt="player.hc1">
            <img id="hc2" :src="require(`../assets/cards/${player.hc2}.svg`)" :alt="player.hc2">
          </div>
          <p> {{ player.username }} </p>
          <p> ${{ player.count }} </p>
        </div>


        <div id="pot-count">
          <div>Pot: $25000</div>
        </div>

        <img class="table-card" id="flop1" src="../assets/cards/3S.svg" alt="8S">
        <img class="table-card" id="flop2" src="../assets/cards/8D.svg" alt="8D">
        <img class="table-card" id="flop3" src="../assets/cards/AS.svg" alt="AS">
        <img class="table-card" id="turn" src="../assets/cards/KH.svg" alt="KH">
        <img class="table-card" id="river" src="../assets/cards/JC.svg" alt="JC">

        <div id="hand">
          <div>Your hand: straigth flush</div>
        </div>
      </div>

      <div class="btm-table-panel">
        <button class="table-panel-btn">Fold</button>
        <button class="table-panel-btn" v-on:click="changeCard">Check</button>
        <button class="table-panel-btn">Raise</button>
      </div>
    </div>

    <chat-panel :user="user" :socket="socket"/>
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
      tableWidth: 0,
      tableHeight: 0,
      user: {},
      table: {},
      socket: io('localhost:8081'),
    };
  },


  methods: {
    changeCard() {
      [this.table.players[0].hc1, this.table.players[0].hc2] = [this.table.players[0].hc2,
        this.table.players[0].hc1];
      this.table.players[0].count = 90;
    },

    setTableSize() {
      const H = window.innerHeight * 2;
      const w = window.innerWidth;
      const smallest = (H <= w) ? H : w;

      this.tableWidth = smallest * 0.97;
      this.tableHeight = this.tableWidth * 0.5;
    },

    fetchUserData() {
      auth.fetchUserData().then((player) => {
        this.user = player.username;

        this.socket.emit('join_table', player);
      });
    },

    playerLeaveTable() {
      this.socket.emit('leave_table', this.user);
    },
  },


  created() {
    window.addEventListener('resize', this.setTableSize);
    window.addEventListener('beforeunload', this.playerLeaveTable);

    this.setTableSize();
    this.fetchUserData();

    this.socket.on('update_table', (table) => {
      this.table = table;
    });
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
