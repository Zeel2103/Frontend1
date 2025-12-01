

<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import { useCart } from '../composables/useCart'

// Backend API URL
const API_BASE = 'https://backend1-so5u.onrender.com'

const lessons = ref([]) // Array to store lesson data from API
const loading = ref(true)  // Loading state
const error = ref('')   // Error message

const searchLoading = ref(false) // Loading state for search
const hasSearched = ref(false) // Track if user has performed search


// Sorting state - default sort by subject in ascending order
const sortBy = ref('Subject')
const sortOrder = ref('asc')


const searchQuery = ref('') // Users search input
const searchResults = ref([]) // Store search results

const { cart, qty, add, remove } = useCart()


// Images fetched from backend
//const imgUrl = (file) => new URL(`../assets/${file}`, import.meta.url).href
const imgUrl = (file) => `${API_BASE}/images/${file}`

// Shows search results when available, otherwise shows all lessons
const displayedLessons = computed(() => {
  if (hasSearched.value && searchQuery.value) {
    return searchResults.value
  }
  return lessons.value
})

// Function to return the right lesson id
function lessonKey(l) {
  return l._id ?? l.id
}

// Get the quantity of the lesson currently in the basket
const basketQty = (l) => qty(lessonKey(l))
// Add one of this lesson to the basket
const addToBasket = (l) => add(lessonKey(l))
// Remove one of this lesson from the basket
const removeFromBasket = (l) => remove(lessonKey(l))


// Perform search when button is clicked
async function performSearch() {
  if (!searchQuery.value.trim()) {
    error.value = 'Please enter a search term'
    return
  }
  
  // Set loading states and reset previous values
  searchLoading.value = true
  hasSearched.value = true
  error.value = ''
  searchResults.value = []
  
  try {
    // Send GET request to /lessons/search endpoint
    const res = await fetch(
      `${API_BASE}/lessons/search?query=${encodeURIComponent(searchQuery.value)}`
    )
    
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    
    // Parse and store the search results
    const data = await res.json()
    searchResults.value = data
    
  } catch (e) {
    console.error('Search error:', e)
    //error.value = 'Failed to search lessons. Please try again.'
    searchResults.value = []  // Show empty array if no matching results found
    
  } finally {
    // Stop loading and hide the searching message
    searchLoading.value = false
  }
}

// Clear search and show all lessons
function clearSearch() {
  searchQuery.value = ''
  searchResults.value = []
  hasSearched.value = false
  error.value = ''
}

// Clear search results when search query box is empty
function clearIfEmpty() {
  if (!searchQuery.value.trim()) {
    clearSearch()
  }
}


// Fetch lessons from backend API
async function fetchLessons() {
  loading.value = true // Show loading state
  error.value = ''
  try {
     // Construct API URL with sorting parameters
    const res = await fetch(
      `${API_BASE}/lessons?sortBy=${encodeURIComponent(sortBy.value)}&order=${encodeURIComponent(sortOrder.value)}`
    )
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const data = await res.json()

    // Store the fetched data in lessons array
    lessons.value = data
  } catch (e) {
    console.error(e)
    error.value = 'Failed to load lessons.'
  } finally {
    loading.value = false
  }
}

// Whenever sortBy or sortOrder values change refetch data and display
watch([sortBy, sortOrder], () => {
  fetchLessons()
})

// Fetch initial lesson data when component loads
onMounted(fetchLessons)
</script>

<template>

<div class="search-controls">
    <div class="search-bar">
      <!-- Search will trigger when button is pressed
           Clear results when input is empty -->
      <input 
        type="text" 
        v-model="searchQuery" 
        placeholder="Search lessons by subject, location or description..."
        @keypress.enter="performSearch"
        @input="clearIfEmpty" 
        class="search-input"
      />
      <button @click="performSearch" class="search-btn">
        Search
      </button>
      <button @click="clearSearch" class="clear-btn">
        Clear
      </button>
    </div>
    <!-- Search results information display -->
    <p v-if="searchResults.length > 0" class="search-results-info">
      Found "{{ searchResults.length }}" Lessons 
    </p>
    <p v-else-if="searchQuery && !searchLoading && hasSearched" class="search-results-info">
      No lessons found for "{{ searchQuery }}"
 <!-- Show no results message when Search is not loading and 
      if user has performed a search but no results were found -->
    </p>
  </div>


<div class="sort-controls">
  <p>Sort by:</p>

  <!-- Dropdown to select which field to sort by -->
  <select v-model="sortBy">
      <option value="Subject">Subject</option>
      <option value="Location">Location</option>
      <option value="Price">Price</option>
      <option value="AvailableInventory">Spaces</option>
  </select>

   <!-- Dropdown to select sort direction -->
  <select v-model="sortOrder">
      <option value="asc">Ascending</option>
      <option value="desc">Descending</option>
  </select>

</div>

  <!-- Main lessons display section -->
  <section class="lessons">
    <p v-if="loading && !searchLoading">Loading lessons…</p>
    <p v-else-if="error">{{ error }}</p>

    <!-- v-else only renders when loading is false -->
    <ul v-else class="list">

      <!-- Loop through each lesson in displayedLessons array and displays them-->
      <li v-for="l in displayedLessons" :key="l.id" class="card">
        <img class="picture" :src="imgUrl(l.Image)" :alt="l.Subject" />
        <p><strong>Subject:</strong> {{ l.Subject }}</p>
        <p><strong>Location:</strong> {{ l.Location }}</p>
        <p><strong>Price:</strong> £{{ l.Price.toFixed(2) }}</p>   <!-- Format price to 2 decimal places -->
        <p><strong>Spaces:</strong> {{ l.AvailableInventory }}</p>
        <p class="desc">{{ l.Description }}</p>
        <div class="basket-controls">
          
  <button
    class="basket-btn"
    @click="removeFromBasket(l)"
    :disabled="basketQty(l) === 0"
  >
    –
  </button>

  <div class="basket-count">
    <div class="basket-number">{{ basketQty(l) }}</div>
    <div class="basket-label">in your basket</div>
  </div>

  <button
    class="basket-btn"
    @click="addToBasket(l)"
    :disabled="basketQty(l) >= l.AvailableInventory"
  >
    +
  </button>
  
</div>
      </li>
    </ul>

    <p v-if="searchLoading" class="search-loading">Searching...</p>
  </section>


</template>

<style scoped>

/* Sorting controls layout */
.sort-controls {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  align-items: center;
  margin: 1.5rem 0 1rem;
  margin-left: 1rem; 
}

/* Dropdown styling */
select {
  padding: .5rem .7rem;
  border: 2px solid #c9cde6;
  border-radius: 10px;
  background: #fff;
}

/* Lesson image styling */
.picture {
  width: 100%;
  height: 180px;
  object-fit: cover;
  border-radius: 10px;
}

/* Main lessons container */
.lessons { 
  padding: 1rem; }

/* Grid layout for lessons */
.list { 
  display: grid; 
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); 
  gap: 1rem; 
  list-style: none; 
}

/* Individual lesson card styling */
.card { 
  border: 2px solid #c9cde6; 
  border-radius: 12px; 
  padding: 1rem; 
  background: #fff; 
  display: flex; 
  flex-direction: column; 
  gap: .35rem; 
}

/* Description text styling */
.desc { 
  color: #555; 
  font-size: .95rem; 
}

/* Add to cart button styling */
.btn { 
  margin-top: .5rem; 
  padding: .6rem .9rem; 
  border-radius: 10px; 
  border: none; 
  background: #5b5fc7; 
  color: #fff; 
  font-weight: 600; 
  cursor: pointer; 
}

/* Search Bar Styles */
.search-controls {
  margin: 1.5rem 1rem 1rem 1rem;
}

.search-bar {
  display: flex;
  gap: 0.5rem;
  align-items: center;
  max-width: 900px;
}

.search-input {
  flex: 1;
  padding: 0.75rem 0.75rem;
  border: 2px solid #c9cde6;
  border-radius: 10px;
  font-size: 1rem;
  background: #fff;
}

.search-input:focus {
  outline: none;
  border-color: #5b5fc7;
}

.search-btn {
  background-color: white;
  display: flex;
  padding: 1rem 1rem;
  font-size: 17px;
  cursor: pointer;
  text-align: center;
  color: black;
  border: 2px solid rgba(184, 175, 218, 0.6);
  border-radius: 10px;
  box-shadow: 5px 9px #b8afda;
  align-items: center;
}

/* Button press effect */
.search-btn:hover {
  box-shadow: 0px 5px #a78bfa;
  transform: translateY(4px);
}

.clear-btn {
 background-color: white;
  display: flex;
  padding: 1rem 1rem;
  font-size: 17px;
  cursor: pointer;
  text-align: center;
  color: black;
  border: 2px solid rgba(184, 175, 218, 0.6);
  border-radius: 10px;
  box-shadow: 5px 9px #b8afda;
  align-items: center;
}

.clear-btn:hover {
  box-shadow: 0px 5px #a78bfa;
  transform: translateY(4px);
}

/* Search results information text */
.search-results-info {
  margin: 0.5rem 0 0 0;
  color: #666;
  font-style: italic;
}

/* Search loading indicator */
.search-loading {
  text-align: center;
  color: #5b5fc7;
  font-style: italic;
  margin: 1rem 0;
}

.basket-controls {
  margin-top: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
}

.basket-btn {
  min-width: 60px;
  padding: 0.6rem 0;
  border-radius: 10px;
  border: none;
  background: #020066;       
  color: #fff;
  font-size: 1.4rem;
  font-weight: 600;
  cursor: pointer;
}

.basket-btn:disabled {
  opacity: 0.4;
  cursor: default;
}

.basket-count {
  text-align: center;
  line-height: 1.1;
}

.basket-number {
  font-size: 1.3rem;
  font-weight: 600;
}

.basket-label {
  font-size: 0.85rem;
  color: #666;
}

</style>

