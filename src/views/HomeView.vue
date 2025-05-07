<template>
  <div class="home">
    <h1>Aplicație Vue Chat</h1>
    <p>O aplicație simplă de chat în timp real folosind Vue.js și WebSockets</p>
    
    <div class="actions">
      <router-link v-if="isAuthenticated" to="/chat" class="primary-btn">Intră în Chat</router-link>
      <template v-else>
        <router-link to="/login" class="primary-btn">Autentificare</router-link>
        <router-link to="/register" class="primary-btn">Creare cont</router-link>
      </template>
      <button v-if="isAuthenticated" @click="logout" class="secondary-btn">Deconectare</button>
    </div>
    
    <div class="features">
      <div class="feature">
        <h3>Mesagerie în timp real</h3>
        <p>Comunică instant cu alți utilizatori fără a reîncărca pagina.</p>
      </div>
      <div class="feature">
        <h3>Autentificare securizată</h3>
        <p>Sistem de autentificare cu OTP pentru conexiuni sigure.</p>
      </div>
      <div class="feature">
        <h3>Tehnologii moderne</h3>
        <p>Construit cu Vue.js, Vuex și backend Go cu WebSockets.</p>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'HomeView',
  computed: {
    ...mapGetters('auth', [
      'isAuthenticated'
    ])
  },
  methods: {
    ...mapActions('auth', [
      'logout'
    ]),
    async logout() {
      await this.$store.dispatch('auth/logout');
      this.$router.push('/login');
    }
  }
}
</script>

<style scoped lang="less">
.home {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

h1 {
  color: #42b983;
  margin-bottom: 10px;
}

p {
  margin-bottom: 30px;
}

.actions {
  margin: 40px 0;
  display: flex;
  gap: 15px;
  justify-content: center;
}

.primary-btn, .secondary-btn {
  display: inline-block;
  padding: 12px 24px;
  border-radius: 4px;
  text-decoration: none;
  font-weight: bold;
  transition: background-color 0.3s;
  border: none;
  font-size: 16px;
  cursor: pointer;
}

.primary-btn {
  background-color: #42b983;
  color: white;
}

.primary-btn:hover {
  background-color: #3ba776;
}

.secondary-btn {
  background-color: #e74c3c;
  color: white;
}

.secondary-btn:hover {
  background-color: #c0392b;
}

.features {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  margin-top: 50px;
}

.feature {
  flex-basis: 30%;
  padding: 20px;
  background-color: #f8f8f8;
  border-radius: 8px;
  margin-bottom: 20px;
}

.feature h3 {
  color: #2c3e50;
  margin-top: 0;
}

@media (max-width: 768px) {
  .feature {
    flex-basis: 100%;
  }
  
  .actions {
    flex-direction: column;
    align-items: center;
  }
}
</style>