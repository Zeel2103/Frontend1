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
</style>




<!--
<template>
  <h1>{{ msg }}</h1>

  <div class="card">
    <button type="button" @click="count++">count is {{ count }}</button>
    <p>
      Edit
      <code>components/HelloWorld.vue</code> to test HMR
    </p>
  </div>

  <p>
    Check out
    <a href="https://vuejs.org/guide/quick-start.html#local" target="_blank"
      >create-vue</a
    >, the official Vue + Vite starter
  </p>
  <p>
    Learn more about IDE Support for Vue in the
    <a
      href="https://vuejs.org/guide/scaling-up/tooling.html#ide-support"
      target="_blank"
      >Vue Docs Scaling up Guide</a
    >.
  </p>
  <p class="read-the-docs">Click on the Vite and Vue logos to learn more</p>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
-->