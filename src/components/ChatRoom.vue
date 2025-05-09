<template>
  <div class="chat-container">
    <div class="chat-header">
      <h2>Vue Chat</h2>
      <button @click="logout" class="logout-button">Deconectare</button>
    </div>
    <div class="connection-status" :class="isConnected ? 'connected' : 'disconnected'">
      {{ isConnected ? 'Conectat' : 'Deconectat' }}
    </div>
    <div class="messages-container" ref="messagesContainer">
      <div v-for="(message, index) in messages" :key="index" 
           class="message" 
           :class="message.isSelf ? 'message-sent' : 'message-received'">
        <div class="message-header">
          <span class="message-username" v-if="!message.isSelf">{{ message.username }}</span>
          <span class="message-username message-self" v-else>Tu</span>
        </div>
        <div class="message-content">{{ message.text }}</div>
        <div class="message-info">
          {{ message.timestamp }}
        </div>
      </div>
    </div>
    <div class="input-container">
      <input 
        type="text" 
        v-model="newMessage" 
        @keyup.enter="sendMessage" 
        class="message-input" 
        placeholder="Tastează un mesaj..."
        :disabled="!isConnected"
      >
      <button 
        class="send-button" 
        @click="sendMessage"
        :disabled="!isConnected || !newMessage.trim()"
      >
        Trimite
      </button>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'ChatRoom',
  data() {
    return {
      newMessage: '',
    };
  },
  computed: {
    ...mapGetters('chat', [
      'isConnected',
      'messages'
    ]),
    ...mapGetters('auth', [
      'isAuthenticated'
    ])
  },
  mounted() {
    // Verifică dacă utilizatorul este autentificat
    if (!this.isAuthenticated) {
      this.$router.push('/login');
      return;
    }
    
    // Conectează la WebSocket
    this.connectWebSocket();
  },
  beforeUnmount() {
    this.disconnectWebSocket();
  },
  updated() {
    this.scrollToBottom();
  },
  methods: {
    ...mapActions('chat', [
      'connectWebSocket',
      'disconnectWebSocket',
    ]),
    ...mapActions('auth', [
      'logout'
    ]),
    sendMessage() {
      if (!this.newMessage.trim() || !this.isConnected) {
        return;
      }
      
      this.$store.dispatch('chat/sendMessage', this.newMessage);
      this.newMessage = '';
      this.scrollToBottom();
    },
    scrollToBottom() {
      this.$nextTick(() => {
        if (this.$refs.messagesContainer) {
          this.$refs.messagesContainer.scrollTop = this.$refs.messagesContainer.scrollHeight;
        }
      });
    },
    async logout() {
      // Deconectează WebSocket
      this.disconnectWebSocket();
      
      // Deconectează utilizatorul
      await this.$store.dispatch('auth/logout');
      
      // Redirecționează către login
      this.$router.push('/login');
    }
  }
};
</script>

<style scoped lang="less">
.chat-container {
  max-width: 800px;
  margin: 20px auto;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  height: 80vh;
}

.chat-header {
  background: #42b983;
  color: white;
  padding: 15px;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  text-align: center;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logout-button {
  background: #e74c3c;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.logout-button:hover {
  background: #c0392b;
}

.messages-container {
  flex: 1;
  overflow-y: auto;
  padding: 15px;
  text-align: left;
}

.message {
  margin-bottom: 10px;
  padding: 10px;
  border-radius: 5px;
  max-width: 80%;
  word-wrap: break-word;
}

.message-sent {
  background-color: #d6eaff;
  margin-left: auto;
  text-align: right;
}

.message-received {
  background-color: #e9e9e9;
  text-align: left;
}

.message-header{
  margin-bottom: 5 px;
  display: flex;
  justify-content: space-between;
}

.message-username {
  font-weight: bold;
  color: #2c3e50;
  font-size: 0.9em;
}

.message-self {
  color: #1e88e5
}

.message-content {
  margin-bottom: 5px;
}

.message-info {
  font-size: 0.8em;
  color: #888;
  margin-top: 5px;
}

.input-container {
  display: flex;
  padding: 10px;
  border-top: 1px solid #eee;
}

.message-input {
  flex: 1;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  outline: none;
}


.send-button {
  background: #42b983;
  color: white;
  border: none;
  padding: 10px 15px;
  margin-left: 10px;
  border-radius: 4px;
  cursor: pointer;
}

.send-button:hover {
  background: #3ba776;
}

.connection-status {
  text-align: center;
  padding: 5px;
  font-size: 0.9em;
}

.connected {
  color: green;
}

.disconnected {
  color: red;
}
</style>