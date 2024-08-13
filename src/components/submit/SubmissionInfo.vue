<script setup>

const props = defineProps(['submission'])
</script>

<template>
  <div class="submissionInfo">
    <div class="level_name">
      {{submission.level.name}}
    </div>
    <div class="status">
      <span v-if="submission.rejected & submission.is_update" class="rejected">Rejected Update</span>
      <span v-else-if="submission.rejected" class="rejected">Rejected</span>
      <span v-else-if="submission.is_update" class="pending_update">Pending Update</span>
      <span v-else class="pending">Pending</span>
    </div>
  </div>
</template>

<style scoped>
.submissionInfo {
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

  & .level_name {
    white-space: nowrap;
  }

  & .status {
    & .rejected {
      background-color: #ae2012;
    }
    & .pending {
      background-color: #0096c7;
    }
    & .pending_update {
      background-color: #0096c7;
    }

    & span {
      padding: 2px 5px;
      white-space: nowrap;
      border-radius: 0.5rem;
    }
  }
}
</style>