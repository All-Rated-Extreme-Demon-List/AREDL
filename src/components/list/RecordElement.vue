<script setup>
import UserNameDisplay from "@/components/UserNameDisplay.vue";
import VideoLink from "@/components/util/VideoLink.vue";

const props = defineProps(['record_data', 'position'])

</script>

<template>
  <div class="record-element">
    <div class="left-view">
      <div class="rank">
        #{{position}}
      </div>
      <UserNameDisplay :user_data="record_data.submitted_by" class="record-holder"></UserNameDisplay>
    </div>
    <div class="right-view">
      <div class="mobile" :class="record_data.mobile && 'show'">
        Mobile
      </div>
      <VideoLink class="record-video" :video_url="record_data.video_url"></VideoLink>
      <div class="record-fps">
        {{props.record_data.fps}} Fps
      </div>
    </div>
  </div>
</template>
<style scoped>

.record-element {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}

.record-element .left-view {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 1rem;
}

.record-element .left-view .rank {
  font-size: 17px;
  min-width: fit-content;
  text-align: right;
}

.record-element .right-view {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 2rem;
}

.record-element .right-view .record-fps {
  font-size: 17px;
  width: 4.2rem;
  text-align: right;
}

.record-element .right-view .record-video {
  font-size: 17px;
  height: 100%;
}

.mobile {
  visibility: hidden;
}

.show {
  visibility: visible;
}

@media (max-width: 880px) {
  .record-element .left-view {
    font-size: 10px;
  }

  .record-element .right-view {
    gap: 0.25rem;
  }

  .record-element {
    width: 100%;
  }

  .record-holder {
    max-width: 9rem;
    overflow-x: clip;
  }

  .record-element .right-view .record-fps {
    font-size: 14px;
    width: 3.5rem;
    text-align: right;
  }

  .record-element .left-view .rank {
    font-size: 14px;
  }

  .mobile {
    font-size: 12px;
  }
}
</style>