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
  display: flex;
  box-sizing: border-box;
  color-scheme: dark;
  color: var(--color-on-primary);
  transition: background-color 400ms ease;

  &:hover {
    background-color: color-mix(in srgb, var(--color-background), rgba(255, 255, 255) 10%);
    border-radius: 0.25rem;
  }
}
</style>