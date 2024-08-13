<script setup>
import UserNameDisplay from "@/components/UserNameDisplay.vue";
import VideoLink from "@/components/util/VideoLink.vue";

const props = defineProps(['record_data', 'position'])

</script>

<template>
  <tr>
    <td class="rank">
      #{{position}}
    </td>
    <td class="name-column">
      <UserNameDisplay :user_data="record_data.submitted_by" class="record-holder"></UserNameDisplay>
    </td>
    <td>
      <VideoLink class="record-video" :video_url="record_data.video_url"></VideoLink>
    </td>
    <td class="mobile" v-if="record_data.mobile">
      Mobile
    </td>
  </tr>
</template>
<style scoped>
td {
  padding-right: 10px;
  padding-bottom: 10px;
}

.name-column {
  max-width: 15rem;
}

.record-holder {
  font-size: 18px;
}

.rank {
  font-size: 18px;
  min-width: fit-content;
  text-align: right;
}

.mobile {
  font-size: 18px;
}

@media (max-width: 880px) {

}
</style>