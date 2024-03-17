<script setup>
defineProps(['level_data'])
</script>

<template>
  <RouterLink :to="{name:'List', params: {id: level_data.level_id}}" class="level_display">
    {{level_data.name}}
  </RouterLink>
</template>

<style scoped>
.level_display {
  font-size: 17px;
  width: 100%;
  text-decoration: none;
  font-weight: 500;
  box-sizing: border-box;
  color-scheme: dark;
  color: var(--color-on-primary)
}


@media (max-width: 880px) {
  .level_display {
    font-size: 14px;
  }
}
</style>