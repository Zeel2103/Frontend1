<script setup>
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
</script>


<template>


  <!-- Welcome Section -->
  <section class="welcome">
    <h1>Welcome to your learning journey, where education meets opportunity.</h1>
    <div class="welcome-buttons">
      <RouterLink to="/Classes">
        <button class="btn primary">Explore our classes</button>
      </RouterLink>
    </div>
  </section>

  <section class="features">
    <div class="feature">
      <h3>📚 Expert Tutors</h3>
      <p>Learn from experienced and passionate teachers.</p>
    </div>

    <div class="feature">
      <h3>💻 Flexible Learning</h3>
      <p>Study online at your own pace with accessible classes.</p>
    </div>

    <div class="feature">
      <h3>⭐ Student-Focused</h3>
      <p>Every lesson is designed with student success in mind.</p>
    </div>
  </section>

  <footer class="footer">
    <p>© 2025 GeniusLab. All rights reserved.</p>
  </footer>

</template>

<style scoped>
/* Welcome Section */
.welcome {
  text-align: center;
  padding: 6rem 2rem;
  background-color: #fff;
  color: #000;
}

.welcome h1 {
  font-size: 2.5rem;
  font-weight: 600;
  line-height: 1.3;
  max-width: 900px;
  margin: 0 auto 3rem auto;
  font-family: "Inter", sans-serif;
}

.welcome-buttons {
  display: flex;
  justify-content: center;
  gap: 1rem;
}

.btn {
  border: none;
  padding: 0.8rem 2rem;
  border-radius: 10px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

/*#d8c4fc*/
.btn.primary {
  background-color: white;
  display: inline-block;
  padding: 15px 25px;
  font-size: 24px;
  cursor: pointer;
  text-align: center;
  color: black;
  border: 2px solid rgba(184, 175, 218, 0.6);
  border-radius: 15px;
  box-shadow: 5px 9px #b8afda;
}

.btn.primary:hover {
  box-shadow: 0px 5px #a78bfa;
  transform: translateY(4px);
}

.features {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 2rem;
  padding: 4rem 1rem;
  background: #f9f5ff;
}

.feature {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  width: 260px;
  text-align: center;
  box-shadow: 0 8px 20px rgba(15, 23, 42, 0.08);
}

.feature h3 {
  margin-bottom: 0.5rem;
  font-size: 1.3rem;
}

.feature p {
  color: #555;
  font-size: 1rem;
}

.footer {
  text-align: center;
  padding: 1rem;
  background: #000;
  color: white;
  margin-top: 3rem;
}
</style>
