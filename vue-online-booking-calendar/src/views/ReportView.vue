<script setup>
import ReportBooking from '../components/ReportBooking.vue'
</script>

<template>
  <main>
    <Suspense>
      <ReportBooking />
      <template #fallback>
        Loading...
      </template>
    </Suspense>
    
  </main>
</template>

<style>
/* @media (min-width: 1024px) {
  .about {
    min-height: 40vh;
    display: flex;
    align-items: center;
  }
} */
</style>