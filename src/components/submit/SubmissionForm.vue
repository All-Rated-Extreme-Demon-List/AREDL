<script setup>
import SubmissionType from "@/views/Submission.vue";
import {ref} from "vue";

const props = defineProps(['selectedSubmission'])
const selectedLevel = ref(null)

const options = [
  {name: 'test'}
]
</script>

<template>
  <div class="submission-form">
    <div class="level-select">
      <multiselect :options="options" track-by="name" placeholder="Select one"></multiselect>
    </div>
  </div>
</template>

<style scoped>

</style>