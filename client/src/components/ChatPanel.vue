<template>
  <div class="chat-panel">
    <input type="text"
           ref="input"
           placeholder="say something nice..."
           v-model="msg"
           @keyup.enter.prevent="sendMsg">
      <div class="msg-list">
        <div v-for="(msg, idx) in msgs" :key="idx">
          <p v-if="msg.user">{{ msg.user }}: {{ msg.msg }}</p>
          <p v-else class="warning">{{ msg.msg }}</p>
        </div>
      </div>
  </div>
</template>

<script>
export default {
  name: 'ChatPanel',

  props: ['user', 'socket'],

  data() {
    return {
      msgs: [],
      msg: '',
    };
  },

  methods: {
    sendMsg() {
      this.socket.emit('send_msg', {
        msg: this.msg,
        user: this.user,
      });
      this.msg = '';
    },
  },

  mounted() {
    this.socket.on('msg', (data) => {
      this.msgs.unshift(data);
    });
  },
};
</script>

<style>
.chat-panel {
  width: 25%;
  height: 100%;
  text-align: left;
  border-left-width: 10%;
  border-left-style: solid;
  border-left-color: #050517;
  font-size: 1.3vw;
}

.chat-panel input {
  margin: 0%;
  height: 5%;
  border: #f8fff4;
  font-size: 1.3vw;
}

.msg-list {
  overflow-y: auto;
  height: 95%;
  border-top-width: 10%;
  border-top-style: solid;
  border-top-color: #050517;
}
</style>
