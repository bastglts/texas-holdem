<template>
  <div class="table-panel">
    <div class="poker-table" ref="pokertable">
      <player v-for="(player, idx) in table.players"
              :key="idx"
              :id="`player${idx}`"
              :player="player"/>

      <div id="pot-count">
        <div>Pot: ${{table.pot}}</div>
      </div>

      <card class="board-card"
            v-for="(card, idx) in table.board"
            :key="card"
            :id="`bc${idx}`"
            :card="card"/>

      <div id="hand">
        <div>Your hand: straigth flush</div>
      </div>
    </div>

    <div class="btm-table-panel">
      <button class="table-panel-btn">Fold</button>
      <button class="table-panel-btn">Check</button>
      <button class="table-panel-btn">Raise</button>
    </div>
  </div>
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
      table: {},
    };
  },

  mounted() {
    this.socket.on('update_table', (table) => {
      this.table = table;
    });
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

.table-panel {
  flex-direction: column;
  width: 75%;
  font-size: 1.1vw;
}

#pot-count {
  position: absolute;
  top: 36%;
  left: 50%;
  color: #d6ac68;
}

#pot-count div {
  position: relative;
  left: -50%;
}

#hand {
  position: absolute;
  top: 60%;
  left: 50%;
  color: #d6ac68;
}

#hand div {
  position: relative;
  left: -50%;
}
</style>
