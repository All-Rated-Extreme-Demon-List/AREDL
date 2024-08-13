<script setup>
const props = defineProps(['user_data'])
</script>

<template>
  <RouterLink :to="{ name: 'Leaderboard', params: {id: props.user_data.id}}" class="user-display">
    <span>{{props.user_data.global_name}}</span>
  </RouterLink>
</template>

<style scoped>
.user-display {
  display: flex;
  font-size: 17px;
  text-decoration: none;
  font-weight: 500;
  box-sizing: border-box;
  color-scheme: dark;
  text-overflow: ellipsis;
  line-height: 28px;
  color: var(--color-on-primary);
  padding: 1px;
  transition: background-color 300ms ease;

  span {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
    border-radius: 0.25rem;
  }
}

@media (max-width: 880px) {

}
</style>