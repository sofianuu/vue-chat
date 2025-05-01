<template>
    <div class="chat">
      <h1>Chat Room</h1>
      <ChatRoom />
    </div>
  </template>
  
  <script>
  import ChatRoom from '@/components/ChatRoom.vue'
  
  export default {
    name: 'ChatView',
    components: {
      ChatRoom
    }
  }
  </script>
  
  <style scoped lang="less">
  .chat {
    padding: 20px;
  }
  </style>