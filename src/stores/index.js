import { createStore } from 'vuex';
import router from '@/router';
import axios from 'axios';
import { API_BASE_URL } from '../config/configure'; // Assuming you have a configuration file for API base URL

const store = createStore({
  state: {
    user: null,
    error: null,
  },
  mutations: {
    SET_USER(state, user) {
      state.user = user;
    },
    SET_ERROR(state, error) {
      state.error = error;
    },
  },
  actions: {
    async getUser({ commit }, userId) {
      try {
        const response = await axios.get(`${API_BASE_URL}/user/${userId}`);
        const userData = response.data
        if (userData) {
          commit('SET_USER', userData)
        }
        else {
          console.log("User id not found: ", userData)
        }
      } catch (error) {
        commit('SET_ERROR', error.response.data.message);
      }
    },
    async login({ commit }, credentials) {
      try {
        const response = await axios.post(`${API_BASE_URL}/login`, credentials);
        const userData = response.data;

        if (userData) {
          localStorage.setItem('userId', userData.userId);
          localStorage.setItem('isLoggedIn', 'true'); // Set isLoggedIn flag to true in localStorage
          commit('SET_USER', userData);

          if (userData.userRole === 'admin') {
            Swal.fire({
              position: "center",
              icon: "success",
              title: "You are login success!!",
              showConfirmButton: false,
              timer: 1500
            });
            router.push({ name: 'product' }); // Redirect admin to admin dashboard
          } else {
            Swal.fire({
              position: "center",
              icon: "error",
              title: "You are user, can't login!!",
              showConfirmButton: false,
              timer: 1500
            });
          }
        } else {
          console.error('User data is missing in the response');
        }
      } catch (error) {
        if (error.response.status === 401) {
          // Unauthorized - Incorrect password
          commit('SET_ERROR', 'Incorrect password. Please try again.');
          Swal.fire({
            position: "center",
            icon: "error",
            title: "please check password",
            showConfirmButton: false,
            timer: 1500
          });
        } else {
          commit('SET_ERROR', error.response.data.message);
        }
      }
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    },

    async logout({ commit }) {
      try {
        // Make a POST request to the logout endpoint
        await axios.post(`${API_BASE_URL}/logout`);

        // Remove isLoggedIn flag from localStorage
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('userId')

        // Commit null to the SET_USER mutation to clear the user state
        commit('SET_USER', null);
      } catch (error) {
        console.error('Logout failed:', error);
      }
    },
  },
  getters: {
    isLoggedIn: state => localStorage.getItem('isLoggedIn') === 'true', // Check if isLoggedIn flag is set to true in localStorage
    user: state => state.user,
    error: state => state.error,
  },
});

export default store;
