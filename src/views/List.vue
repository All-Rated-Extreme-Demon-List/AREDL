<script setup>
import {ref} from "vue";
import LevelView from "@/components/list/LevelView.vue";
import ListStaff from "@/components/list/ListStaff.vue";
import ListView from "@/components/list/ListView.vue";

const selected_level = ref()

const mobile_list_expanded = ref(true)

</script>

<template>
  <div class="page">
    <div class="list-tab tab" :class="!mobile_list_expanded && 'hidden-mobile'">
      <ListView @select="(selected) => {selected_level = selected; if (mobile_list_expanded) mobile_list_expanded = selected.init}"></ListView>
    </div>
    <button class="mobile-expand" @click="mobile_list_expanded = !mobile_list_expanded">{{mobile_list_expanded ? "<" : ">"}}</button>
    <div class="level-tab tab" :class="mobile_list_expanded && 'hidden-mobile'">
      <LevelView :selected_level="selected_level" class="level-view"></LevelView>
    </div>
    <div class="info-tab tab">
      <div class="info-view">
        <ListStaff></ListStaff>
        <div class="info-text">
          <h3>> How to Submit Records</h3>
          <p>
            Join our discord server, and  use /record submit
          </p>
          <h3>> Submission Requirements</h3>
          <p>
            When submitting your record, please ensure that it complies with the following guidelines:
          </p>
          <p>
            - Your recording is a complete playthrough of the level from 0-100 without any cuts (if there are cuts in your video, please include an uncut raw footage)
          </p>
          <p>
            - Your completion needs to have clicks. If it doesn't (or if it only does for a part of the level, and not the entire run), you have to provide a raw footage with clicks. If you don't, your record will be rejected. Mobile players are NOT exempt from this rule, recorded taps are required.
          </p>
          <p>
            - Achieved the record on the level that is listed on the site (or an approved LDM of it) - please check the level ID before you submit a record
          </p>
          <p>
            - The record has been achieved without using a secret way or a bugged route
          </p>
          <p>
            - Cheat Indicator is required if you are using a mod menu that supports one, like Megahack v8.
          </p>
          <p>
            - End stats (The whole box must appear for at least one frame)
          </p>
          <p>
            - FPS/TPS counter is required only on 2.1 GDPS up to 360 fps/tps
          </p>
          <p>
            - Using physics bypass on any level in 2.2 is not allowed, and will get your record rejected
          </p>
          <p>
            - Using the 2.1 GDPS is allowed for levels verified in 2.1, up to 360 FPS/TPS
          </p>
          <p>
            - Raw footage (or a pointercrate record of the level) AND clicks will ALWAYS be required for levels in the top 250.
          </p>
          <p>
            - Refer to <a href="https://docs.google.com/spreadsheets/d/10AjUUcTpAzOqdfnbz0wtYskL9TdwT4Onv_Fldt5NXBg/edit?usp=sharing">-This Sheet-</a> for a list of allowed and disallowed hacks
          </p>
          <h3>> Why was my record denied?</h3>
          <p>
            If your record was denied, please check the following:
          </p>
          <p>
            Does the video meet the requirements? (Above)
          </p>
          <p>
            Is the level placed on the list? (#pending-changes)
          </p>
          <p>
            Was the submission command filled out correctly?
          </p>
          <p>
            Was the record submitted with several links?
          </p>
          <p>
            Note: You will be pinged in #records with the reason why your record was denied. If you are still unsure of why it was denied, or if the record was wrongfully denied, please make a post in #support or DM any list staff on Discord
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

.page {
  overflow: hidden;
  height: 100%;
  display: grid;
  grid-template-rows: minmax(0, 1fr);
  grid-template-columns: minmax(16rem, 1fr) minmax(16rem, 2fr) minmax( 16em, 1fr );
}

.info-view {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.info-view h3 {
  color: var(--color-on-primary);
  font-size: 23px;
}

.info-text {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.info-paragraph {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.info-view p {
  color: var(--color-on-primary);
  font-size: 17px;
  line-height: 28px;
}

.tab {
  height: 100%;
  display: block;
  overflow-y: auto;
}

.info-tab {
  padding-top: 1.5rem;
  padding-right: 2rem;
  padding-left: 2rem;
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
    display: flex;
  }

  .info-tab {
    display: none;
  }

  .level-tab {
    width: 100%;
  }

  .list-tab {
    width: 100%;
  }
}

</style>