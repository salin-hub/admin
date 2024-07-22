<template>
    <div class="popup">
        <div class="popup_inner">
            <h1>Admin Product Creation</h1>
            <form @submit.prevent="addProduct">
                <div class="create_item">
                    <div class="create_1">
                        <div class="form-group">
                            <label for="name">Product Name:</label>
                            <input v-model="formData.name" type="text" placeholder="Enter product name..." id="name"
                                required>
                        </div>
                        <div class="form-group">
                            <label for="rate">Rate:</label>
                            <input v-model.number="formData.rate" type="text" placeholder="Enter rate..." id="rate"
                                required>
                        </div>
                        <div class="form-group">
                            <label for="title">Title:</label>
                            <textarea v-model="formData.title" placeholder="Enter titles..." required></textarea>
                        </div>
                        <div class="form-group">
                            <label for="price">Price:</label>
                            <input v-model.number="formData.price" type="number" placeholder="Enter price..." id="price"
                                required>
                        </div>
                        <div class="form-group">
                            <label for="year">Year:</label>
                            <input v-model.number="formData.year" type="text" placeholder="Enter year..." id="year"
                                required>
                        </div>
                        <div class="form-group">
                            <label for="model">Model:</label>
                            <input v-model="formData.model" type="text" placeholder="Enter model uppercase..." required>
                        </div>
                        <div class="form-group">
                            <label for="category">Category:</label>
                            <input v-model="formData.category" type="text" placeholder="Enter category..." required>
                        </div>
                        <div class="form-group">
                            <label for="image">Image URL:</label>
                            <input v-model="formData.image" required placeholder="URL image........."><br>
                        </div>
                    </div>
                    <div class="create_1">
                        <div class="view_image">
                            <img v-if="formData.image" :src="formData.image" alt="Product Image"><br>
                        </div>
                    </div>
                </div>
                <div class="controll">
                    <button type="button" @click="resetForm" class="bg-danger">Reset</button>
                    <button type="submit" :disabled="isLoading">Create</button>
                </div>
            </form>
            <div v-if="error" class="error">{{ error }}</div>
        </div>
    </div>
</template>
  
<script>
import axios from 'axios';
import { API_BASE_URL } from '@/config/configure';

export default {
    data() {
        return {
            formData: {
                name: '',
                rate: '',
                title: '',
                price: '',
                year: '',
                model: '',
                category: '',
                image: ''
            },
            isLoading: false,
            error: null
        };
    },
    methods: {
        async addProduct() {
            try {
                this.isLoading = true;
                this.error = null;

                // Validate form before making the request
                if (!this.validateForm()) {
                    this.isLoading = false;
                    return;
                }

                // The actual HTTP request
                const response = await axios.post(`${API_BASE_URL}/products`, this.formData);
                Swal.fire({
                    icon: "success",
                    title: "Done",
                    text: "Create product is success!",
                });
                this.resetForm()
            } catch (error) {
                console.error('Error adding product:', error);

            } finally {
                this.isLoading = false;
            }
        },
        validateForm() {
            return Object.values(this.formData).every(value => {
                if (typeof value === 'object') {
                    return Object.values(value).every(subValue => {
                        console.log(subValue); // Add this line
                        return subValue.trim() !== '';
                    });
                }
                console.log(value); // Add this line
                return value !== null && value !== undefined && value.toString().trim() !== '';
            });
        },
        resetForm() {
            this.formData = {
                name: '',
                rate: null,
                title: '',
                price: '',
                year: '',
                model: '',
                category: '',
                image: ''
            };
        }
    }
};
</script>
  