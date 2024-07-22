import { createRouter, createWebHistory } from 'vue-router'
import product from '../component/products.vue'
import Orderproduct from '../component/Order_product.vue'
import Update from '../component/Update.vue'
import Delete from '../component/Delete.vue'
import create from '../component/Create.vue'
import graph from '../component/graph.vue'
import login from '../views/login.vue'
import store from '../stores/index'
import addBanners from "@/component/Banners/addBanners.vue"
import Viewbanner from '@/component/Banners/viewbanner.vue'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/login', name: 'login', component: login }, 
    {
      path: '/',
      name: 'product',
      component: product,
      meta: { requiresAuth: true }
    },
    {
      path: '/order_product',
      name: 'order',
      component: Orderproduct,
      meta: { requiresAuth: true }
    },
    {
      path: '/Update',
      name: 'Update',
      component: Update,
      meta: { requiresAuth: true }
    },
    {
      path: '/Delete',
      name: 'Delete',
      component: Delete,
      meta: { requiresAuth: true }
    },
    {
      path: '/Create',
      name: 'create',
      component: create,
      meta: { requiresAuth: true }
    },
    {
      path: '/graph',
      name: 'graph',
      component: graph,
      meta: { requiresAuth: true }
    },
    {
      path:'/banner',
      name:'banner',
      component: addBanners,
      meta:{requiresAuth:true}
    }
    ,{
      path:"/viewbanner",
      name:"viewbanner",
      component:Viewbanner,
      meta:{requiresAuth:true}
    }
  ]
})
router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth) {
    if (store.getters.isLoggedIn) {
      // Proceed if the user is logged in
      if (to.meta.requiresAdmin) {
        // Check if the user is an admin
        if (store.getters.user && store.getters.user.role === 'admin') {
          // If the user is an admin, allow access
          next({ name: 'product' });
        } else {
          // If the user is not an admin, redirect to login
          next({ name: 'login' });
        }
      } else {
        // If the route does not require admin role, allow access
        next();
      }
    } else {
      // Redirect to login if the user is not logged in
      next({ name: 'login' });
    }
  } else {
    // Proceed to the requested route if it doesn't require authentication
    next();
  }
});



export default router
