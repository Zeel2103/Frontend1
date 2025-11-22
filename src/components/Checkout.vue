<script setup>

//import { ref } from 'vue'
import { RouterLink } from 'vue-router'


// Import cart composable
import { ref, onMounted, computed } from 'vue'
import { useCart } from '../composables/useCart'

// API base URL for backend communication
const API_BASE = 'https://backend1-so5u.onrender.com'

// Use the cart composable to access cart functionality
const { cart, clearCart, add, remove } = useCart()

const lessons = ref([])      // Array to store fetched lessons
const loading = ref(true)    // Loading state for API calls
const error = ref('')        // Error message storage

// Fetches lessons
async function fetchLessons() {
  loading.value = true
  error.value = ''
  try {
    const res = await fetch(`${API_BASE}/lessons`)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const data = await res.json()
    lessons.value = data
  } catch (e) {
    console.error(e)
    error.value = 'Failed to load basket details.'
  } finally {
    loading.value = false
  }
}

onMounted(fetchLessons)

// Computed property that creates cart items with lesson data and cart quantities
const cartItems = computed(() => {
    // Process each lesson to see if it's in the cart
    return lessons.value
    .map((lesson) => {
      const id = lesson._id ?? lesson.id        
      const quantity = cart.value[id] ?? 0 // Check which of the lessons are in the cart and the quantity (0 if not in cart)
      
      if (!quantity) {
        return null  
      }

      // Get lesson details
      const subject = lesson.Subject //?? lesson.subject
      const price = Number(lesson.Price) //?? lesson.price)
      const location = lesson.Location //?? lesson.location
      
      const available = lesson.AvailableInventory

      // Calculate total cost for this item: price × quantity
      const subtotal = price * quantity

      // Return a complete cart object
      return { id, subject, location, price, quantity, subtotal, available }
    })
    .filter(Boolean) // Remove all the items not in the cart
})

// Functions to increase and decrease quantity of an item in the basket
// Item quantity in cart cannot increase Available inventory
const increaseQty = (item) => {
  if (item.quantity >= item.available) return
  add(item.id)
}

const decreaseQty = (item) => {
  remove(item.id)  
}

// Computed property that adds up all the subtotals
const total = computed(() =>
  cartItems.value.reduce((sum, item) => sum + item.subtotal, 0)
)
</script>

<template>
  <!-- Checkout container -->
  <section class="checkout">
    <h1>Your Basket</h1>

    <p v-if="loading">Loading basket…</p>
    <p v-else-if="error">{{ error }}</p>

    <!-- When data loads -->
    <div v-else>

      <!-- When cart has no items -->
      <p v-if="cartItems.length === 0">
        Your basket is empty.
      </p>

      <div v-else>
        <!-- Cart items table -->
        <table class="cart-table">
          <thead>
            <tr>
              <th>Lesson</th>
              <th>Location</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Subtotal</th>
            </tr>
          </thead>
          <tbody>
             <!-- Loop through each cart item -->
            <tr v-for="item in cartItems" :key="item.id">
              <td>{{ item.subject }}</td>
              <td>{{ item.location }}</td>
              <td>£{{ item.price.toFixed(2) }}</td>
              <!-- Decrease and Increase quantity controls -->
              <td class="qty-cell">
                <button
                  class="qty-btn"
                  @click="decreaseQty(item)"
                >
                  –  <!-- Minus symbol -->
                </button>
                <!-- Show current quantity -->
                <span class="qty-value">{{ item.quantity }}</span>
                <button
                  class="qty-btn"
                  @click="increaseQty(item)"
                  :disabled="item.quantity >= item.available"
                >
                  +  <!-- Plus symbol -->
                </button>
              </td>
              <td>£{{ item.subtotal.toFixed(2) }}</td>
            </tr>
          </tbody>
        </table>

        <!-- Shows total cost and clear cart button -->
        <div class="cart-total">
          <p><strong>Total: £{{ total.toFixed(2) }}</strong></p>
          <!-- Removes all items from cart when clicked -->
          <button 
            class="clear-btn" 
            @click="clearCart"
          >
            Clear basket
          </button>
        </div>
      </div>
    </div>
  </section>
</template>



<style scoped>
/* Checkout container */
.checkout {
  padding: 1.5rem;
}


/* Cart table styling */
.cart-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 1rem;
}

.cart-table th,
.cart-table td {
  border-bottom: 1px solid #e0e0e0;
  padding: 0.6rem 0.4rem;
  text-align: left;
}

.cart-table th {
  font-weight: 600;
}

.cart-total {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 0.5rem;
}

.clear-btn {
  background-color: white;
  padding: 0.6rem 1rem;
  font-size: 0.95rem;
  cursor: pointer;
  color: black;
  border: 2px solid rgba(184, 175, 218, 0.6);
  border-radius: 10px;
  box-shadow: 4px 7px #b8afda;
}

.clear-btn:hover {
  box-shadow: 0px 4px #a78bfa;
  transform: translateY(2px);
}

.qty-cell {
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.qty-btn {
  width: 2rem;
  height: 2rem;
  border-radius: 8px;
  border: none;
  background: #020066;
  color: #fff;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
}

.qty-btn:disabled {
  opacity: 0.4;
  cursor: default;
}

.qty-value {
  min-width: 1.5rem;
  text-align: center;
  font-weight: 600;
}

</style>
