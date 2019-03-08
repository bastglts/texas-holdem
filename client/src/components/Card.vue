<template>
    <img v-bind:class="{shade: isShaded}" :src="require(`../assets/cards/${card}.svg`)" :alt="card">
</template>

<script>
export default {
  name: 'Card',

  props: ['card', 'bestCards'],

  computed: {
    isShaded() {
      return this.bestCards.length ? !this.bestCards.includes(this.card) : false;
    },
  },
};
</script>

<style>
.board-card {
  position: absolute;
  top: 39.5%;
  width: 8%;
}

.shade {
  -webkit-filter: brightness(0.5);
  filter: brightness(0.5);
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
