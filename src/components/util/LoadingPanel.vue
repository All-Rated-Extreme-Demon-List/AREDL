<script setup>

import {onMounted, ref, watch} from "vue";
import {LoadingStatus} from "@/loadingStatus"

const props = defineProps(['status'])

const timer = ref()
const dot_count = ref(3)

onMounted(async () => {
  timer.value = setInterval(() => {
    if (dot_count.value >= 3) {
      dot_count.value = 0;
    } else {
      dot_count.value += 1;
    }
  }, 400)
})

</script>

<template>
  <div class="container">
    <div class="loading-page" v-if="status !== LoadingStatus.FINISHED">
      <p v-if="status === LoadingStatus.LOADING" class="loading">
        Loading{{'.'.repeat(dot_count)}}
      </p>
      <p v-if="status === LoadingStatus.ERROR" class="error">
        Failed to fetch data from backend.
      </p>
    </div>
    <slot v-else></slot>
  </div>
</template>

<style scoped>

.container {
  height: 100%;
  width: 100%;
}

.loading-page {
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  & .loading {
    font-size: 18px;
    width: 6rem;
  }

  & .error {
    color: darkred;
  }
}

</style>