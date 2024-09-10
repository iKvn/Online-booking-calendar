<script setup>
import { getReportBooking } from '@/lib/data';
import { parametersRequest } from "@/store/store";

const reports = await getReportBooking(parametersRequest.reportDay);
const filterDay = parametersRequest.reportDay === 'all' ? 'У Вас' : parametersRequest.reportDay === 'tomorrow' ? 'На завтра' : 'На сьогодні';
</script>

<template>
  <div v-if="reports.length">
    <h2>
      <p>Вітаю!</p>
      <p>{{ `${filterDay} є записи клієнтів 🗓️ 👍` }}</p>
    </h2>
    <div class="greetings" v-for="report in reports" :key="report.RecordId">
      <h3 >
        <p v-if="parametersRequest.reportDay === 'all'">{{ `🗓️ ${report.RecordDate} ⏱️ ${report.RecordingTime}:00` }}</p>
        <p v-else>{{ `⏱️ ${report.RecordingTime}:00` }}</p>
        <p>
        <span>{{ `🙍‍♀️ ${report.Name} ` }}</span>
        <span type="phone">{{ `📞 +${report.Phone}` }}</span>
        </p>
      </h3>
    </div>
  </div>
  <div v-else>
    <h2>
      <p>Перепрошую, але на жаль,</p>
      <p>{{ `${filterDay} відсутні записи клієнтів 🗓️ 😟 😥` }}</p>
    </h2>
  </div>
</template>

<style scoped>
h2 {
  font-weight: 500;
  font-size: 1.2rem;
  position: relative;
  top: -10px;
}

h3 {
  font-size: 1rem;
  background-color: rgb(193, 237, 239);
  margin-bottom: 10px;
  padding: 10px;
  border-radius: 10px;
}

.greetings h2,
.greetings h3 {
  text-align: left;
}

@media (max-width: 680px) {
  .greetings h2,
  .greetings h3 {
    text-align: left;
  }
}
</style>
