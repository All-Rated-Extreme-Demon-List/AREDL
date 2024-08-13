<script setup>
import {computed} from "vue";
import VideoLink from "@/components/util/VideoLink.vue";
import LevelDisplay from "@/components/util/LevelDisplay.vue";
import ProfileTableTitle from "@/components/leaderboard/ProfileTableTitle.vue";

const props = defineProps(['title', "icon", "records"])

const total_points = computed(() => {
  return props.records.reduce((sum, record) => {return sum + record.level.points}, 0.0).toFixed(1)
})

const level_count = computed(() => {
  return props.records.filter((r) => r.level.legacy !== true).length
})

</script>

<template>
  <div class="container">
    <ProfileTableTitle :title="title" :icon="icon" :count="level_count" :points="total_points"></ProfileTableTitle>
    <div class="list">
      <table>
        <tr v-for="(record, index) in records" :class="(index !== 0 && records[index - 1].level.legacy !== record.level.legacy) && 'firstLegacy'">
          <td class="record_level_rank">
            #{{record.level.position}}
          </td>
          <td class="record_level_name">
            <LevelDisplay class="content" :level_data="record.level"></LevelDisplay>
          </td>
          <td class="record_video">
            <VideoLink :video_url="record.video_url"></VideoLink>
          </td>
          <td class="record_points" v-if="record.level.points > 0.0">
            +{{record.level.points.toFixed(1)}}
          </td>
        </tr>
      </table>
    </div>
  </div>
</template>

<style scoped>
.list {
  width: 100%;

  & table {
    width: 100%;
    border-spacing: 15px 10px;

    & td {
      margin: 0;
      text-align: left;
      font-size: 17px;
      height: 30px;
    }

    & .record_level_rank {
      text-align: right;
      width: 2rem;
    }

    & .record_points {
      text-align: right;
      width: 3.5rem;
    }

    & .record_video {
      width: 30px;
    }
  }
}

.firstLegacy td {
  padding-top: 1.5rem;
}

.container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

@media (max-width: 880px) {
  .list {

    & table {
      border-spacing: 8px 3px;
      padding-bottom: 1rem;

      & td {
        vertical-align: center;
        height: 30px;
      }

      & .record_level_name {
        max-width: 12rem;
        overflow-x: clip;
      }

      & .record_level_rank {
        text-align: right;
        width: 2rem;
      }

      & .record_points {
        text-align: right;
        width: 3.5rem;
      }
    }
  }
}

</style>