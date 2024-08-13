<script setup>

import {store} from "@/main";
import {onMounted, ref} from "vue";
import {pb} from "@/pocketbase";
import SubmissionInfo from "@/components/submit/SubmissionInfo.vue";
import RecordInfo from "@/components/submit/RecordInfo.vue";
import SubmissionForm from "@/components/submit/SubmissionForm.vue";

const submissions = ref(null)
const records = ref(null)

const SubmissionType = {
  NEW: 0,
  OPEN_SUBMISSION: 1,
  RECORD: 2,
}

onMounted(async () => {
  submissions.value = await pb.send("/api/aredl/user/submissions", {})
  records.value = await pb.send("/api/aredl/user/records", {})
  console.log(records.value)
})

</script>

<template>
  <template v-if="store.hasPermission('aredl.user_submit').value">
    <div class="container">
      <div class="left-bar">
        <div class="submission-list">
          <div class="submission-new">
            <span>New Submission</span>
          </div>
          <template v-if="(submissions && submissions.length > 0) || (records && records.length > 0)">
            <h3>Submissions</h3>
            <SubmissionInfo v-for="submission in submissions" :submission="submission"></SubmissionInfo>
            <RecordInfo v-for="record in records" :record="record"></RecordInfo>
          </template>
        </div>
      </div>
      <div class="main">
        <SubmissionForm></SubmissionForm>
      </div>
      <div class="right-bar">
        <div class="submission-rules">
          <h3>
            > Submission Requirements
          </h3>
          <p>
            When submitting your record, please ensure that you have the following:
          </p>
          <p>
            - Your recording is a complete playthrough of the level from 0-100 without any cuts (if there are cuts in your video please include raw footage that doesn't have the cuts)
          </p>
          <p>
            - Your completion needs to have clicks. If it doesn't, you have to provide a raw footage with clicks. If you don't, your record will be rejected.
          </p>
          <p>
            - Achieved the record on the level that is listed on the site - please check the level ID before you submit a record
          </p>
          <p>
            - The record has been achieved without using a secret way or a bugged route
          </p>
          <p>
            - Cheat Indicator (If you are using a mod menu that supports one, like Megahack v7)
          </p>
          <p>
            - End stats (The whole box must appear for at least one frame)
          </p>
          <p>
            - FPS/TPS Counter (For mod menus that support one (must NOT exceed 360 on either))
          </p>
          <p>
            - Raw footage AND clicks will ALWAYS be required for levels in the top 250.
          </p>
          <p>
            - Refer to -This Sheet- for a list of allowed and disallowed hacks
          </p>
          <h3>
            > Why was my record denied?
          </h3>
          <p>
            If your record was denied, please check the rejected submission.
          </p>
          <p>
            In the case your submission was rejected because of invalid or missing information, update the data accordingly.
          </p>
          <p>
            If the record was wrongfully denied, please make a post in #support or DM any list staff on Discord
          </p>
        </div>
      </div>
    </div>
  </template>
  <template v-else>
    <div class="submissions-closed">
      <h1>
        Submissions are currently closed
      </h1>
    </div>
  </template>
</template>

<style scoped>

.container {
  display: grid;
  grid-template-rows: minmax(0, 1fr);
  grid-template-columns: minmax(12rem, 16rem) 2fr minmax(16rem, 1fr);
  grid-template-areas: "list form info";
  overflow: auto;
  height: 100%;
  width: 100%;
}

.left-bar {
  height: 100%;
  width: 100%;
  grid-area: list;
  overflow: auto;
  & .submission-list {
    width: 100%;
    display: flex;
    overflow: auto;
    flex-direction: column;
    padding: 1rem;
    gap: 0.5rem;
    align-items: center;

    & h3 {
      margin-top: 0.75rem;
      margin-bottom: 0.25rem;
    }
  }
}

.right-bar {
  height: 100%;
  grid-area: info;
  overflow: clip;
}

.main {
  grid-area: form;
  width: 100%;
}

.submission-rules {
  display: flex;
  overflow: auto;
  flex-direction: column;
  padding: 1rem;
  gap: 1.2rem;
  height: 100%;
  font-size: 17px;

  & p {
    padding-left: 0.5rem;
  }
}

.submissions-closed {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
}

.submission-new {
  cursor: pointer;
  display: flex;
  gap: 0.5rem;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  padding: 5px 5px 8px 5px;
  width: 100%;
  height: 3.5rem;
  border-style: solid;
  border-radius: 0.5rem;
  border-color: color-mix(in srgb, var(--color-background), #4f772d 100%);
  background-color: var(--color-background);
  transition: background-color 200ms ease;

  &:hover {
    background-color: color-mix(in srgb, var(--color-background), #4f772d 70%);
  }
}
</style>