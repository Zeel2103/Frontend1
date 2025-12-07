// src/composables/useCart.js
import { ref } from 'vue'

// Create a reactive cart object to store the shopping cart data
const cart = ref({}) // 

// Get the quantity of a specific lesson in the cart
function qty(id) {
  return cart.value[id] ?? 0
}

// Add one item of a specific lesson to the cart
function add(id) {
  // The quantity for this lesson ID is set to current quantity + 1
  cart.value[id] = qty(id) + 1
}

// Checks if lesson is in cart and decreases quantity by 1 
function remove(id) {
  if (!cart.value[id]) return
  cart.value[id]--
  if (cart.value[id] <= 0) delete cart.value[id]
}

// Remove all items
function clearCart() {
  cart.value = {}
}

// Returns an object containing cart data and functions
export function useCart() {
  return { cart, qty, add, remove, clearCart }
}
