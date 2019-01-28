<template>
  <div class="poker-table" ref="pokertable">

  </div>
</template>

<script>
export default {
  name: 'PokerTable',


  mounted() {
    this.$refs.pokertable.scrollIntoView();
  },
};
</script>
