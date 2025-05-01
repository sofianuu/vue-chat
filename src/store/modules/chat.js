export default {
  namespaced: true,
  state: {
    socket: null,
    isConnected: false,
    messages: [],
    reconnectAttempts: 0
  },
  getters: {
    isConnected: state => state.isConnected,
    messages: state => state.messages
  },
  mutations: {
    SET_SOCKET(state, socket) {
      state.socket = socket;
    },
    SET_CONNECTED(state, status) {
      state.isConnected = status;
    },
    ADD_MESSAGE(state, message) {
      state.messages.push(message);
    },
    CLEAR_MESSAGES(state) {
      state.messages = [];
    },
    INCREMENT_RECONNECT_ATTEMPTS(state) {
      state.reconnectAttempts++;
    },
    RESET_RECONNECT_ATTEMPTS(state) {
      state.reconnectAttempts = 0;
    }
  },
  actions: {
    connectWebSocket({ commit, dispatch, state, rootGetters }) {
      // Verifică dacă există un OTP valid
      const otp = rootGetters['auth/getOtp'];
      if (!otp) {
        console.error('Nu există OTP valid pentru conexiunea WebSocket');
        return;
      }

      // Închide orice conexiune existentă
      if (state.socket) {
        state.socket.close();
      }
      
      // Folosește OTP-ul în URL-ul de conectare WebSocket
      const wsUrl = `ws://localhost:8080/ws?otp=${otp}`;
      console.log('Încercare de conectare la:', wsUrl);
      
      const socket = new WebSocket(wsUrl);
      
      socket.onopen = () => {
        commit('SET_CONNECTED', true);
        commit('RESET_RECONNECT_ATTEMPTS');
        console.log('WebSocket conectat cu succes la:', wsUrl);
      };
      
      socket.onmessage = (event) => {
        const messageData = event.data;
        console.log('Mesaj primit:', messageData);
        
        // Adaugă mesajul în lista de mesaje
        const message = {
          text: messageData,
          isSelf: false,
          timestamp: new Date().toLocaleTimeString()
        };
        commit('ADD_MESSAGE', message);
      };
      
      socket.onclose = (event) => {
        commit('SET_CONNECTED', false);
        console.log('WebSocket deconectat. Cod:', event.code, 'Motiv:', event.reason);
        
        // Dacă deconectarea este din cauza autentificării (cod 1008)
        if (event.code === 1008) {
          console.error('Autentificare invalidă. Ești redirecționat către pagina de login.');
          dispatch('auth/logout', {}, { root: true });
          // Redirectionează la login (ar trebui folosit router, dar acesta e un workaround)
          window.location.href = '/#/login';
          return;
        }
        
        // Încearcă reconectarea după un delay
        scheduleReconnect();
      };
      
      socket.onerror = (error) => {
        console.error('Eroare WebSocket:', error);
        commit('SET_CONNECTED', false);
      };
      
      commit('SET_SOCKET', socket);
      
      // Funcție pentru reconectare cu backoff exponențial
      const scheduleReconnect = () => {
        commit('INCREMENT_RECONNECT_ATTEMPTS');
        const delay = Math.min(30000, Math.pow(2, state.reconnectAttempts) * 1000);
        console.log(`Încercare de reconectare în ${delay/1000} secunde (încercarea ${state.reconnectAttempts})`);
        
        setTimeout(() => {
          dispatch('connectWebSocket');
        }, delay);
      }
    },
    
    disconnectWebSocket({ commit, state }) {
      if (state.socket) {
        state.socket.close();
        commit('SET_SOCKET', null);
        commit('SET_CONNECTED', false);
      }
    },
    
    sendMessage({ commit, state }, message) {
      if (!message.trim() || !state.isConnected) {
        return;
      }
      
      console.log('Trimit mesaj:', message);
      state.socket.send(message);
      
      // Adaugă mesajul în lista locală
      commit('ADD_MESSAGE', {
        text: message,
        isSelf: true,
        timestamp: new Date().toLocaleTimeString()
      });
    },
    
    clearMessages({ commit }) {
      commit('CLEAR_MESSAGES');
    }
  }
};