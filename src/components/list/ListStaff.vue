<script setup>
import {onMounted, ref} from "vue";
import {pb} from "@/pocketbase";
import UserNameDisplay from "@/components/UserNameDisplay.vue";
import RoleIcon from "@/components/util/RoleIcon.vue";
import LoadingPanel from "@/components/util/LoadingPanel.vue";
import {LoadingStatus} from "@/loadingStatus";

const staff_data = ref()
const supporter_data = ref()
const loading_status = ref(LoadingStatus.LOADING)

onMounted(async () => {
  let result;
  try {
    result = await pb.send("/api/aredl/names", {});
  } catch (error) {
    loading_status.value = LoadingStatus.ERROR;
    return;
  }
  const staff_roles = ["listOwner", "listAdmin", "developer", "listMod", "listHelper"]
  const supporter_roles = ["aredlPlus"]
  const staffData = {}
  for (const role of staff_roles) {
    staffData[role] = result[role]
  }
  staff_data.value = staffData
  const supporterData = {}
  for (const role of supporter_roles) {
    supporterData[role] = result[role]
  }
  supporter_data.value = supporterData
  loading_status.value = LoadingStatus.FINISHED;
})
</script>

<template>
  <LoadingPanel :status="loading_status">
    <div class="list-staff" v-if="staff_data">
      <h3 class="title">List Editors</h3>
      <div class="name-tab" v-for="(users, name) in staff_data">
        <div v-for="user in users" class="role-tab">
          <RoleIcon class="role_icon" :role="name"></RoleIcon>
          <UserNameDisplay :user_data="user"></UserNameDisplay>
        </div>
      </div>
      <template v-if="Object.entries(supporter_data).length > 0">
        <h3 class="title">
          Supporters
        </h3>
        <div class="name-tab" v-for="(users, name) in supporter_data">
          <div v-for="user in users" class="role-tab">
            <RoleIcon class="role_icon" :role="name"></RoleIcon>
            <UserNameDisplay :user_data="user"></UserNameDisplay>
          </div>
        </div>
      </template>
    </div>
  </LoadingPanel>
</template>

<style scoped>

.title {
  align-self: center;
  font-size: 23px;
  padding: 0.5rem 0;
}

.list-staff {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
}

.name-tab {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  justify-content: center;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 0.5rem;
  padding: 0.25rem 0.5rem;
}

.role-tab{
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 0.5rem;

  & .role_icon {
    height: 1.25rem;
    width: 1.25rem;
  }
}

</style>