<template>
    <div>
        <h1>Product List</h1>
        <div class="search-bar">
            <div class="search-style">
                <input v-model="searchQuery" type="text" id="search" @input="filterProducts"
                    placeholder="Searching product......" />
                <label for="search">Search</label>
            </div>
        </div>
        <div class="list_product">
            <table class="table_list">
                <thead>
                    <tr>
                        <th>Image</th>
                        <th>Name</th>
                        <th>Title</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="product in filteredProducts" :key="product._id">
                        <td class="image_thumnail">
                            <div class="thumbnail">
                                <img :src="product.image" alt="Product Image" />
                            </div>
                        </td>
                        <td>
                            <div class="title_txt">
                                <h1>{{ product.name }}</h1>
                            </div>
                        </td>
                        <td>
                            <div class="title_txt">
                                <p>{{ product.title }}</p>
                            </div>
                        </td>
                        <td>
                            <div class="action-container-update">
                                <button class="btn" @click="openUpdateModal(product)">Update</button>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- Modal for Update -->
        <div class="popup_update" v-if="isModalOpen">
            <div class="modal-content">
                <h1>Update Product</h1>
                <form v-if="selectedProductForUpdate" @submit.prevent="updateProduct(selectedProductForUpdate._id)">
                    <div class="create_item">
                        <div class="create_1">
                            <div class="form-group">
                                <label for="updateName">Product Name:</label>
                                <input type="text" v-model="selectedProductForUpdate.name" id="updateName" required>
                            </div>
                            <div class="form-group">
                                <label for="updateTitle">Title:</label>
                                <textarea type="text" v-model="selectedProductForUpdate.title" id="updateTitle"
                                    required></textarea>
                            </div>
                            <div class="form-group">
                                <label for="updateRate">Rate:</label>
                                <input type="text" v-model="selectedProductForUpdate.rate" id="updateTitle" required>
                            </div>
                            <div class="form-group">
                                <label for="updatePrice">Price:</label>
                                <input type="text" v-model="selectedProductForUpdate.price" id="updateTitle" required>
                            </div>
                            <div class="form-group">
                                <label for="updateYear">Year:</label>
                                <input type="text" v-model="selectedProductForUpdate.year" id="updateTitle" required>
                            </div>
                            <div class="form-group">
                                <label for="updatemodel">Model:</label>
                                <input type="text" v-model="selectedProductForUpdate.model" id="updateTitle" required>
                            </div>
                            <div class="form-group">
                                <label for="updateCategory">Category:</label>
                                <input type="text" v-model="selectedProductForUpdate.category" id="updateTitle"
                                    required>
                            </div>
                            <div class="form-group">
                                <label for="updateImage">Image:</label>
                                <input type="text" v-model="selectedProductForUpdate.image" id="updateTitle" required>
                            </div>
                        </div>
                        <div class="create_1">
                            <div class="view_image">
                                <img v-if="selectedProductForUpdate.image" :src="selectedProductForUpdate.image" alt="">
                            </div>
                        </div>

                    </div>
                    <div class="controll">
                        <button type="button" @click="closeModal" class="bg-danger">Cancel</button>
                        <button type="submit">Update</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script>
import { API_BASE_URL } from '@/config/configure';
import axios from 'axios';

export default {
    data() {
        return {
            products: [],
            searchQuery: '',
            isModalOpen: false, // Initialize to false
            selectedProductForUpdate: null,
        };
    },
    computed: {
        filteredProducts() {
            const query = this.searchQuery.toLowerCase();
            return this.products.filter(
                (product) =>
                    product.name.toLowerCase().includes(query) ||
                    product.title.toLowerCase().includes(query) ||
                    product.model.toLowerCase().includes(query)
            );
        },
    },
    mounted() {
        this.fetchProducts();
    },
    methods: {
        async fetchProducts() {
            try {
                const response = await axios.get(`${API_BASE_URL}/products`);
                const products = response.data;
                // Assigning sorted products to the data property
                this.products = products;

                console.log(products);
            } catch (error) {
                console.error('Error fetching products:', error.message);
                // Optionally, you can also log error.response.data or error.response.status for more details.
            }
        },


        filterProducts() {
            const query = this.searchQuery.toLowerCase();
            return this.products.filter(
                (product) =>
                    product.name.toLowerCase().includes(query) ||
                    product.title.toLowerCase().includes(query)
            );
        },

        openUpdateModal(product) {
            this.selectedProductForUpdate = { ...product }; // Make a copy of the product
            this.isModalOpen = true; // Open the modal
        },

        closeModal() {
            this.isModalOpen = false;
            this.selectedProductForUpdate = null;
        },

        async updateProduct(productId) {
            try {
                const response = await axios.put(`${API_BASE_URL}/products/${productId}`, this.selectedProductForUpdate);
                console.log('Product updated successfully:', response.data);
                this.closeModal();
                this.fetchProducts(); // Refresh the product list
            } catch (error) {
                console.error('Error updating product:', error);
            }
        }
    },
};
</script>