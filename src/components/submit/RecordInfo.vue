<script setup>

const props = defineProps(['record'])
</script>

<template>
  <div class="recordInfo">
    <div class="level_name">
      {{record.level.name}}
    </div>
    <div class="status">
      <span class="accepted">Accepted</span>
    </div>
  </div>
</template>

<style scoped>
.recordInfo {
  cursor: pointer;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  width: 100%;

  padding: 5px 5px 8px 5px;

  border-style: solid;
  border-radius: 0.5rem;
  border-color: color-mix(in srgb, var(--color-background), rgba(255, 255, 255) 50%);

  background-color: var(--color-background);
  transition: background-color 200ms ease;

  &:hover {
    background-color: color-mix(in srgb, var(--color-background), rgba(255, 255, 255) 10%);
  }

  & .status {
    & .accepted {
      background-color: #4f772d;
    }

    & span {
      padding: 2px 5px;
      border-radius: 0.5rem;
    }
  }
}
</style>