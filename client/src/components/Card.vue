<template>
    <img :src="require(`../assets/cards/${card}.svg`)" :alt="card">
</template>

<script>
export default {
  name: 'Card',

  props: ['card'],

  data() {
    return {

    };
  },
};
</script>

<style>
.board-card {
  position: absolute;
  top: 39.5%;
  width: 8%;
}

#bc0 {
  left: 29%;
}

#bc1 {
  left: 37.5%;
}

#bc2 {
  left: 46%;
}

#bc3 {
  left: 54.5%;
}

#bc4 {
  left: 63%;
}

.hole-card {
  position: absolute;
  height: 230%;
}

#hc0 {
  left: 26.5%;
}

#hc1 {
  left: 36.5%;
}
</style>
