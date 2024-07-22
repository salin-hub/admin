<template>
    <section>
        <div class="list_product">
            <div class="list">
                <h1>Latest Product</h1>
            </div>
            <div class="line"></div>
            <div class="product_list">
                <div class="product" v-for="product in sortedProducts">
                    <div class="image_product">
                        <img :src="product.image" alt="">
                    </div>
                    <div class="product_detail">
                        <h2>{{ product.name }}</h2>
                        <p>{{ product.title }}</p>
                    </div>
                    <div class="rating">
                        <span v-for="i in Math.round(product.rate)" :key="i">
                            <i class="fas fa-star"></i>
                        </span>
                        <span v-for="i in Math.round(5 - product.rate)" :key="i">
                            <i class="far fa-star"></i>
                        </span>
                        ({{ product.rate }} reviews)
                    </div>
                    <div class="price">
                        <p>price: {{ product.price }}$</p>
                    </div>
                </div>
            </div>
        </div>
    </section>
    <section>
        <div v-for="category in categorys" :key="category" class="category">
            <h1>{{ category }}</h1>
            <div class="line"></div>
            <div class="product_list">
                <div class="product" v-for="product in sortedProductsByCategory[category]">
                    <div class="image_product">
                        <img :src="product.image" alt="">
                    </div>
                    <div class="product_detail">

                        <h2>{{ product.name }}</h2>
                        <p>{{ product.title }}</p>
                    </div>
                    <div class="rating">
                        <span v-for="i in Math.round(product.rate)" :key="i">
                            <i class="fas fa-star"></i>
                        </span>
                        <span v-for="i in Math.round(5 - product.rate)" :key="i">
                            <i class="far fa-star"></i>
                        </span>
                        ({{ product.rate }} reviews)
                    </div>
                    <div class="price">
                        <p>price: {{ product.price }}$</p>
                    </div>

                </div>
            </div>
        </div>
    </section>
</template>
    
  
<script>
import axios from 'axios';
import { API_BASE_URL } from '../config/configure'; // Adjust the path based on your project structure
export default {
    data() {
        return {
            selectedSortOption: 'default',
            currentSlide: 0,
            latestproduct: [],
            autoPlayInterval: null,
            categorys: ['Laptop', 'Desktop', 'Monitor', 'Gaming'],
        };
    },
    computed: {
        isFavorite() {
            return productId => this.$store.getters.isFavorite(productId);
        },
        sortedProducts() {
            if (Array.isArray(this.latestproduct)) {
                return [...this.latestproduct].slice().sort((a, b) => b._id - a._id);

            } else {
                console.error('latestproduct is not an array');
                return [];
            }
        },
        sortedProductsByCategory() {
            const sortedByCategory = {};
            this.categorys.forEach(category => {
                if (Array.isArray(this.latestproduct)) {
                    const productsInCategory = this.latestproduct.filter(product => product.category.toLowerCase() === category.toLowerCase());
                    sortedByCategory[category] = productsInCategory.slice().sort((a, b) => b._id - a._id);
                } else {
                    console.error('latestproduct is not an array');
                    sortedByCategory[category] = [];
                }
            });
            return sortedByCategory;
        },
    },
    created() {
        this.fetchproduct();
        // Automatically transition every 5 seconds
        this.autoPlayTimeout = setTimeout(this.nextSlide, 10000);
    },
    beforeDestroy() {
        // Clear the timeout when the component is destroyed
        clearTimeout(this.autoPlayTimeout);
    },
    methods: {
        async fetchproduct() {
            try {
                const response = await axios.get(`${API_BASE_URL}/products`);
                const products = response.data;
                // Sort the products by ID in ascending order
                products.sort((a, b) => b._id.localeCompare(a._id));
                this.latestproduct = products;
                this.products = response.data.map(product => ({ ...product, quantity: 0 })).reverse();
                this.loadingproduct = false;
            } catch (error) {
                console.error(error);
            }
        },
        toggleSeeMore(category) {
            this.$set(this.showMore, category, !this.showMore[category]);
        },
        handleImageError(product) {
            // Handle image load errors (e.g., replace with a placeholder)
            product.image = require('@/assets/image/error-placeholder.png');
        },
    }
};
</script>

  