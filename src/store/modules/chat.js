export default {
  namespaced: true,
  state: {
    socket: null,
    isConnected: false,
    messages: [],
    reconnectAttempts: 0,
    username: localStorage.getItem('username') || 'Anonymous'
  },
  getters: {
    isConnected: state => state.isConnected,
    messages: state => state.messages,
    username: state => state.username
  },
  mutations: {
    SET_SOCKET(state, socket) {
      state.socket = socket;
    },
    SET_CONNECTED(state, status) {
      state.isConnected = status;
    },
    SET_USERNAME(state, username) {
      state.username = username;
      localStorage.setItem('username', username);
    }
    ,
    ADD_MESSAGE(state, message) {
      state.messages.push(message);
    },
    ADD_MESSAGES(state, messages) {
      state.messages = [...state.messages, ...messages];
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

      const username = rootGetters['auth/username'];
      if(username){
        commit('SET_USERNAME', username);
        console.log('Username setat:', username);
      }
      else{
       console.warn('Nu s-a putut obține username-ul din auth store');
      }

      // Închide orice conexiune existentă
      if (state.socket) {
        state.socket.close();
      }
      
      // Folosește OTP-ul în URL-ul de conectare WebSocket
      const wsUrl = `ws://localhost:88/ws?otp=${otp}`;
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
        console.log('Username utilizator curent:', username);

        try {
          const parsedData = JSON.parse(messageData);

          if(parsedData.type === "history" && Array.isArray(parsedData.messages)) {
            console.log('Istoric mesaje primit:', parsedData.messages);
           // console.log('Username mesaj istoric:', msg.username);
            const formattedMessages = parsedData.messages.map(msg => ({
              text: msg.content,
              isSelf: msg.username === state.username,
              timestamp: new Date(msg.timestamp).toLocaleString(),
              username: msg.username
            }));
            commit('ADD_MESSAGES', formattedMessages);
            return;
          }

          if(parsedData.username && parsedData.content) {
            const message = {
              text: parsedData.content,
              isSelf: parsedData.username === state.username,
              timestamp: new Date().toLocaleString(),
              username: parsedData.username
            };
            commit('ADD_MESSAGE', message);
            return;
          }

        }catch(e) {
          console.log('Mesajul nu este JSON, se trateaza ca text simplu');
        }

        
        
        // Adaugă mesajul în lista de mesaje
        const message = {
          text: messageData,
          isSelf: false,
          timestamp: new Date().toLocaleString(),
          username: 'Necunoscut'
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
      
      try {
    console.log('[DEBUG] Sending message through socket...');
    state.socket.send(message);
    console.log('[DEBUG] Message sent successfully');
  } catch (error) {
    console.error('[ERROR] Failed to send message:', error);
    return;
  }
      
      // Adaugă mesajul în lista locală
      commit('ADD_MESSAGE', {
        text: message,
        isSelf: true,
        timestamp: new Date().toLocaleString(),
        username: state.username
      });
    },
    
    clearMessages({ commit }) {
      commit('CLEAR_MESSAGES');
    }, 

    setUsername({ commit }, username) {
      commit('SET_USERNAME', username);
    }

  }
};