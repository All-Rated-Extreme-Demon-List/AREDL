<script setup>
const props = defineProps(['user_data'])
</script>

<template>
  <RouterLink :to="{ name: 'Leaderboard', params: {id: props.user_data.id}}" class="user-display">
    {{props.user_data.global_name}}
  </RouterLink>
</template>

<style scoped>
.user-display {
  font-size: 17px;
  text-decoration: none;
  font-weight: 500;
  box-sizing: border-box;
  color-scheme: dark;
  line-height: 28px;
  color: var(--color-on-primary)
}

@media (max-width: 880px) {


  .user-display {
    font-size: 14px;
    line-height: 20px;
  }
}
</style>