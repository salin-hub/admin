<template>
  <div class="banner-table">
    <h1>Banner List</h1>
    <div class="addbanners">
      <button class="btn bg-success" @click="showModal = true">Add Banner</button>
    </div>
    <div class="list_product">
      <table class="table_list">
        <thead>
          <tr>
            <th>Image</th>
            <th>Title</th>
            <th>Description</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="banner in banners" :key="banner._id">
            <td class="image_thumbnail">
              <div class="thumbnail">
                <img :src="banner.image" :alt="banner.title" />
              </div>
            </td>
            <td>
              <div class="title_txt">
                <h1>{{ banner.title }}</h1>
              </div>
            </td>
            <td>
              <div class="title_txt">
                <h1>{{ banner.description }}</h1>
              </div>
            </td>
            <td>
              <div class="action_button">
                <button @click="editBanner(banner)" class="btn bg-success">Update</button>
                <button @click="confirmDelete(banner._id)" class="btn bg-danger">Delete</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>

    <!-- Update Modal -->
    <div v-if="showUpdateModal" class="popup_update">
      <div class="modal-content">
        <h1>Update Banner</h1>
        <form @submit.prevent="updateBanner">
          <div class="create_item">
            <div class="create_1">
              <div class="form-group">
                <label for="title">Title:</label>
                <input type="text" v-model="currentBanner.title" required />
              </div>
              <div class="form-group">
                <label for="description">Description:</label>
                <input type="text" v-model="currentBanner.description" />
              </div>
              <div class="form-group">
                <label for="image">Image URL:</label>
                <input type="text" v-model="currentBanner.image" required />
              </div>
            </div>
            <div class="create_1">
              <div class="view_image">
                <img :src="currentBanner.image" v-if="currentBanner.image" />
              </div>
            </div>
          </div>
          <div class="controll">
            <button @click="closeUpdateModal" class="btn bg-danger">Close</button>
            <button type="submit" class="btn bg-success">Update Banner</button>
          </div>
        </form>
      </div>
    </div>
    <!-- Add banner -->
    <div v-if="showModal" class="popup_update">
      <div class="modal-content">
        <AddBanners @close="closeAddPopup" />
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { API_BASE_URL } from '@/config/configure';
import AddBanners from './addBanners.vue';

export default {
  components: {
    AddBanners
  },
  data() {
    return {
      showModal: false,
      banners: [],
      errorMessage: '',
      showUpdateModal: false,
      currentBanner: null,
    };
  },
  created() {
    this.fetchBanners();
  },
  methods: {
    async fetchBanners() {
      try {
        const response = await axios.get(`${API_BASE_URL}/banners`);
        this.banners = response.data;
      } catch (error) {
        this.errorMessage = 'Error fetching banners';
        console.error('Error fetching banners:', error);
      }
    },
    async deleteBanner(id) {
      try {
        await axios.delete(`${API_BASE_URL}/banners/${id}`);
        this.banners = this.banners.filter(banner => banner._id !== id);
      } catch (error) {
        this.errorMessage = 'Error deleting banner';
        console.error('Error deleting banner:', error);
      }
    },
    async confirmDelete(bannerId) {
      const result = await Swal.fire({
        title: 'Are you sure?',
        text: 'Do you want to delete this banner?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'No, cancel!',
      });

      if (result.isConfirmed) {
        this.deleteBanner(bannerId);
      }
    },
    editBanner(banner) {
      this.currentBanner = { ...banner }; // Create a copy of the banner
      this.showUpdateModal = true;
    },
    async updateBanner() {
      try {
        const response = await axios.put(`${API_BASE_URL}/banners/${this.currentBanner._id}`, this.currentBanner);
        const updatedBannerIndex = this.banners.findIndex(banner => banner._id === this.currentBanner._id);
        if (updatedBannerIndex !== -1) {
          this.banners.splice(updatedBannerIndex, 1, response.data);
        }
        this.closeUpdateModal();
        this.fetchBanners();
      } catch (error) {
        this.errorMessage = 'Error updating banner';
        console.error('Error updating banner:', error);
      }
    },
    closeUpdateModal() {
      this.showUpdateModal = false;
      this.currentBanner = null;
    },
    closeAddPopup() {
      this.showModal = false;
      this.fetchBanners();
    }
  },
};
</script>

<style scoped>
/* Add your CSS styles here */
</style>
