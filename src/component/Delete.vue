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
                            <div class="action-container-delete">
                                <button class="btn" @click="confirmDelete(product._id)">Delete</button>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
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
            openUpdate: false,
            selectedProductForUpdate: null,
        };
    },
    computed: {
        filteredProducts() {
            const query = this.searchQuery.toLowerCase();
            return this.products.filter(
                (product) =>
                    product.name.toLowerCase().includes(query) ||
                    product.title.toLowerCase().includes(query)||
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
                this.products = response.data;
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        },

        async deleteProduct(productId) {
            try {
                await axios.delete(`${API_BASE_URL}/products/${productId}`);
                this.fetchProducts();
            } catch (error) {
                console.error('Error deleting product:', error);
            }
        },

        async confirmDelete(bannerId) {
      const result = await Swal.fire({
        title: 'Are you sure?',
        text: 'Do you want to delete this product?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'No, cancel!',
      });

      if (result.isConfirmed) {
        this.deleteProduct(bannerId);
      }
    },

        filterProducts() {
            const query = this.searchQuery.toLowerCase();
            return this.products.filter(
                (product) =>
                    product.name.toLowerCase().includes(query) ||
                    product.title.toLowerCase().includes(query)
            );
        }
    },
};
</script>
