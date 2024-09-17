<template>
  <div class='pulse-container'>
      <div class="pulse-bubble pulse-bubble-1"></div>
      <div class="pulse-bubble pulse-bubble-2"></div>
      <div class="pulse-bubble pulse-bubble-3"></div>
    </div>
</template>

<style scoped>
.pulse-container {
  max-width: 400px;
  height: 30vh;
  display: flex;
  justify-content: center;
  align-items: center;
} 

.pulse-bubble {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background-color: #3ff9dc;
  margin-left: 12px;
  margin-right: 12px;
  opacity: 0.5;
  transform-origin: 50% 50%;
}
</style>