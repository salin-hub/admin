<template>
    <section>
        <div class="board_admin">
            <div class="title">
                <h2>Ordered list</h2>
            </div>
            <div class="list_product">
                <table class="table">
                    <thead class="table-primary">
                        <tr class="fw-bolder">
                            <th scope="col">ID</th>
                            <th scope="col">User</th>
                            <th scope="col">Product</th>
                            <th scope="col">Quantity</th>
                            <th scope="col">Price</th>
                            <th scope="col">Date</th>
                            <th scope="col">Status</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="order in orders" :key="order._id">
                            <th scope="row">{{ order.orderID }}</th>
                            <td><h1>{{ order.user.fullName }}</h1></td>
                            <td>{{ order.product?.name }}</td>
                            <td>{{ order.quantity }}</td>
                            <td class="text-danger">$ {{ order.totalPrice }}</td>
                            <td>{{ formatDate(order.orderDate)}}</td>
                            <td>{{ order.status }}</td>
                            <td>
                                <div class="action-container">
                                <button type="button" class="btn btn-success" :disabled="isOrderApproved(order._id)"
                                    @click="approveOrder(order._id)">Approve</button>

                                <button type="button" class="btn btn-danger" @click="rejectOrder(order._id)">Reject</button>
                            </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </section>
</template>

<script>
import { API_BASE_URL } from '@/config/configure';
import axios from 'axios';
export default {
    data() {
        return {
            orders: [],
            approvedOrders: new Set(JSON.parse(localStorage.getItem('approvedOrders')) || []), // Retrieve approved orders from localStorage
        };
    },
    mounted() {
        this.fetchOrders();
    },
    methods: {
        async fetchOrders() {
            try {
                const response = await axios.get(`${API_BASE_URL}/orderedItems`);
                this.orders = response.data;

                // Sort the orders by their orderDate in descending order
                this.orders.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));
            } catch (error) {
                console.error('Error fetching orders:', error);
            }
        },
        formatDate(dateString) {
            return new Date(dateString).toLocaleDateString();
        },

        async approveOrder(orderId) {
            try {
                // Send a PUT request to update the order status to 'approved'
                await axios.put(`${API_BASE_URL}/orders/${orderId}/status`, {
                    status: 'approved',
                    adminComments: 'Order approved by admin.',
                });

                // After updating the order status, refresh the list of orders
                this.fetchOrders();

                // Add the approved order ID to the set and update localStorage
                this.approvedOrders.add(orderId);
                localStorage.setItem('approvedOrders', JSON.stringify(Array.from(this.approvedOrders)));
            } catch (error) {
                console.error(`Error approving order with ID ${orderId}:`, error);
            }
        },
        isOrderApproved(orderId) {
            // Check if the order ID exists in the approvedOrders set
            return this.approvedOrders.has(orderId);
        },
        isOrderApproved(orderId) {
            // Check if the order ID exists in the approvedOrders set
            return this.approvedOrders.has(orderId);
        },

        async rejectOrder(orderId) {
            try {
                // Send a PUT request to update the order status to 'rejected'
                await axios.put(`${API_BASE_URL}/orders/${orderId}/status`, {
                    status: 'rejected',
                    adminComments: 'Order rejected by admin.',
                });

                // After updating the order status, refresh the list of orders
                this.fetchOrders();
            } catch (error) {
                console.error(`Error rejecting order with ID ${orderId}:`, error);
            }
        },
    },
};
</script>

<style scoped></style>