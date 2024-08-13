<script setup>
const props = defineProps(['title', "icon", "count", "points"])
</script>

<template>
  <div class="title">
    <img :src="icon" alt="">
    <h3>{{title}} ({{count}})</h3>
    <h4 v-if="points">+{{points}} points</h4>
  </div>
</template>

<style scoped>
.title {
  display: flex;
  flex-direction: row;
  gap: 0.5rem;
  align-items: center;

  & h4 {
    padding-top: 0.25rem;
  }

  & img {
    width: 2rem;
    height: 2rem;
  }
}

</style>