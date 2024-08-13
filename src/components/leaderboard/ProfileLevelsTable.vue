<script setup>
import LevelDisplay from "@/components/util/LevelDisplay.vue";
import ProfileTableTitle from "@/components/leaderboard/ProfileTableTitle.vue";

const props = defineProps(["title", "icon", "levels"])

</script>

<template>
  <div class="container">
    <ProfileTableTitle :title="title" :icon="icon" :count="levels.length"></ProfileTableTitle>
    <div class="list">
      <table>
        <tr v-for="level in levels">
          <td class="record_level_rank">
            #{{level.position}}
          </td>
          <td class="record_level_name">
            <LevelDisplay :level_data="level"></LevelDisplay>
          </td>
        </tr>
      </table>
    </div>
  </div>
</template>

<style scoped>
.container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.list {
  width: 100%;

  & table {
    width: 100%;
    border-spacing: 15px 5px;

    & td {
      margin: 0;
      vertical-align: center;
      font-size: 17px;
      height: 30px;
    }

    & .record_level_rank {
      text-align: right;
      width: 2rem;
    }
  }
}

</style>