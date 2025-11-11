<script setup>
/*

  
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
const imgUrl = (file) => new URL(`../assets/${file}`, import.meta.url).href

const lessons = ref([
  { id: 1, Subject: 'Maths', Location: 'London', Description: 'Learn algebra, statistics and geometry', Price: 10.80, AvailableInventory: 5, Image: 'maths.jpg' },
  //{ id: 2, Subject: 'Spanish', Location: 'Oxford', Description: 'Speaking, listening, reading and writing', Price: 8.99, AvailableInventory: 5, Image: 'spanish.jpg' },
  { id: 3, Subject: 'English', Location: 'London', Description: 'Reading, writing and comprehension', Price: 5.60, AvailableInventory: 5, Image: 'english.png' },
  { id: 4, Subject: 'Drama', Location: 'York', Description: 'Acting skills and theatre techniques', Price: 7.90, AvailableInventory: 5, Image: 'drama.jpg' },
  { id: 5, Subject: 'Music', Location: 'Bristol', Description: 'Theory and performance basics', Price: 7.50, AvailableInventory: 5, Image: 'music.jpg' },
  { id: 6, Subject: 'Science', Location: 'Cambridge', Description: 'Biology, Chemistry & Physics overview', Price: 5.00, AvailableInventory: 5, Image: 'science.png' },
  { id: 7, Subject: 'History', Location: 'Bristol', Description: 'Modern world history essentials', Price: 13.00, AvailableInventory: 5, Image: 'history.png' },
  { id: 8, Subject: 'Art', Location: 'Leeds', Description: 'Drawing, colour and composition', Price: 18.50, AvailableInventory: 5, Image: 'art.png' },
  { id: 9, Subject: 'Geography', Location: 'Liverpool', Description: 'Places and environments', Price: 11.40, AvailableInventory: 5, Image: 'geography.jpg' },
  { id: 10, Subject: 'Computer Science', Location: 'Liverpool', Description: 'Programming and problem solving', Price: 4.00, AvailableInventory: 5, Image: 'cs.jpg' },
])

*/
import { ref, onMounted, watch } from 'vue'

// Backend API URL
const API_BASE = 'https://backend1-so5u.onrender.com'

const lessons = ref([]) // Array to store lesson data from API
const loading = ref(true)  // Loading state
const error = ref('')   // Error message

// Sorting state - default sort by subject in ascending order
const sortBy = ref('Subject')
const sortOrder = ref('asc')

// Images from the Vue app (src/assets)
const imgUrl = (file) => new URL(`../assets/${file}`, import.meta.url).href

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

onMounted(fetchLessons)
</script>

<template>

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


  <section class="lessons">
    <p v-if="loading">Loading lessons…</p>
    <p v-else-if="error">{{ error }}</p>

    <!-- v-else only renders when loading is false -->
    <ul v-else class="list">

      <!-- Loop through each lesson in lessons array and displays them-->
      <li v-for="l in lessons" :key="l.id" class="card">
        <img class="picture" :src="imgUrl(l.Image)" :alt="l.subject" />
        <p><strong>Subject:</strong> {{ l.Subject }}</p>
        <p><strong>Location:</strong> {{ l.Location }}</p>
        <p><strong>Price:</strong> £{{ l.Price.toFixed(2) }}</p>   <!-- Format price to 2 decimal places -->
        <p><strong>Spaces:</strong> {{ l.AvailableInventory }}</p>
        <p class="desc">{{ l.Description }}</p>
        <button class="btn">Add to cart</button>
      </li>
    </ul>

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

</style>

