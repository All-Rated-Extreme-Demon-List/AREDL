<script setup>

import {onMounted, ref, watch} from "vue";
import {useRoute} from "vue-router";
import router from "@/router";
import {pb} from "@/pocketbase";
import LeaderboardElement from "@/components/leaderboard/LeaderboardElement.vue";
import LoadingPanel from "@/components/util/LoadingPanel.vue";
import {LoadingStatus} from "@/loadingStatus";

const emit = defineEmits(['select'])

const per_page = ref(100)
const page = ref(1)
const filter = ref("")
const current_filter = ref("")
const display_data = ref()

const selected_user = ref()
const initial_id = ref(false)

const loading_status = ref(LoadingStatus.LOADING)

const route = useRoute()

onMounted(async () => {
  if (route.params.id !== '') {
    initial_id.value = true
    selected_user.value = route.params.id
  }
  await updateData(true)
  if (!selected_user.value && display_data.value && display_data.value.list && display_data.value.list.length > 0) {
    selected_user.value = display_data.value.list[0].user.id
  }
})

watch(selected_user, (newValue, oldValue) => {
  if (oldValue === newValue) return
  router.replace(router.resolve({
    name: "Leaderboard",
    params: {id: newValue},
  }))
  let init = false;
  if (initial_id.value) {
    initial_id.value = false;
    init = true;
  }
  emit('select', {
    id: newValue,
    init: init
  })
})

watch(route, () => {
  if (route.params.id === selected_user.value) return
  selected_user.value = route.params.id
})

watch(current_filter, () => {
  page.value = 1
  updateData(false)
})

const updateData = async (use_user) => {
  loading_status.value = LoadingStatus.LOADING;
  let query_options = {
    "page": page.value,
    "per_page": per_page.value,
  }
  if (use_user) {
    query_options["user_id"] = selected_user.value
  } else {
    query_options["name_filter"] = current_filter.value
  }
  try {
    display_data.value = await pb.send("/api/aredl/leaderboard", {query: query_options})
  } catch (error) {
    loading_status.value = LoadingStatus.ERROR;
    return;
  }
  page.value = display_data.value.page
  loading_status.value = LoadingStatus.FINISHED;
}

const switchPage = async (newPage) => {
  page.value = newPage;
  if (page.value < 0) page.value = 0;
  if (display_data.value && page.value > display_data.value.pages) page.value = display_data.value.pages;
  await updateData(false);
}

const updateFilter = () => {
  current_filter.value = filter.value
}

</script>

<template>
  <div class="leaderboard-view">
    <div class="leaderboard-header">
      <div class="name-filter">
        <input type="text" v-model="filter" v-on:keyup.enter="updateFilter" placeholder="search">
        <button @click="updateFilter">
          <img src="@/assets/search-icon.svg" alt="search icon">
        </button>
      </div>
      <div class="page-nav">
        <button @click="switchPage(page - 1)" class="previous" :disabled="page === 1">{{'<'}}</button>
        <input type="number" v-model="page" v-on:keyup.enter="switchPage(page)">
        <span>/ {{display_data?.pages || 1}}</span>
        <button @click="switchPage(page + 1)" class="next" :disabled="!display_data || page === display_data.pages">{{'>'}}</button>
      </div>
    </div>
    <LoadingPanel :status="loading_status">
      <table class="user-list" v-if="display_data">
        <LeaderboardElement v-for="user in display_data.list" :user_data="user" v-model:selected="selected_user"></LeaderboardElement>
      </table>
    </LoadingPanel>
  </div>
</template>

<style scoped>

.leaderboard-view {
  position: relative;
}

.user-list {
  width: fit-content;
  border-spacing: 5px 4px;
  padding-left: 0.7rem;
  border: white;
}

.leaderboard-header {
  position: sticky;
  overflow: visible;
  padding: 0.4rem 1rem 0.4rem 1rem;
  top: 0;
  gap: 1rem;
  height: 2.75rem;
  flex-shrink: 1;
  background: var(--color-background);
  display: flex;
  align-items: center;

  & button {
    font-size: 17px;
    border:none;
    background: rgba(255, 255, 255, 0.1);
    transition: background-color 200ms ease-in-out;
    border-radius: 0.25rem;
  }

  & button:disabled {
    opacity: 0.5;
  }

  & .name-filter {
    display: flex;
    align-items: center;
    height: 100%;

     & button {
       display: flex;
       align-items: center;
       justify-content: center;
       border-radius: 0 0.5rem 0.5rem 0;
       height: 100%;

       & img {
         padding: 0.3rem;
         height: 100%;
         filter: brightness(0) invert(1);
       }
     }

    & input {
      border: none;
      background-color: rgba(255, 255, 255, 0.1);
      font-size: 17px;
      outline: none;
      border-radius: 0.5rem 0 0 0.5rem;
      max-width: 7rem;
      height: 100%;
      text-indent: 7px;
    }
  }

  & .page-nav {
    display: flex;
    height: 100%;

    & button {
      padding: 0 0.5rem;

      &.next {
        border-radius: 0 0.5rem 0.5rem 0;
      }

      &.previous {
        border-radius: 0.5rem 0 0 0.5rem;
      }
    }

    & input {
      border: none;
      background-color: rgba(255, 255, 255, 0.1);
      text-align: center;
      font-size: 17px;
      outline: none;
      max-width: 2rem;
      height: 100%;
      line-height: 10px;
    }

    & span {
      display: flex;
      align-items: center;
      white-space: nowrap;
      justify-content: center;
      background-color: rgba(255, 255, 255, 0.1);
      height: 100%;
      padding-right: 9px;
      font-size: 17px;
    }
  }

  & button:hover:enabled {
    background: rgba(255, 255, 255, 0.2);
  }
}

</style>