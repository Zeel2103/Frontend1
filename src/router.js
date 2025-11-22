import { createRouter, createWebHistory } from 'vue-router'
import Home from './components/Home.vue'
import Classes from './components/Classes.vue'
import Checkout from './components/Checkout.vue'

const routes = [
  { path: '/', name: 'home', component: Home },
  { path: '/classes', name: 'classes', component: Classes },
  { path: '/Checkout', name: 'checkout', component: Checkout }
]

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})
