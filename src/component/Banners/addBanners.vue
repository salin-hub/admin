<template>
  <div class="add-banner">
    <h1>Add Banner</h1>
    <form @submit.prevent="addBanner">
      <div class="create_item">
        <div class="create_1">
      <div class="form-group">
        <label for="title">Title:</label>
        <input type="text" v-model="newBanner.title" required />
      </div>
      <div class="form-group">
        <label for="description">Description:</label>
        <input type="text" v-model="newBanner.description" required />
      </div>
      <div class="form-group">
        <label for="imageUrl">Image URL:</label>
        <input type="text" v-model="newBanner.image" required />
      </div>    
    </div>
    <div class="create_1">
      <div class="view_image">
          <img :src="newBanner.image" :alt="newBanner.title" />
        </div>
    </div>
      </div>
      <div class="controll">
      <button @click="closeAddPopup" class="btn bg-danger">Close</button>
      <button type="submit" class="btn bg-success">Add Banner</button>
    </div>
    </form>
    <div v-if="successMessage" class="success-message">{{ successMessage }}</div>
    <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      newBanner: {
        title: '',
        description: '',
        image: '',
      },
      successMessage: '',
      errorMessage: '',
    };
  },
  methods: {
    async addBanner() {
      try {
        const response = await axios.post('http://localhost:3000/banners', this.newBanner);
        this.successMessage = 'Banner added successfully!';
        this.errorMessage = '';
        this.resetForm();
        this.closeAddPopup();
      } catch (error) {
        this.errorMessage = 'Error adding banner: ' + error.response.data.message;
        this.successMessage = '';
      }
    },
    resetForm() {
      this.newBanner.title = '';
      this.newBanner.description = '';
      this.newBanner.imageUrl = '';
    },
    closeAddPopup() {
      // Logic to close the banner, e.g., setting a data property to false
      this.$emit('close'); // Example: emit an event to the parent component
    }
  },
};
</script>

<style scoped>
/* Add your styles here */
</style>
