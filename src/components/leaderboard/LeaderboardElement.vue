<script setup>
import {computed, onMounted, ref, watch} from "vue";

const props = defineProps(['user_data', 'selected'])
const emit = defineEmits(['update:selected'])

const leaderboard_element = ref(null)

const scrollIntoViewIfActive = () => {
  if (active.value) {
    leaderboard_element.value.scrollIntoView({behavior: "instant", block: "center"})
  }
}

onMounted(async () => {
  scrollIntoViewIfActive()
})

const selected_user = computed({
  get() {
    return props.selected
  },
  set(value) {
    emit('update:selected', value)
  }
})

const user_data = computed(() => {
  return props.user_data
})

const active = computed(() => {
  return selected_user.value === props.user_data.user.id
})

watch(user_data, () => {
  scrollIntoViewIfActive()
})

</script>

<template>
  <tr class="leaderboard-element" ref="leaderboard_element">
    <td class="rank">#{{user_data.rank}}</td>
    <td class="points">{{user_data.points.toFixed(1)}}</td>
    <td class="name">
      <button @click="() => selected_user = props.user_data.user.id" :class="active && 'active'">{{user_data.user.global_name}}</button>
    </td>
  </tr>
</template>

<style scoped>

.leaderboard-element {

  & button {
    background: transparent;
    border: none;
    border-radius: 0.75rem;
    padding: 0.75rem;
    font-size: 17px;
    width: fit-content;
    transition: background-color 400ms ease;
  }

  & td {
    font-size: 17px;
  }

  & .rank {
    text-align: right;
    padding-right: 10px;
  }

  & button:hover {
    background: color-mix(in srgb, var(--color-background), rgba(255, 255, 255) 10%);
  }

  & button.active {
    background: var(--color-primary);
  }
}
@media (max-width: 880px) {
  .leaderboard-element button{
    font-size: 15px;
    line-height: 16px;
  }

}
</style>