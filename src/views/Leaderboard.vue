<script setup>

import {ref} from "vue";
import LeaderboardView from "@/components/leaderboard/LeaderboardView.vue";
import ProfileView from "@/components/leaderboard/ProfileView.vue";

const selected_user = ref()
const mobile_list_expanded = ref(true)

</script>

<template>
  <div class="page">
    <div class="leaderboard-tab tab" :class="!mobile_list_expanded && 'hidden-mobile'">
      <LeaderboardView @select="(selected) => {selected_user = selected.id; if (mobile_list_expanded) mobile_list_expanded = selected.init}"></LeaderboardView>
    </div>
    <button class="mobile-expand" @click="mobile_list_expanded = !mobile_list_expanded">{{mobile_list_expanded ? "<" : ">"}}</button>
    <div class="profile-tab tab" :class="mobile_list_expanded && 'hidden-mobile'">
      <ProfileView :user_id="selected_user"></ProfileView>
    </div>
  </div>
</template>

<style scoped>

.page {
  display: flex;
  height: 100%;
  width: 100%;
  overflow: hidden;

  & .tab {
    overflow-y: auto;
  }


  @media (min-width: 880px) {
    & .leaderboard-tab {
      flex: 1;
    }

    & .profile-tab {
      flex: 4;
    }
  }
}

.mobile-expand {
  display: none;
}

@media (max-width: 880px) {
  .hidden-mobile {
    display: none;
  }

  .mobile-expand {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 1.5rem;
    height: 100%;
    background: color-mix(in srgb, var(--color-background), rgba(255, 255, 255) 15%);
    border: none;
  }

  .page {
    overflow: hidden;
    height: 100%;
    width: 100%;
    display: flex;
  }

  .tab {
    width: 100%;
  }
}

</style>