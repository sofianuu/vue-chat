<template>
  <nav>
    <router-link to="/">Home</router-link>
    <template v-if="isAuthenticated">
      <router-link to="/chat">Chat</router-link>
      <a href="#" @click.prevent="logout" class="logout-link">Deconectare</a>
    </template>
    <template v-else>
      <router-link to="/login">Login</router-link>
    </template>
  </nav>
  <router-view/>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  computed: {
    ...mapGetters('auth', [
      'isAuthenticated'
    ])
  },
  methods: {
    ...mapActions('auth', [
      'logout',
      'checkAuth'
    ]),
    async handleLogout() {
      await this.logout();
      this.$router.push('/login');
    }
  },
  created() {
    // Verifică autentificarea la pornirea aplicației
    this.checkAuth();
  }
}
</script>

<style lang="less">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  padding: 30px;
  display: flex;
  justify-content: center;
  gap: 20px;

  a {
    font-weight: bold;
    color: #2c3e50;
    text-decoration: none;
    padding: 5px 10px;
    border-radius: 4px;

    &.router-link-exact-active {
      color: #42b983;
      border-bottom: 2px solid #42b983;
    }
  }

  .logout-link {
    color: #e74c3c;
    cursor: pointer;
    
    &:hover {
      text-decoration: underline;
    }
  }
}
</style>