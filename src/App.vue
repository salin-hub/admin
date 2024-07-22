<template>
  <div class="wrapper">
    <div class="logo">
      <RouterLink to="/">
        <img src="@assets/image/logo.png" alt="">
      </RouterLink>
    </div>
    <div class="account">
      {{ console.log(isLoggedIn) }}
      <p v-if="!isLoggedIn">Login</p>
      <p v-else>
        <span v-if="user">
          Hello, {{ user.fullName }}
        </span>
      </p>
    </div>
  </div>
  <div class="item">
    <div class="all_item">
      <span><i class="fa-solid fa-shop"></i>
        <RouterLink to="/">PRODUCTS</RouterLink>
      </span>
      <span><i class="fa-solid fa-square-plus"></i>
        <RouterLink to="/create">CREATE</RouterLink>
      </span>
      <span><i class="fa-solid fa-pen-to-square"></i>
        <RouterLink to="/Update">UPDATE</RouterLink>
      </span>
      <span><i class="fa-solid fa-trash-can"></i>
        <RouterLink to="/Delete">DELETE</RouterLink>
      </span>
      <span><i class="fa-solid fa-list-check"></i>
        <RouterLink to="/order_product">ORDER LIST</RouterLink>
      </span>
      <span><i class="fa-solid fa-chart-line"></i>
        <RouterLink to="/graph">GRAPH</RouterLink>
      </span>
      <span><i class="fa-brands fa-slideshare"></i>
        <RouterLink to="/viewbanner">BANNER</RouterLink>
      </span>
      <div class="list_item">
        <div class="lines"></div>
        <span @click="handleLogout">
          <i class="fa-solid fa-right-from-bracket"></i>
          logout
        </span>
      </div>
    </div>
    <div class="route_item">
      <router-view ></router-view>
    </div>
  </div>
</template> 

<script>
import axios from 'axios';
import { API_BASE_URL } from './config/configure';
export default {
  computed: {
    isLoggedIn() {
      return this.$store.getters.isLoggedIn;
    },
    user() {
      return this.$store.state.user;
    },
  },
  methods: {
    async fetchUser() {
      try {
        const userId = localStorage.getItem('userId');
        const response = await axios.get(`${API_BASE_URL}/user/${userId}`);
        this.$store.commit('SET_USER', response.data.user);
      } catch (error) {
        if (error.response && error.response.status === 404) {
          console.error('User not found');
        } else {
          console.error('Error fetching user data:', error);
        }
      }
    },
    handleLogout() {
      // Dispatch the logout action from Vuex store
      this.$store.dispatch('logout')
        .then(() => {
          // After successful logout, you can redirect the user to the login page or perform any other necessary action
          // For example, you can redirect the user to the login page using Vue Router
          this.$router.push('/login');
        })
        .catch(error => {
          // Handle logout failure, if necessary
          console.error('Logout failed:', error);
        });
    },
  },
  created() {
    if (this.isLoggedIn && !this.user) {
      this.fetchUser();
    }
    
  },
}
</script>
