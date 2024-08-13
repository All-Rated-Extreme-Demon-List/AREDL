<script setup>
const props = defineProps(['pack'])
</script>

<template>
  <RouterLink :to="{name: 'Packs', params: {id: pack.id}}" class="pack-display" :style="{'background': pack.color}">
        <span>
          {{pack.name}}
        </span>
  </RouterLink>
</template>

<style scoped>
.pack-display {
  display: flex;
  flex-shrink: 0;
  background-size: 100% 100% !important;
  border-radius: 0.5rem;
  padding: 3px;
  text-decoration: none;
  width: fit-content;
  text-shadow: 1.5px 1.5px 1px black;
}

.pack-display span {
  background: var(--color-background);
  border-radius: 0.5rem;
  padding: 5px;
  transition: background-color 400ms ease;
}

.pack-display:hover span {
  background-color: rgba(0, 0, 0, 0.3);
}

</style>