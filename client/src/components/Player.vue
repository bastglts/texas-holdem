<template>
  <div class="player">
    <div class="crop">
      <card class="hole-card"
            v-for="(card, idx) in player.holeCards"
            :key="idx"
            :id="`bc${idx}`"
            :card="card"/>
    </div>
    <p> {{ player.username }} </p>
    <p id="count"> ${{ player.count }} </p>
    <p id="hand"> {{ player.hand }} </p>
  </div>
</template>

<script>
import Card from './Card.vue';


export default {
  name: 'Player',

  props: ['player'],

  components: {
    Card,
  },

  data() {
    return {

    };
  },
};
</script>

<style>
.player {
  position: absolute;
  width: 20%;
  height: 8%;
  background-image: linear-gradient(to right, #ffffff00 10%, #050517, #ffffff00 90%) ;
  border-bottom-style: solid;
  border-bottom-width: 0.1px;
  border-top-style: solid;
  border-top-width: 0px;
  border-image-source: linear-gradient(to left, #cf5c3600, #cf5c36, #cf5c3600);
  border-image-slice: 1 0;
  border-image-width: 4%;
  color: #e9dad5;
  display: flex;
  flex-direction: column;
}

.crop {
  position: absolute;
  bottom: 100%;
  height: 100%;
  width: 100%;
  overflow: hidden;
}

#player0 {
  top: 12%;
  left: 22%;
}

#player1 {
  top: 12%;
  right: 22%;
}

#player2 {
  top: 52%;
  right: 0%;
}

#player3 {
  bottom: 4%;
  right: 22%;
}

#player4 {
  bottom: 4%;
  left: 22%;
}

#player5 {
  top: 52%;
  left: 0%;
}

.player p {
  margin: auto;
}

#count {
  color: #d6ac68;
}

#hand {
  position: absolute;
  top: 110%;
  left: 50%;
  transform: translate(-50%,0);
}
</style>
