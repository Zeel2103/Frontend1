<script setup>

//import { ref } from 'vue'
import { useRouter } from 'vue-router'


// Import cart composable
import { ref, onMounted, computed } from 'vue'
import { useCart } from '../composables/useCart'

// API base URL for backend communication
const API_BASE = 'https://backend1-so5u.onrender.com'
const router = useRouter()

// Use the cart composable to access cart functionality
const { cart, clearCart, add, remove } = useCart()

const lessons = ref([])      // Array to store fetched lessons
const loading = ref(true)    // Loading state for API calls
const error = ref('')        // Error message storage

// Form fields for checkout details
const name = ref('')
const phone = ref('')
const email = ref('')
const address = ref('')

// General message for successful order
const orderMessage = ref('')

// Controls visibility of the success modal popup
const showSuccessModal = ref(false)

// Stores the order ID returned from the backend
const orderId = ref('') 

// Validation name must contain only letters and spaces
const validName = computed(() => /^[A-Za-z\s]+$/.test(name.value))
// Validation phone must contain only digits
const validPhone = computed(() => /^[0-9]+$/.test(phone.value))

// User can checkout only when there is a name, phone number and email provided
// And when there is at least one item in the cart
const canCheckout = computed(() =>
  validName.value &&
  validPhone.value &&
  email.value &&
  cartItems.value.length > 0
)


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

// Handles the checkout process
async function checkout() {
  // Reset error and success messages
  error.value = ''
  orderMessage.value = ''

  if (!canCheckout.value) {
    error.value = 'Please provide a valid name and phone number.'
    return
  }

  try {

    // Build order body from form + cart
    const orderBody = {
      name: name.value,
      phone: phone.value,
      email: email.value,
      address: address.value,
      items: cartItems.value.map(item => ({
        lessonId: item.id,
        quantity: item.quantity
      }))
    }

    // POST /orders to backend and MongoDb
    const res = await fetch(`${API_BASE}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderBody)
    })

    const data = await res.json()

    // Error message if order fails
    if (!res.ok || !data.success) {
      throw new Error(data.message || 'Order failed')
    }


    orderMessage.value = 'Order submitted successfully!' // Show success message
    showSuccessModal.value = true // Open success modal
    orderId.value = data.orderId // Save order ID from backend
    
    // Clear cart and refresh lessons
    clearCart()
    await fetchLessons()


  } catch (e) {
    console.error('Checkout error:', e)
    error.value = 'Failed to submit order. Please try again.'
  }
}

// Function to navigate back to other pages
function goToLessons() {
  showSuccessModal.value = false
  router.push('/Classes')  // Route to Classes page
}

function goToHome() {
  showSuccessModal.value = false
  router.push('/')  // Route to Home page
}


</script>

<template>
  <!-- Checkout container -->
  <section class="checkout">
    <h1>Your Basket</h1>

    <!-- Loading and error states -->
    <p v-if="loading">Loading basket…</p>
    <p v-else-if="error" class="error-msg" >{{ error }}</p>

    <p v-if="orderMessage" class="success-msg">{{ orderMessage }}</p>
    
    <!-- When data has finished loading -->
    <div v-if="!loading && !error">

      <!-- When cart has no items -->
      <p v-if="cartItems.length === 0&& !orderMessage">
        Your basket is empty.
      </p>

      <div class="checkout-content">
        <div class="cart-card">
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
        <!-- Checkout form section -->
        <div class="checkout-form-wrapper">
         <div class="checkout-form">
          <h2>Checkout</h2>


          <!-- Name field with validation message -->
          <div class="field">
            <label>Name</label>
            <input v-model="name" type="text" />
            <small v-if="name && !validName">
              Name must contain letters and spaces only.
            </small>
          </div>

          <!-- Phone field with validation message -->
          <div class="field">
            <label>Phone Number</label>
            <input v-model="phone" type="text" />
            <small v-if="phone && !validPhone">
              Phone Number must contain numbers only.
            </small>
          </div>

          <!-- Email field -->
          <div class="field">
            <label>Email</label>
            <input v-model="email" type="email" />
          </div>

          <!-- Address field -->
          <div class="field">
            <label>Address</label>
            <textarea v-model="address"></textarea>
          </div>

          <!-- Checkout button only enabled when valid -->
          <button
            class="checkout-btn"
            :disabled="!canCheckout"
            @click="checkout"
          >
            Checkout
          </button>

          <!-- Success/error messages -->
          <p v-if="orderMessage" class="success-msg">{{ orderMessage }}</p>
          <p v-if="error" class="error-msg">{{ error }}</p>
        </div>
       </div>
      </div>
    </div>
    
    <!-- Success Modal -->
    <div v-if="showSuccessModal" class="modal-overlay">
        <div class="modal-box">
            <h2>Order Successful!</h2>
            <p>Your order was submitted successfully. Thank you for your purchase!</p>
            <p v-if="orderId" class="order-id">Your Order ID is: {{ orderId }}</p>

            <!-- Button to take user back to classes and home page -->
            <button class="modal-btn" @click="goToLessons">
            Continue Shopping
            </button>

            <button class="modal-btn" @click="goToHome">
            Finished shopping
            </button>
        </div>
    </div>



  </section>
</template>



<style scoped>

/* Checkout container */
.checkout {
  padding: 1.5rem;
}

/* Card for the cart-table styling */
.cart-card {
  background: #ffffff;
  border-radius: 16px;
  padding: 1.25rem 1.5rem;
  box-shadow: 0 8px 20px rgba(15, 23, 42, 0.08);
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

/* Clear cart button styling */
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

/* Quantity button styling */
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


.checkout-form-wrapper {
  display: flex;
  justify-content: center;   
  align-items: flex-start;   
}

/* Layout wrapper for cart + form */
.checkout-content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.checkout-form {
  background: #ffffff;
  border-radius: 16px;
  padding: 1.25rem 1.5rem;
  box-shadow: 0 8px 20px rgba(15, 23, 42, 0.08);
  max-width: 480px;
}

.checkout-form h2 {
  margin-bottom: 0.75rem;
}

/* Form fields */
.field {
  margin-bottom: 0.8rem;
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.field label {
  font-weight: 600;
  font-size: 0.9rem;
  color: #374151;
}

.field input,
.field textarea {
  padding: 0.5rem 0.6rem;
  border-radius: 10px;
  border: 1px solid #d1d5db;
  font-size: 0.95rem;
  background: #f9fafb;
  transition: border-color 0.15s ease, box-shadow 0.15s ease, background 0.15s ease;
}

.field input:focus,
.field textarea:focus {
  outline: none;
  border-color: #4f46e5;
  background: #ffffff;
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.15);
}

.field small {
  font-size: 0.8rem;
  color: #b91c1c;
}


.checkout-btn {
  display: inline-block;
  padding: 15px 25px;
  font-size: 20px;
  cursor: pointer;
  text-align: center;
  color: #a78bfa;
  background-color: black;
  border: 2px solid #fff;
  border-radius: 15px;
  box-shadow: 5px 9px #a78bfa;
  transition: all 0.2s ease;
}

.checkout-btn:hover {
  box-shadow: 0px 5px #a78bfa;
  transform: translateY(4px);
}

.checkout-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  background-color: #333;
  color: #888;
  box-shadow: 2px 4px #666;
  transform: none;
}

.checkout-btn:disabled:hover {
  box-shadow: 2px 4px #666;
  transform: none;
}


/* On wider screens, put them side by side */
@media (min-width: 768px) {
  .checkout-content {
    flex-direction: row;
    align-items: flex-start;
  }

  .cart-card {
    flex: 2;
  }

  .checkout-form-wrapper {
    flex: 1;
  }
}

/* Messages */
.success-msg {
  margin-top: 1rem;
  padding: 0.75rem 1rem;
  background: #ecfdf5;
  color: #065f46;
  border: 1px solid #34d399;
  border-radius: 8px;
  font-weight: 600;
}

.error-msg {
  margin-top: 0.5rem;
  color: #b91c1c;
  font-size: 0.9rem;
}



.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}

.modal-box {
  background: #fff;
  padding: 2rem;
  width: 300px;
  border-radius: 8px;
  text-align: center;
}

.modal-btn {
  margin-top: 15px;
  padding: 10px;
  width: 100%;
  background: #4caf50;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}


</style>
