<script setup>
import { RouterView } from 'vue-router'
</script>

<template>
  <div v-if="!Object.values($route.query).length">
    <nav>
      <RouterLink to="/">Booking</RouterLink>
      <RouterLink to="/hotel-reservation">Hotel Reservation</RouterLink>
      <!-- <RouterLink to="/about">About</RouterLink> -->
      <RouterLink to="/report">Report</RouterLink>
    </nav>
  </div>
  <RouterView />
</template>

<style scoped>
div {
  align-items: center;
  margin-top: -3rem;
}
nav {
  font-size: 1rem;
  text-align: center;
  margin-bottom: 1rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

@media (min-width: 460px) {
  nav {
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: -3rem;
  }
} 
</style>
