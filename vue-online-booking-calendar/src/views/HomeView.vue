<script setup>
import TheWelcome from '../components/TheWelcome.vue'
import { useAttrs } from 'vue'
import { parametersRequest } from '../store/store'

const attrs = useAttrs()
if(attrs.tableid || attrs.userid) parametersRequest.setParameters(attrs);
</script>

<template>  
  <!-- <div>
    Table {{ !attrs.tableid }}
  </div>
  <div>
    User {{ !attrs.userid }}
  </div> -->
  <main>
    <TheWelcome />
  </main>
</template>
