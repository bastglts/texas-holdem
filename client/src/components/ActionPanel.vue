<template>
  <div class="action-panel">
    <template v-if="player.isSpeaking">
      <div class="action-btns">
        <button @click="action('fold')">Fold</button>
        <button @click="action('call')">{{callTxt}}</button>
        <button v-if="!isAllInToCall && player.canRaise"
          @click="action('raise')">{{raiseTxt}}</button>
      </div>

      <div v-if="!isAllInToMinRaise && !callPlusExtra && !isAllInToCall && player.canRaise"
            class="action-inputs">
        <input v-model="raiseTo" type="range" :min="minRaiseTo"
          :max="maxRaiseTo" class="slider">
        <input type="text" v-model="raiseTo" :placeholder="raiseTo" id="raise-input">
      </div>
    </template>
  </div>
</template>


<script>
export default {
  name: 'ActionPanel',

  props: ['player', 'table', 'socket'],

  data() {
    return {
      raiseTo: 0,
      minRaise: 0,
      minRaiseTo: 0,
      maxRaiseTo: 0,
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
        username: this.player.username,
        tableName: this.table.name,
        callAmount: this.isAllInToCall
          ? this.player.count
          : this.callAmount,
        extraAmount: (act === 'raise' && this.callPlusExtra)
          ? (this.player.count - this.callAmount)
          : 0,
        raise: (act === 'raise')
          ? { amount: +this.raiseTo - this.player.lastBet, to: +this.raiseTo }
          : 0,
      });
    },

    setValues() {
      this.callAmount = this.table.lastBet - this.player.lastBet;
      this.minRaise = this.table.lastRaise || this.table.bigBlind;
      this.minRaiseTo = this.table.lastBet + this.minRaise;
      this.maxRaiseTo = this.player.count + this.player.lastBet;

      this.isAllInToCall = this.player.count <= this.callAmount;
      this.callPlusExtra = this.maxRaiseTo < this.minRaiseTo;
      this.isAllInToMinRaise = this.maxRaiseTo === this.minRaiseTo;

      this.raiseTo = this.minRaiseTo;
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

  watch: {
    table: 'setValues',
  },

  mounted() {
    this.setValues();
  },
};

</script>


<style>
.action-btns,
.action-inputs {
  height: 50%;
  width: 70%;
  display: flex;
  justify-content: center;
  align-self: center;
}

.action-btns button, #raise-input {
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

.action-panel {
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

.slider:hover, .action-btns button:hover, #raise-input:hover {
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
