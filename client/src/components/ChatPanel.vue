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
