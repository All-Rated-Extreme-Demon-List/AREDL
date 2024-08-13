<script setup>
import {computed, onMounted, ref, watch} from "vue";

const props = defineProps(['level_data', 'selected'])
const emit = defineEmits(['active_element', 'update:selected'])

const list_element = ref(null)

const updateActive = () => {
  if (active.value && list_element.value) {
    emit('active_element', list_element.value)
  }
}

const selected_level = computed({
  get() {
    return props.selected
  },
  set(value) {
    emit('update:selected', value)
  }
})

const active = computed(() => {
  return selected_level.value.id === props.level_data.level_id.toString() && selected_level.value.two_player === props.level_data.two_player
})

onMounted(async () => {
  updateActive()
})

watch(props, () => {
  updateActive()
})

</script>

<template>
  <div class="list-element" ref="list_element">
    <span v-if="!level_data.legacy">#{{level_data.position}}</span>
    <span v-else></span>
    <button @click="() => selected_level = {id: level_data.level_id.toString(), two_player: level_data.two_player}" :class="active && 'active'">{{level_data.name}}</button>
  </div>
</template>

<style scoped>

.list-element {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  gap: 0.75rem;
}

.list-element span, .list-element button{
  color: white;
  font-size: 17px;
  line-height: 20px;
  font-weight: 500;
}

.list-element span {
  width: 3.5rem;
  text-align: right;
}

.list-element button {
  text-align: left;
  background-color: transparent;
  border: none;
  cursor: pointer;
  padding: 0.75rem 0.75rem;
  border-radius: 0.75rem;
  transition: background-color 400ms ease;
}

.list-element .active {
  background-color: var(--color-primary);
  text-shadow: 0 0 1px black, 0 0 1px black, 0 0 1px black, 0 0 1px black, 0 0 2px black, 0 0 1px black, 0 0 1px black, 0 0 1px black, 0 0 1px black;
}

.list-element .active:hover {
  background-color: var(--color-primary);
  cursor: auto;
}

.list-element button:hover {
  background-color: rgba(255, 255, 255, 0.1);
  border: none;
  cursor: pointer;
}
</style>