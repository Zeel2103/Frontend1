<script setup>
</script>

<template>
 
  <header class="navbar">
    <div class="nav-left">
      <div class="logo"></div>
      <span class="brand">GeniusLab</span>
    </div>
    <nav class="nav-links">
      <RouterLink to="/">Home</RouterLink>
      <RouterLink to="/Classes">Explore</RouterLink>
    </nav>
    <button class="checkout-btn">Checkout</button>
  </header>
   <div id="app">
    <RouterView /> 
  </div>
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: "Inter", sans-serif;
}

/* Navbar */
.navbar {
  width: 100%;
  padding: 1rem 2rem;
  background-color: #000;
  color: white;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.nav-left {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.logo {
  font-size: 1.5rem;
  background: white;
  color: black;
  border-radius: 5px;
  padding: 0.3rem 0.5rem;
}

.brand {
  font-size: 1.1rem;
}

.nav-links {
  display: flex;
  gap: 2rem;
}

.nav-links a {
  color: white;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s ease;
}

.nav-links a:hover {
  color: #a78bfa; /* light purple hover */
}

.checkout-btn {
  display: inline-block;
  padding: 15px 25px;
  font-size: 24px;
  cursor: pointer;
  text-align: center;
  color: #a78bfa;
  background-color: black;
  border: 2px solid #fff;
  border-radius: 15px;
  box-shadow: 5px 9px #a78bfa;
}

.checkout-btn:hover {
  box-shadow: 0px 5px #a78bfa;
  transform: translateY(4px);
}
#app {
  text-align: center;
}
</style>
