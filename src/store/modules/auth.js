export default {
    namespaced: true,
    state: {
      otp: localStorage.getItem('otp') || null,
      isAuthenticated: !!localStorage.getItem('otp')
    },
    getters: {
      isAuthenticated: state => state.isAuthenticated,
      getOtp: state => state.otp,
      username: state => state.username || localStorage.getItem('username')
    },
    mutations: {
      SET_OTP(state, otp) {
        state.otp = otp;
        state.isAuthenticated = !!otp;
        if (otp) {
          localStorage.setItem('otp', otp);
        } else {
          localStorage.removeItem('otp');
        }
      },
      SET_USERNAME(state, username) {
        state.username = username;
        if(username) {
          localStorage.setItem('username', username);
        } else{
          localStorage.removeItem('username');
        }
      }
    },
    actions: {
      login({ commit }, { otp, username }) {
        commit('SET_OTP', otp);
        commit('SET_USERNAME', username);
      },
      logout({ commit }) {
        commit('SET_OTP', null);
      },
      checkAuth({ commit }) {
        const otp = localStorage.getItem('otp');
        if (otp) {
          commit('SET_OTP', otp);
        } else {
          commit('SET_OTP', null);
        }
      }
    }
  };