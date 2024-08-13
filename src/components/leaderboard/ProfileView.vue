<script setup>

import {computed, ref, watch} from "vue";
import {pb} from "@/pocketbase";
import PackDisplay from "@/components/PackDisplay.vue";
import RoleIcon from "@/components/util/RoleIcon.vue";
import ProfileRecordTable from "@/components/leaderboard/ProfileRecordTable.vue";
import VerificationIcon from "@/assets/trophies/2.png"
import CompletedIcon from "@/assets/trophies/4.png"
import CreatedIcon from "@/assets/trophies/5.png"
import PublishedIcon from "@/assets/trophies/6.png"
import ProfileLevelsTable from "@/components/leaderboard/ProfileLevelsTable.vue";
import LoadingPanel from "@/components/util/LoadingPanel.vue";
import {LoadingStatus} from "@/loadingStatus";

const props = defineProps(['user_id'])

const user_data = ref()
const loading_status = ref()

watch(props, async (newValue, _) => {
  loading_status.value = LoadingStatus.LOADING;
  try {
    user_data.value = await pb.send("/api/aredl/profiles/" + newValue.user_id, {})
    loading_status.value = LoadingStatus.FINISHED;
  } catch (error) {
    console.log(error)
    loading_status.value = LoadingStatus.ERROR;
  }
})

const points = computed(() => {
  if (user_data.value.rank) {
    return user_data.value.rank.points
  }
  return 0
})

const pack_points = computed(() => {
  if (!user_data.value.packs) {
    return 0
  }
  const mapped = user_data.value.packs.map(pack => pack.points)
  return mapped.reduce((result, val) => {
    return result + val
  }, 0.0).toFixed(1)
})

const verifications = computed(() => {
  if (!user_data.value.records) {
    return []
  }
  return user_data.value.records.filter((record) => {return record.placement_order === 1})
})

const records = computed(() => {
  if (!user_data.value.records) {
    return []
  }
  return user_data.value.records.filter((record) => {return record.placement_order !== 1})
})

const display_role = (role) => {
  switch (role) {
    case "listOwner": return "List Owner"
    case "listAdmin": return "List Admin"
    case "listMod": return "List Moderator"
    case "listHelper": return "List Helper"
    case "developer": return "Developer"
    case "aredlPlus": return "AREDL+"
  }
  return "unknown role"
}

</script>

<template>
  <LoadingPanel :status="loading_status">
    <div class="profile-view" v-if="user_data">
      <div class="header">
        <!--<div class="profile_avatar">
          <img :src="user_data.avatar_url" alt="">
        </div> -->
        <div class="profile_text">
          <div class="profile_name">
            <h2>{{user_data.rank && '#' + user_data.rank.position}}</h2>
            <h2>{{user_data.global_name}} </h2>
            <RoleIcon class="role_icon" v-for="role in user_data.roles" :role="role"></RoleIcon>
          </div>
          <div class="profile_sub_text">
            <p>{{points}} points </p>
          </div>
        </div>
      </div>
      <div class="completed-packs" v-if="user_data.packs">
        <div class="pack_title">
          <h3>Completed Packs ({{user_data.packs.length}})</h3>
          <h4>+{{pack_points}} points</h4>
        </div>
        <div class="pack_list">
          <PackDisplay v-for="pack in user_data.packs" :pack="pack"></PackDisplay>
        </div>
      </div>
      <div class="records">
        <div class="left">
          <ProfileRecordTable class="verified" v-if="verifications.length > 0" :records="verifications" title="Verified" :icon="VerificationIcon"></ProfileRecordTable>
          <ProfileRecordTable v-if="records.length > 0" :records="records" title="Completed" :icon="CompletedIcon"></ProfileRecordTable>
        </div>
        <div class="right" v-if="verifications.length > 0 || user_data.created_levels.length > 0">
          <ProfileLevelsTable class="created" v-if="user_data.created_levels.length > 0" :levels="user_data.created_levels" title="Created" :icon="CreatedIcon"></ProfileLevelsTable>
          <ProfileLevelsTable class="published" v-if="user_data.published_levels.length > 0" :levels="user_data.published_levels" title="Published" :icon="PublishedIcon"></ProfileLevelsTable>
        </div>
      </div>
    </div>
  </LoadingPanel>
</template>

<style scoped>
.records {
  display: flex;
  flex-direction: row;
  flex-flow: row wrap-reverse;
  align-items: flex-end;
  gap: 1.5rem;
  width: 100%;

  & .right {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    max-width: 17rem;
    height: fit-content;
  }

  & .left {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    max-width: 29rem;
    height: fit-content;
  }
}

.profile-view {
  padding-top: 1rem;
  padding-left: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.header {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding-left: 1rem;
  height: 5rem;

  & .profile_avatar {
    background-color: color-mix(in srgb, var(--color-on-primary), transparent 80%);
    border-radius: 50%;
    height: 5rem;
    width: 5rem;

    & img {
      height: 100%;
    }
  }

  & .profile_text {

    & .profile_name {
      display: flex;
      align-items: center;
      gap: 0.5rem;

      & .role_icon {
        width: 2rem;
        height: 2rem;
      }
    }

    & .profile_sub_text {
      display: flex;
      gap: 0.75rem;
    }
  }
}

.completed-packs {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding-bottom: 1rem;

  & .pack_list {
    max-width: 60rem;
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
  }

  & .pack_title {
    display: flex;
    flex-direction: row;
    gap: 0.5rem;
    align-items: center;
  }
}

@media (max-width: 880px) {

  .profile-view {
    gap: 1rem;
    padding-left: 0.5rem;
  }

}

</style>