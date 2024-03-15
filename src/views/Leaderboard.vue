<script setup>

import {ref} from "vue";
import LeaderboardView from "@/components/leaderboard/LeaderboardView.vue";
import ProfileView from "@/components/leaderboard/ProfileView.vue";

const selected_user = ref()

</script>

<template>
  <div class="page">
    <div class="leaderboard-tab tab">
      <LeaderboardView @select="(id) => selected_user = id"></LeaderboardView>
    </div>
    <div class="profile-tab tab">
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

  & .leaderboard-tab {
    flex: 1;
  }

  & .profile-tab {
    flex: 4;
  }
}

</style>