<script setup>
import {ref, watch} from "vue";
import {pb} from "@/pocketbase";
import YoutubeEmbed from "@/components/YoutubeEmbed.vue";
import RecordElement from "@/components/list/RecordElement.vue";
import LevelAuthors from "@/components/list/LevelAuthors.vue";
import PackDisplay from "@/components/PackDisplay.vue";
import LoadingPanel from "@/components/util/LoadingPanel.vue";
import {LoadingStatus} from "@/loadingStatus"

const props = defineProps(['selected_level'])

const level_data = ref()
const creator_and_verifier = ref()
const loading_status = ref()

watch(props, async (newValue, _) => {
  loading_status.value = LoadingStatus.LOADING
  try {
    level_data.value = await pb.send("/api/aredl/levels/" + newValue.selected_level.id, {
      query: {
        two_player: newValue.selected_level.two_player,
        records: true,
        creators: true,
        verification: true,
        packs: true,
      }
    })
  } catch (error) {
    loading_status.value = LoadingStatus.ERROR;
    return;
  }

  if (level_data.value.creators.length === 0 && level_data.value.verification.submitted_by.id === level_data.value.publisher.id) {
    creator_and_verifier.value = level_data.value.publisher
  } else {
    creator_and_verifier.value = null
  }
  loading_status.value = LoadingStatus.FINISHED
  //console.log(level_data.value)
})
</script>

<template>
  <LoadingPanel :status="loading_status">
    <div class="level-content" v-if="level_data">
      <h1>{{level_data.name + (level_data.legacy ? " (legacy)" : "")}}</h1>
      <LevelAuthors :level_data="level_data"></LevelAuthors>
      <div class="packs">
        <PackDisplay :pack="pack" v-for="pack in level_data.packs"></PackDisplay>
      </div>
      <YoutubeEmbed :video_url="level_data.verification.video_url"></YoutubeEmbed>
      <ul class="level-info">
        <li>
          <h3>List Points</h3>
          <p>{{level_data.points}}</p>
        </li>
        <li>
          <h3>Level Id</h3>
          <p>{{level_data.level_id}}</p>
        </li>
        <li>
          <h3>Password</h3>
          <p>{{level_data.level_password ? level_data.level_password : "Free to Copy"}}</p>
        </li>
      </ul>
      <div class="level-records">
        <template v-if="level_data.records.length === 0">
          <h2>No Records</h2>
        </template>
        <template v-else>
          <h2>Records ({{level_data.records.length}})</h2>
          <table class="record-list">
            <RecordElement v-for="(record, index) in level_data.records" :record_data="record" :position="index + 1"></RecordElement>
          </table>
        </template>
      </div>
    </div>
  </LoadingPanel>
</template>

<style scoped>
.level-content {
  display: flex;
  flex-direction: column;
  margin-left: 2rem;
  padding-top: 2rem;
  padding-right: 2rem;
  max-width: 50rem;
  gap: 0.75rem;
  height: 100%;
}

.level-content h1 {
  font-size: 51px;
  line-height: 52px;
  letter-spacing: -2px;
  padding-bottom: 1rem;
  font-weight: 700;
}

.level-content h2 {
  font-size: 34px;
  letter-spacing: -1px;
}

.level-records {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding-bottom: 2rem;
}

.level-records .record-list {
  table-layout: auto;
  border-collapse: separate;
  width: fit-content;
}

.packs {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.level-info {
  list-style: none;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  font-size: 17px;
  margin: 0;
  padding: 0;

  & li {
    display: flex;
    gap: 0.5rem;
    flex-direction: column;
    align-items: center;
  }
}

@media (max-width: 880px) {

  h1 {
    overflow-x: clip;
  }

  .level-content h1 {
    font-size: 40px;
    line-height: 30px;
  }

  .level-content h2 {
    font-size: 24px;
  }

  .level-content {
    width: 100%;
    margin-left: 0;
    padding-left: 1rem;
    padding-top: 1rem;
    padding-right: 1rem;
  }

  .packs {
    font-size: 14px;
  }
}

</style>