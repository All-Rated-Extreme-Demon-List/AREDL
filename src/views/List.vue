<script setup>
import {ref} from "vue";
import LevelView from "@/components/list/LevelView.vue";
import ListStaff from "@/components/list/ListStaff.vue";
import ListView from "@/components/list/ListView.vue";

const selected_level = ref()

</script>

<template>
  <div class="page">
    <div class="list-tab tab">
      <ListView @select="(id) => selected_level = id"></ListView>
    </div>
    <div class="level-tab tab">
      <LevelView :level_id="selected_level" class="level-view"></LevelView>
    </div>
    <div class="info-tab tab">
      <div class="info-view">
        <ListStaff></ListStaff>
        <div class="info-text">
          <h3>
            > How to Submit Records
          </h3>
          <div class="info-paragraph">
            <p>
              Log into the site with discord. <br>
              Hover over your profile avatar. <br>
              You'll find the submission page in the dropdown menu.
            </p>
          </div>
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

</style>