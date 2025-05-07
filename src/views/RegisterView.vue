<template>
    <div class="register-container">
      <div class="register-form">
        <h2>Creare cont</h2>
        <div v-if="error" class="error-message">{{ error }}</div>
        <div v-if="success" class="success-message">{{ success }}</div>
        <form @submit.prevent="register">
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
            <label for="email">Email</label>
            <input 
              type="email" 
              id="email" 
              v-model="email" 
              placeholder="Introduceți adresa de email" 
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
          <div class="form-group">
            <label for="confirmPassword">Confirmă parola</label>
            <input 
              type="password" 
              id="confirmPassword" 
              v-model="confirmPassword" 
              placeholder="Confirmă parola" 
              required
            />
          </div>
          <button type="submit" class="register-button" :disabled="isLoading">
            {{ isLoading ? 'Se procesează...' : 'Creare cont' }}
          </button>
        </form>
        
        <div class="login-link">
          <p>Ai deja un cont? <router-link to="/login">Autentifică-te</router-link></p>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'RegisterView',
    data() {
      return {
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        error: '',
        success: '',
        isLoading: false,
        apiUrl: 'http://localhost:8080' // URL-ul explitcit către serverul Go
      }
    },
    methods: {
      async register() {
        this.error = '';
        this.success = '';
        
        // Validare parolă
        if (this.password !== this.confirmPassword) {
          this.error = 'Parolele nu se potrivesc';
          return;
        }
        
        this.isLoading = true;
        
        try {
          console.log(`Înregistrare la ${this.apiUrl}/register`);
          
          const response = await fetch(`${this.apiUrl}/register`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            },
            body: JSON.stringify({
              username: this.username,
              password: this.password,
              email: this.email
            }),
            mode: 'cors'
          });
          
          const data = await response.json();
          
          if (response.ok) {
            this.success = 'Cont creat cu succes! Redirecționare către login...';
            console.log('User înregistrat cu succes:', data);
            
            // Redirecționare către login după 2 secunde
            setTimeout(() => {
              this.$router.push('/login');
            }, 2000);
          } else {
            this.error = data.message || 'Eroare la înregistrare';
          }
        } catch (err) {
          console.error('Eroare înregistrare:', err);
          this.error = 'Eroare de conexiune. Verificați dacă serverul rulează.';
        } finally {
          this.isLoading = false;
        }
      }
    }
  }
  </script>
  
  <style scoped lang="less">
  .register-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 80vh;
  }
  
  .register-form {
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
  
  .register-button {
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
  
  .register-button:hover {
    background: #3ba776;
  }
  
  .register-button:disabled {
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
  
  .success-message {
    color: #27ae60;
    margin-bottom: 15px;
    background: #f6fef9;
    padding: 10px;
    border-radius: 4px;
    border-left: 4px solid #27ae60;
  }
  
  .login-link {
    margin-top: 20px;
    text-align: center;
    
    p {
      margin: 0;
      color: #666;
    }
    
    a {
      color: #42b983;
      text-decoration: none;
      font-weight: bold;
    }
    
    a:hover {
      text-decoration: underline;
    }
  }
  </style>