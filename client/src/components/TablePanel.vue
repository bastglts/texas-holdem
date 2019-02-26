<template>
  <transition name="fade" mode="out-in">
    <p v-if="!table" class="table-panel" id="lw" :key="'load123'">Loading...</p>

    <p
      v-else-if="table.players.length === 1"
      class="table-panel"
      id="lw"
      :key="'wait123'"
    >You can't play alone... Please wait for at least one other player!</p>

    <p
      v-else-if="table.round === ''"
      class="table-panel"
      id="lw"
      :key="'wait456'"
    >Hand is about to start, waiting a few seconds for other players to join in...</p>

    <div v-else class="table-panel">
      <div class="poker-table" ref="pokertable">
        <player
          v-for="(player, idx) in table.players"
          :key="idx"
          :id="`player${player.seat}`"
          :seat="player.seat"
          :player="player"
        />

        <p id="pot-count">Pot: ${{table.pot}}</p>

        <card
          class="board-card"
          v-for="(card, idx) in table.board"
          :key="card"
          :id="`bc${idx}`"
          :card="card"
        />
      </div>

      <div class="btm-table-panel">
        <template v-if="player.isSpeaking">
          <div class="tbl-panel-btns">
            <button @click="action('fold')">Fold</button>
            <button @click="action('call')">{{callTxt}}</button>
            <button v-if="!isAllInToCall" @click="action('raise')">{{raiseTxt}}</button>
          </div>

          <div v-if="!isAllInToMinRaise && !callPlusExtra && !isAllInToCall"
               class="tbl-panel-inputs">
            <input v-model="raiseTo" type="range" :min="minRaiseTo"
              :max="maxRaiseTo" class="slider">
            <input type="text" v-model="raiseTo" :placeholder="raiseTo" id="raise-input">
          </div>
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
      player: undefined,
      raiseTo: 0,
      minRaise: 0,
      minRaiseTo: 0,
      callAmount: 0,
      isAllInToCall: false,
      isAllInToMinRaise: false,
      callPlusExtra: false,
    };
  },


  methods: {
    action(act) {
      const action = (act === 'raise' && this.callPlusExtra) ? 'call' : act;

      this.socket.emit(`${action}`, {
        username: this.user,
        tableName: this.table.name,
        callAmount: this.isAllInToCall
          ? this.player.count
          : this.callAmount,
        extraAmount: this.callPlusExtra
          ? (this.player.count - this.callAmount)
          : 0,
        raise: (act === 'raise')
          ? { amount: +this.raiseTo - this.player.lastBet, to: +this.raiseTo }
          : 0,
      });
    },
  },

  computed: {
    raiseTxt() {
      return this.callPlusExtra || this.isAllInToMinRaise || (+this.raiseTo === this.maxRaiseTo)
        ? 'Raise ALL IN'
        : `Raise to ${this.raiseTo}`;
    },

    callTxt() {
      if (this.isAllInToCall) {
        return 'Call ALL IN';
      }

      return this.callAmount === 0 ? 'Check' : `Call ${this.callAmount}`;
    },
  },


  mounted() {
    this.socket.on('update_table', (table) => {
      this.table = table;
      this.player = table.players.find(plyr => plyr.username === this.user);

      this.callAmount = table.lastBet - this.player.lastBet;
      this.minRaise = table.lastRaise || table.bigBlind;
      this.minRaiseTo = table.lastBet + this.minRaise;
      this.maxRaiseTo = this.player.count + this.player.lastBet;

      this.isAllInToCall = this.player.count <= this.callAmount;
      this.callPlusExtra = this.maxRaiseTo < this.minRaiseTo;
      this.isAllInToMinRaise = this.maxRaiseTo === this.minRaiseTo;

      this.raiseTo = this.minRaiseTo;
    });
  },


  beforeDestroy() {
    this.socket.removeAllListeners('update_table');
  },
};

</script>


<style>
.tbl-panel-btns,
.tbl-panel-inputs {
  height: 50%;
  width: 70%;
  display: flex;
  justify-content: center;
  align-self: center;
}

.tbl-panel-btns button, #raise-input {
  padding: 0px;
  height: 70%;
  font-size: 1.2vw;
  box-sizing: border-box;
  border-width: 1%;
  border-style: solid;
  border-color: #cf5c36;
  opacity: 0.7;
  -webkit-transition: 0.2s;
  transition: opacity 0.2s;
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
  flex-direction: column;
  background-color: #050517bd;
  box-shadow: 0px -5px 3px 2px #050517bd;
  height: 15%;
  width: 100%;
}

#raise-input {
  width: 10%;
  height: 58%;
  color: white;
  font-size: 1.1vw;
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
  transform: translate(-50%, 0);
  color: #d6ac68;
}

#lw {
  margin: auto;
  font-size: 1.5vw;
}

.slider {
  -webkit-appearance: none; /* Override default CSS styles */
  appearance: none;
  width: 100%;
  height: 60%;
  background: #cf5c36;
  border: none;
  outline: none;
  padding: 0;
  opacity: 0.7;
  -webkit-transition: 0.2s;
  transition: opacity 0.2s;
}

.slider:hover, .tbl-panel-btns button:hover, #raise-input:hover {
  opacity: 1; /* Fully shown on mouse-over */
}


.slider::-webkit-slider-thumb {
  -webkit-appearance: none; /* Override default CSS styles */
  appearance: none;
  height: 118%;
  width: 6%;
  padding: 4%;
  border: none;
  background-image: url('../assets/chip.svg');
  background-size: cover;
  background-color: #05051700;
  cursor: pointer;
}

.slider::-moz-range-thumb {
  height: 118%;
  width: 6%;
  padding: 1%;
  border: none;
  background-image: url('../assets/chip.svg');
  background-size: cover;
  background-color: #05051700;
  cursor: pointer;
}
</style>
