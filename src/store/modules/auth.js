export default {
    namespaced: true,
    state: {
      otp: localStorage.getItem('otp') || null,
      isAuthenticated: !!localStorage.getItem('otp')
    },
    getters: {
      isAuthenticated: state => state.isAuthenticated,
      getOtp: state => state.otp
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
      }
    },
    actions: {
      login({ commit }, { otp }) {
        commit('SET_OTP', otp);
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