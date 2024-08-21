<script setup>

import { ref } from 'vue'

const day = ref(['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Нд']);

</script>

<template>
  <tr>
    <td class="dayWeek" v-for="(d, index) of day" :key="index">{{d}}</td>
  </tr>
</template>

<style scoped>
.dayWeek {
  background: #ffffff;
  border-bottom: 1px solid #83c9ee;
  padding-top: 4px;
}
</style>