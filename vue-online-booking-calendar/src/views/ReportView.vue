<script setup>
import { useAttrs } from 'vue'
import { parametersRequest } from "@/store/store";
import ReportBooking from '../components/report/ReportBooking.vue'
import ReportLoading from '@/components/report/ReportLoading.vue';

const attrs = useAttrs()
if (attrs.reportday) parametersRequest.reportDay = attrs.reportday
</script>

<template>
  <main>
    <Suspense>
      <ReportBooking />
      <template #fallback>
        <ReportLoading />
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