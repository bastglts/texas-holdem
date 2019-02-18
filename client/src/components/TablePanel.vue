<template>
  <transition name="fade" mode="out-in">
    <p v-if="!table" class="table-panel" id="lw" :key="'load123'">
      Loading...
    </p>

    <p v-else-if="table.players.length < 2" class="table-panel" id="lw" :key="'wait123'">
      You can't play alone... Please wait for at least one other player!
    </p>

    <div v-else class="table-panel">
      <div class="poker-table" ref="pokertable">
        <player v-for="(player, idx) in table.players"
                :key="idx"
                :id="`player${idx}`"
                :pos="idx"
                :player="player"/>

        <p id="pot-count"> Pot: ${{table.pot}} </p>

        <card class="board-card"
              v-for="(card, idx) in table.board"
              :key="card"
              :id="`bc${idx}`"
              :card="card"/>
      </div>

      <div class="btm-table-panel">
        <template v-if="isSpeaking">
          <button class="table-panel-btn" @click="fold">Fold</button>
          <button class="table-panel-btn">Call {{table.lastBet}} </button>
          <button class="table-panel-btn">Raise to {{raiseAmount}} </button>
          <input type="text" v-model="raiseAmount" :placeholder="raiseAmount">
<!--           <button class="table-panel-btn" @click="min">MIN</button>
          <button class="table-panel-btn" @click="three">X3</button>
          <button class="table-panel-btn" @click="four">X4</button>
          <button class="table-panel-btn" @click="five">X5</button>
          <button class="table-panel-btn" @click="fold">POT</button>
          <button class="table-panel-btn" @click="fold">ALL IN</button> -->
        </template>
      </div>
    </div>
  </transition>
</template>


<script>
import Card from './Card.vue';
import Player from './Player.vue';


export default {
  name: 'TablePanel',

  components: {
    Card,
    Player,
  },

  props: ['user', 'socket'],

  data() {
    return {
      table: undefined,
      isSpeaking: false,
      raiseAmount: undefined,
    };
  },

  methods: {
    fold() {
      this.socket.emit('player_folds', { username: this.user, tableName: this.table.name });
    },
  },

  mounted() {
    this.socket.on('update_table', (table) => {
      this.table = table;
      this.isSpeaking = table.players.find(plyr => plyr.username === this.user).isSpeaking;
      this.raiseAmount = table.lastBet + (table.lastRaise || 20);
      console.log('table', table);
    });
  },

  beforeDestroy() {
    this.socket.removeAllListeners('update_table');
  },
};
</script>


<style>
.table-panel-btn {
  padding: 0px;
  width: 20%;
  height: 40%;
  font-size: 1.2vw;
  box-sizing: border-box;
  border-width: 1%;
  border-style: solid;
  border-color: #cf5c36;
}

.poker-table {
  position: relative;
  background-image: url(../assets/table.svg);
  background-size: 100% 100%;
  height: 85%;
  font-weight: bold;
}

.btm-table-panel {
  display: flex;
  background-color: #050517bd;
  box-shadow: 0px -5px 3px 2px #050517bd;
  height: 15%;
  justify-content: center;
}

.btm-table-panel input {
  padding: 0px;
  width: 20%;
  height: 40%;
  font-size: 1.2vw;
  color: white;
  box-sizing: border-box;
  border-width: 1%;
  border-style: solid;
  border-color: #cf5c36;
}

.table-panel {
  flex-direction: column;
  width: 75%;
  font-size: 1.1vw;
}

#pot-count {
  position: absolute;
  top: 32%;
  left: 50%;
  transform: translate(-50%,0);
  color: #d6ac68;
}

#lw {
  margin: auto;
  font-size: 1.5vw;
}
</style>
