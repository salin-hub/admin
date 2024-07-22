<template>
  <div class="login_page">
    <div class="form">
      <div class="login_image">
        <img src="../assets/image/image.png" alt="">
      </div>
      <div class="title">
        <p>Admin</p>
      </div>
      <div class="input_feil">
        <input v-model="email" type="text" placeholder="Email" required>
        <input v-model="password" type="password" placeholder="Password" required>
        <button @click="login">Login</button>
        <p v-if="error" style="color: red;">{{ error }}</p>
      </div>
    </div>

  </div>
</template>

<script>
export default {
  data() {
    return {
      email: '',
      password: '',
    };
  },
  computed: {
    error() {
      return this.$store.getters.error;
    },
  },
  methods: {
    async login() {
      if (!this.email || !this.password) {
        this.$store.commit('SET_ERROR', 'Please provide both email and password.');
        return;
      }

      const credentials = {
        email: this.email,
        password: this.password,
      };

      await this.$store.dispatch('login', credentials);
      if (!this.$store.getters.error) {
        // If no error, you can handle the user role here

        const userRole = this.$store.getters.user.userRole; // Assuming user role is stored in a 'role' property
        // console.log(userRole)
      }
    },
  },
};
</script>
