<template>
  <div class="chat-panel">
      <div class="msg-list">
        <div v-for="(msg, idx) in msgs" :key="idx">
          <p>{{ msg.user }} : {{ msg.msg }}</p>
        </div>
      </div>
    <label for="m">Your message :</label>
    <input type="text"
           placeholder="type something nice..."
           v-model="msg"
           @keyup.enter.prevent="sendMsg">
  </div>
</template>

<script>
import io from 'socket.io-client';

export default {
  name: 'ChatPanel',

  props: ['user'],

  data() {
    return {
      msgs: [],
      msg: '',
      socket: io('localhost:8081'),
    };
  },

  methods: {
    sendMsg() {
      this.socket.emit('SEND_MSG', {
        msg: this.msg,
        user: this.user,
      });
      this.msg = '';
    },
  },

  mounted() {
    this.socket.on('MSG', (data) => {
      this.msgs.push(data);
    });
  },
};
</script>

<style scoped>
.chat-panel {
  background-color: brown;
}
.msg-list {
  color: rgb(137, 221, 1);
}
</style>
