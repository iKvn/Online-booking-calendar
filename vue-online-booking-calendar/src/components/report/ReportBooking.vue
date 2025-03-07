<script setup>
import { PhoneIcon, UserIcon, ClockIcon, CalendarIcon, UserGroupIcon } from '@heroicons/vue/24/solid'

import { getReportBooking } from '@/lib/data';
import { parametersRequest } from "@/store/store";
import { ref, computed } from 'vue'

const reports = await getReportBooking(parametersRequest.reportDay);

const filterDay = {
  Text: 'На сьогодні',
  Data: new Date()
}

if (parametersRequest.reportDay === 'all') {
  filterDay.Text = 'У Вас';
  filterDay.Data = '';
  } else if (parametersRequest.reportDay === 'tomorrow') {
    filterDay.Text = 'На завтра';
    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate + 1);
    filterDay.Data = currentDate;
  }

const searchQuery = ref(filterDay.Data);

const filteredData = computed(() => {
  let data = reports;
  let filterKey = reverseSearch(searchQuery.value);

  if (filterKey) {
    filterKey = filterKey.toLowerCase()
    data = data.filter((row) => {
        return row['RecordDate'].indexOf(filterKey) > -1
    })
  }
  return data
})

function reverseSearch(value) {
  return String(value).split("-").reverse().join(".");
}

function getCurrentDateLocale(currentDate) {
  const options = {
    year: "numeric",
    month: "numeric",
    day: "numeric",
  };
  const localeDate = typeof currentDate === 'string' ? currentDate : currentDate.toLocaleDateString('uk-UA', options);
  return reverseSearch(localeDate);
}
</script>

<template>
  <h2 v-if="filteredData.length">
    <p>Вітаю!</p>
    <p>{{ `${filterDay.Text} є записи клієнтів` }}</p>
    <UserGroupIcon style="width: 22; color:blue;vertical-align: text-top;"/>
  </h2>
  <form id="search">
    <span>Пошук по даті: </span> 
    <input type="date" name="query" style="vertical-align: text-bottom" v-model="searchQuery">
  </form>
  <scroll-container v-if="filteredData.length">
    <h3 class="container" v-for="report in filteredData" :key="report.RecordId">
      <div>
        <p v-if="parametersRequest.reportDay === 'all'">
          <CalendarIcon style="width: 18; color:blue;vertical-align: text-top;"/>
          <span>{{ report.RecordDate }}</span>
        </p>
        <p>
          <ClockIcon style="width: 18; color:blue;vertical-align: text-top;"/>
          <span>{{ `${report.RecordingTime}:00` }}</span>
        </p>
      </div>
      <div>
        <p>
          <UserIcon style="width: 18; color:blue;vertical-align: text-top;"/>
          <span>{{ report.Name }}</span>
        </p>
        <p>
          <PhoneIcon style="width: 18; color:blue;vertical-align: text-top;"/>
          <span>{{ `+${report.Phone}` }}</span>
        </p>
      </div>
    </h3>
  </scroll-container>
  <div v-else>
    <h2 v-if="searchQuery">
      <p>{{ `На ${getCurrentDateLocale(searchQuery)}, записи відсутні 😥` }}</p>
    </h2>
    <h2 v-else>
      <p>Записи клієнтів відсутні 😥</p>
    </h2>
  </div>
</template>

<style scoped>
#search {
  margin-bottom: 10px;
}

.container {
  display: flex;
  flex-direction: column;
  align-items: left;
  font-size: 0.9rem;
  background-color: rgb(193, 237, 239);
  border-radius: 5px;
  margin-bottom: 5px;
}

h3 > div {
  display: flex;
  flex-direction: row;
  margin-top: 3px;
  margin-bottom: 3px;
}

p {
  padding-inline: 0.3rem;
}

span {
  padding-inline: 0.2rem;
}

h2 {
  display: flex;
  font-weight: 500;
  font-size: 1.1rem;
  margin-bottom: 10px;
  align-items: center;
  justify-content: center;
}

@media (max-width: 332px) {
  .container {
    height: 60px;
    font-size: 0.9rem;
  }

  h2 {
    font-weight: 300;
    font-size: 1.2rem;
  }
} 

@media (max-width: 290px) {
  .container {
    height: 70px;
  }

  h2 {
    font-size: 1.0rem;
  }
} 

scroll-container {
  display: block;
  height: 440px;
  overflow-y: scroll;
  scroll-behavior: smooth;
}
</style>
