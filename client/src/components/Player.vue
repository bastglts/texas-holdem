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
    <p class="bet" :id="`bet${pos}`"> $2500 </p>
    <p id="count"> ${{ player.count }} </p>
    <div v-if="player.hand" id="hand"> {{ player.hand }} </div>
    <img class="dlr-btn" :id="`db${pos}`" src="../assets/dlr_btn.svg" alt="dlr_btn">
  </div>
</template>


<script>
import Card from './Card.vue';


export default {
  name: 'Player',

  props: ['player', 'pos'],

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
  bottom: 8%;
  right: 22%;
}

#player4 {
  bottom: 8%;
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
  width: 100%;
  position: absolute;
  color: #b95230;
  top: 105%;
  left: 50%;
  transform: translate(-50%,0);
}

.bet {
  position: absolute;
  color: #d6ac68;
}

#bet0 {
  top: 200%;
  left: 60%;
  transform: translate(-50%,0);
}

#bet1 {
  top: 200%;
  left: 40%;
  transform: translate(-50%,0);
}

#bet2 {
  left: -15%;
  transform: translate(-50%,0);
}

#bet3 {
  top: -200%;
  left: 40%;
  transform: translate(-50%,0);
}

#bet4 {
  top: -200%;
  left: 60%;
  transform: translate(-50%,0);
}

#bet5 {
  left: 115%;
  transform: translate(-50%,0);
}

.dlr-btn {
  position: absolute;
  height: 90%;
}

#db0 {
  top: 150%;
  left: 20%;
}

#db1 {
  top: 150%;
  left: 60%;
}

#db2 {
  top: 50%;
  left: -10%;
}

#db3 {
  top: -150%;
  left: 0%;
}

#db4 {
  top: -150%;
  left: 80%;
}

#db5 {
  top: 50%;
  left: 100%;
}

</style>
