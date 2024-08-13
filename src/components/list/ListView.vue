<script setup>
import ListElement from "@/components/list/ListElement.vue";
import {nextTick, onMounted, ref, watch} from "vue";
import {useRoute} from "vue-router";
import {pb} from "@/pocketbase";
import router from "@/router";
import LoadingPanel from "@/components/util/LoadingPanel.vue";
import {LoadingStatus} from "@/loadingStatus"

const emit = defineEmits(['select'])

const list_data = ref()
const display_data = ref([])
const filter = ref("")
const main_list = ref([])
const legacy_list = ref([])
const selected_level = ref(null)
const selected_element = ref(null)
const loading_status = ref(LoadingStatus.LOADING)

const route = useRoute()

const scrollSelectedIntoView = () => {
  if (selected_element.value) {
    nextTick(() => {
      selected_element.value.scrollIntoView({ behavior: "instant", block: "center" })
    })
  }
}

onMounted(async () => {

  let id = route.params.id
  if (id && id !== '') {
    if (id.endsWith("_2p")) {
      selected_level.value = {
        id: id.slice(0, -3),
        two_player: true,
      }
    } else {
      selected_level.value = {
        id: id,
        two_player: false,
      }
    }
  }
  try {
    list_data.value = await pb.send("/api/aredl/list", {})
  } catch (error) {
    loading_status.value = LoadingStatus.ERROR;
    return;
  }
  if (!selected_level.value && list_data.value.length > 0) {
    selected_level.value = {
      id: list_data.value[0].level_id.toString(),
      two_player: false,
      init: true,
    }
  }
  loading_status.value = LoadingStatus.FINISHED;
})

watch(selected_level, (newValue, oldValue) => {
  if (oldValue === newValue) return
  router.replace(router.resolve({
    name: "ListSelect",
    params: {id: newValue.id + (newValue.two_player ? "_2p" : "")}
  }))
  emit('select', newValue)
})

watch(list_data, () => {
  updateData()
})

watch(filter, () => {
  updateData()
})

watch(selected_element, (_, oldValue) => {
  if (!oldValue) scrollSelectedIntoView()
})

const updateData = () => {
  display_data.value = list_data.value.filter((level) => level.name.toUpperCase().includes(filter.value.toUpperCase()))
  main_list.value = display_data.value.filter((level) => !level.legacy)
  legacy_list.value = display_data.value.filter((level) => level.legacy)
  scrollSelectedIntoView()
}
</script>

<template>
  <LoadingPanel :status="loading_status">
    <div class="list-view">
      <div class="search-bar" :class="filter !== '' && 'show'">
        <input type="text" v-model="filter" class="search-bar" placeholder="search">
        <button @click="() => filter = ''"></button>
        <img src="@/assets/search-icon.svg" alt="search icon">
      </div>
      <div v-if="main_list" class="main-list">
        <ListElement v-for="level in main_list" :level_data="level" v-model:selected="selected_level" @active_element="(el) => selected_element = el"></ListElement>
      </div>
      <h2 v-if="legacy_list && legacy_list.length > 0" class="legacy-title">Legacy</h2>
      <div v-if="legacy_list && legacy_list.length > 0" class="legacy-list">
        <ListElement v-for="level in legacy_list" :level_data="level" v-model:selected="selected_level" @active_element="(el) => selected_element = el"></ListElement>
      </div>
    </div>
  </LoadingPanel>
</template>

<style scoped>

.search-bar {
  border: none;
  height: 0;
  width: calc(100% - 1rem);
  overflow: visible;
  position: sticky;
  top: 0.5rem;
  right: 0.5rem;
  left: 0.5rem;
  display: flex;
  flex-direction: row;

  transition: height 100ms ease-in-out;

  &:hover,
  &:focus-within {
    height: 1.5rem;

    &:not(.show) input {
      width: 100%;
      border-radius: 0.5rem;
    }
  }

  &.show {
    height: 1.5rem;

    & input {
      width: 100%;
      border-radius: 0.5rem 0 0 0.5rem;
    }

    & button {
      display: flex;
      width: 3rem;
      justify-content: center;
      align-items: center;
    }
  }
}

.search-bar button {
  background: color-mix(in srgb, var(--color-background), rgba(255, 255, 255) 10%);
  border: none;
  width: 0;
  display: none;
  font-size: 12px;
  text-align: center;
  line-height: 12px;
  height: 100%;
  border-radius: 0 0.5rem 0.5rem 0;
  transition: width 100ms ease-in-out;

  &:after {
    filter: brightness(0) invert(1);
    content: "\274c";
  }

  &:hover {
    cursor: pointer;
  }
}

.search-bar input {
  background: color-mix(in srgb, var(--color-background), rgba(255, 255, 255) 10%);
  font-size: 17px;
  height: 1.5rem;
  outline: none;
  border-radius: 0.5rem 0 0 0.5rem;
  width: 0;
  padding: 0;
  text-indent: 2.5%;
  transition: width 100ms ease-in-out;
}


.search-bar img {
  filter: brightness(0) invert(1);
  height: 1.5rem;
  margin-left: auto;
  width: 2rem;
}

.legacy-title {
  color: var(--color-on-primary);
  text-align: center;
  padding-top: 1rem;
  background: rgba(255, 255, 255, 0.04);
}

.list-view {
  position: relative;
  display: flex;
  flex-direction: column;
  //background: linear-gradient(0deg, var(--color-background), color-mix(in srgb, var(--color-background), cyan 20%));
}

.main-list, .legacy-list{
  display: flex;
  width: 100%;
  height: 100%;
  gap: 0.25rem;
  align-items: flex-start;
  flex-direction: column;
  overflow-x: hidden;
}

.main-list {
  padding-top: 1rem;
  padding-bottom: 1rem;
}

.legacy-list {
  padding-top: 1rem;
  padding-bottom: 2rem;
  background: rgba(255, 255, 255, 0.04);
}
</style>