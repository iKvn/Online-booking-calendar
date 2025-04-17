<template>
  <div class="hotel-reservation">
    <h1>Hotel Reservation</h1>
    <div class="calendar-container">
        <CalendarTable :available-dates="availableDates" :selected-day="selectedDay" />
    </div>
    <div v-if="selectedDay.target" class="booking-info">
      <p>Selected Date: {{ selectedDay.day.date.toLocaleDateString() }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getAvailableDates } from '@/lib/data';
//import { getCalendarDays } from '@/lib/utils';
//import { parametersMonth } from '@/store/store';
import CalendarTable from './CalendarTable.vue';

const availableDates = ref([]);
const selectedDay = ref({
  target: null,
  index: null,
  day: {},
  year: null,
  setStyle: () => {},
  cleanStyle: () => {},
  setDay: ({ target, day, year }) => {
    selectedDay.value.target = target;
    selectedDay.value.index = day.index;
    selectedDay.value.day = day;
    selectedDay.value.year = year;
  }
});

onMounted(async () => {
  availableDates.value = await getAvailableDates();
  selectedDay.value.setStyle = () => {
    if (selectedDay.value.target) {
      const notSelected = 'notselected';
      selectedDay.value.target.classList.add(notSelected);
      selectedDay.value.target.style.backgroundColor = '#1a73e8';
      selectedDay.value.target.style.color = 'white';
    }
  };
  selectedDay.value.cleanStyle = () => {
    if (selectedDay.value.target) {
      selectedDay.value.target.style.backgroundColor = '';
      selectedDay.value.target.style.color = '';
      selectedDay.value.target.classList.remove('notselected');
    }
  };
});

</script>

<style scoped>
.hotel-reservation {
  text-align: center;
  margin: 20px;
}

.calendar-container {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

.booking-info {
  margin-top: 20px;
  font-size: 1.2rem;
}
</style>
