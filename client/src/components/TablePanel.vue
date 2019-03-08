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
          :bestCards="bestCards"
        />

        <p id="pot-count">Pot: ${{table.pot}}</p>

        <card
          class="board-card"
          v-for="(card, idx) in table.board"
          :key="card"
          :id="`bc${idx}`"
          :card="card"
          :bestCards="bestCards"
        />
      </div>

      <action-panel :player="player" :table="table" :socket="socket"/>

    </div>
  </transition>
</template>


<script>
import Card from './Card.vue';
import Player from './Player.vue';
import ActionPanel from './ActionPanel.vue';

export default {
  name: 'TablePanel',

  components: {
    Card,
    Player,
    ActionPanel,
  },

  props: ['user', 'socket'],

  data() {
    return {
      table: undefined,
      player: undefined,
      bestCards: undefined,
    };
  },

  mounted() {
    this.socket.on('update_table', (table) => {
      this.table = table;
      this.player = table.players.find(plyr => plyr.username === this.user);

      this.bestCards = table.bestCards;
    });
  },


  beforeDestroy() {
    this.socket.removeAllListeners('update_table');
  },
};

</script>


<style>
.poker-table {
  position: relative;
  background-image: url(../assets/table.svg);
  background-size: 100% 100%;
  height: 85%;
  font-weight: bold;
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
</style>
