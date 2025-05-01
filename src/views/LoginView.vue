<template>
    <div class="login-container">
      <div class="login-form">
        <h2>Autentificare</h2>
        <div v-if="error" class="error-message">{{ error }}</div>
        <form @submit.prevent="login">
          <div class="form-group">
            <label for="username">Nume utilizator</label>
            <input 
              type="text" 
              id="username" 
              v-model="username" 
              placeholder="Introduceți numele de utilizator" 
              required
            />
          </div>
          <div class="form-group">
            <label for="password">Parolă</label>
            <input 
              type="password" 
              id="password" 
              v-model="password" 
              placeholder="Introduceți parola" 
              required
            />
          </div>
          <button type="submit" class="login-button" :disabled="isLoading">
            {{ isLoading ? 'Se procesează...' : 'Autentificare' }}
          </button>
        </form>
        
        <div class="server-info">
          <p>Server API: <span>http://localhost:8080</span></p>
          <p>Client: <span>http://localhost:8081</span></p>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'LoginView',
    data() {
      return {
        username: '',
        password: '',
        error: '',
        isLoading: false,
        apiUrl: 'http://localhost:8080' // URL-ul explicit către serverul Go
      }
    },
    methods: {
      async login() {
        this.error = '';
        this.isLoading = true;
        
        try {
          console.log(`Încercare de autentificare către ${this.apiUrl}/login`);
          
          const response = await fetch(`${this.apiUrl}/login`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            },
            body: JSON.stringify({
              username: this.username,
              password: this.password
            }),
            mode: 'cors' // Explicit setăm modul CORS
          });
          
          console.log('Răspuns primit:', response.status);
          
          if (response.ok) {
            const data = await response.json();
            console.log('OTP primit cu succes');
            
            // Stochează OTP-ul în localStorage și Vuex store
            localStorage.setItem('otp', data.otp);
            this.$store.dispatch('auth/login', { otp: data.otp });
            
            // Redirecționare către chat
            this.$router.push('/chat');
          } else {
            if (response.status === 401) {
              this.error = 'Nume utilizator sau parolă incorectă';
            } else {
              this.error = `Eroare server: ${response.status} ${response.statusText}`;
            }
          }
        } catch (err) {
          console.error('Eroare login:', err);
          this.error = 'Eroare de conexiune. Verificați dacă serverul rulează pe portul 8080.';
        } finally {
          this.isLoading = false;
        }
      }
    }
  }
  </script>
  
  <style scoped lang="less">
  .login-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 80vh;
  }
  
  .login-form {
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    padding: 30px;
    width: 350px;
    max-width: 100%;
  }
  
  h2 {
    color: #42b983;
    text-align: center;
    margin-bottom: 24px;
  }
  
  .form-group {
    margin-bottom: 20px;
  }
  
  label {
    display: block;
    margin-bottom: 8px;
    font-weight: bold;
    color: #333;
    text-align: left;
  }
  
  input {
    width: 100%;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 16px;
  }
  
  .login-button {
    background: #42b983;
    color: white;
    border: none;
    border-radius: 4px;
    padding: 12px 15px;
    font-size: 16px;
    cursor: pointer;
    width: 100%;
    transition: background-color 0.3s;
  }
  
  .login-button:hover {
    background: #3ba776;
  }
  
  .login-button:disabled {
    background: #a0cfbe;
    cursor: not-allowed;
  }
  
  .error-message {
    color: #e74c3c;
    margin-bottom: 15px;
    background: #fdf7f7;
    padding: 10px;
    border-radius: 4px;
    border-left: 4px solid #e74c3c;
  }
  
  .server-info {
    margin-top: 20px;
    padding-top: 15px;
    border-top: 1px solid #eee;
    font-size: 0.8em;
    color: #888;
    text-align: left;
    
    p {
      margin: 5px 0;
    }
    
    span {
      font-weight: bold;
      color: #666;
    }
  }
  </style>