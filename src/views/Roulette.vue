<script setup>

import {computed, onMounted, ref, watch} from "vue";
import {pb} from "@/pocketbase";

const settings = ref(null)
const currentRoulette = ref(null)

const listData = ref()
const loading = ref(true)

const inputPercent = ref()

const getDefaultSettings = () => {
  return {
    minPlacement: 1,
    maxPlacement: listData ? listData.value.length : 1,
    excludeTwoPlayer: true,
    skips: 3,
    finished: false,
    excludedLevels: [],
  }
}

const selectableLevels = computed(() => {
  if (loading.value) return []
  return listData.value
      .filter((level) => level.position <= settings.value.maxPlacement && level.position >= settings.value.minPlacement
          && !(settings.value.excludeTwoPlayer && level.two_player)
      )
})

const availableLevels = computed(() => {
  return selectableLevels.value
      .filter((level) => level.position <= settings.value.maxPlacement && level.position >= settings.value.minPlacement
          && !(settings.value.excludeTwoPlayer && level.two_player)
          && !settings.value.excludedLevels.some((excluded) => excluded.id === level.id)
      )
})

const startRoulette = async () => {
  const levels = generateLevels()
  let firstLevel = levels[0]
  firstLevel.percent = 1
  currentRoulette.value = {
    settings: JSON.parse(JSON.stringify(settings.value)),
    preGeneratedList: levels.slice(1, 100),
    levels: [firstLevel],
    score: 0,
    remainingSkips: settings.value.skips,
  }
}

const next = (skipped) => {
  const currentPercent = currentRoulette.value.levels[currentRoulette.value.levels.length - 1].percent
  let percent
  if (skipped) {
    percent = currentPercent;
    if (currentRoulette.value.remainingSkips === 0) return
    currentRoulette.value.remainingSkips -= 1
  } else if (!inputPercent || inputPercent.value == null) {
    percent = currentPercent;
  } else {
    if (inputPercent.value < currentPercent || inputPercent.value > 100) return
    percent = inputPercent.value
  }
  currentRoulette.value.score = currentRoulette.value.levels.length
  currentRoulette.value.levels[currentRoulette.value.levels.length - 1].skipped = skipped
  currentRoulette.value.levels[currentRoulette.value.levels.length - 1].percent = percent
  if (inputPercent.value === 100) {
    currentRoulette.value.preGeneratedList = []
    currentRoulette.value.finished = true
    return
  }
  const nextLevel = currentRoulette.value.preGeneratedList[0];
  nextLevel.percent = percent + 1;
  const skippedLevels = percent - currentPercent
  currentRoulette.value.levels.push(nextLevel)
  currentRoulette.value.preGeneratedList = currentRoulette.value.preGeneratedList.slice(1, currentRoulette.value.preGeneratedList.length - skippedLevels)
  inputPercent.value = null

  console.log(currentRoulette.value)
}

const end = () => {
  currentRoulette.value.finished = true
  currentRoulette.value.score = currentRoulette.value.levels.length - 1
}

const generateLevels = () => {

  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {

      // Generate random number
      let j = Math.floor(Math.random() * (i + 1));

      let temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }

    return array;
  }

  let levels = availableLevels.value
  levels = shuffleArray(levels).slice(0, 100)
  // remove reference from available levels
  levels = JSON.parse(JSON.stringify(levels))
  return levels
}

onMounted(async () => {
  listData.value = await pb.send("/api/aredl/list", {})
  listData.value = listData.value.filter((level) => !level.legacy)
  loading.value = false

  console.log(listData.value)
  settings.value = getDefaultSettings()
})

watch(selectableLevels, (newVal) => {
  if (!settings) return
  settings.value.excludedLevels = settings.value.excludedLevels.filter((level) => newVal.some((selectable) => selectable.id === level.id))
})

watch(currentRoulette, (newVal) => console.log(newVal))

</script>

<template>
  <div class="page" v-if="!loading">
    <div class="settings" v-if="settings">
      <form>
        <div class="attributes">
          <div class="input-field">
            <label>Min Placement</label>
            <input v-model="settings.minPlacement" placeholder="minPlacement" type="number">
          </div>
          <div class="input-field">
            <label>Max Placement</label>
            <input v-model="settings.maxPlacement" placeholder="maxPlacement" type="number">
          </div>
          <div class="input-field">
            <label>Exclude 2p</label>
            <input v-model="settings.excludeTwoPlayer" placeholder="excludeTwoPlayer" type="checkbox">
          </div>
          <div class="input-field">
            <label>Skips</label>
            <input v-model="settings.skips" placeholder="skips" type="number">
          </div>
        </div>
        <FloatLabel class="excluded-levels w-full">
          <label for="excluded-levels" class="excluded-label">{{(settings.excludedLevels && settings.excludedLevels.length > 0) ? 'Excluded' : 'No excluded levels'}}</label>
          <Multiselect
              id="excluded-levels"
              v-model="settings.excludedLevels"
              :options="selectableLevels"
              option-label="name"
              class="level-select"
              placeholder="Exclude levels"
              display="chip"
              :show-toggle-all="false"
              filter
              :virtual-scroller-options="{itemSize: 30}"
          >
            <template #footer>
              <div class="py-2 px-3">
                <b>{{ settings.excludedLevels ? settings.excludedLevels.length : 0 }}</b> level{{ (settings.excludedLevels ? settings.excludedLevels.length : 0) > 1 ? 's' : '' }} selected.
              </div>
            </template>
          </Multiselect>
        </FloatLabel>
      </form>
      <div class="actions">
        <button @click="startRoulette">
          <h3>Start</h3>
        </button>
        <span class="level-count">
            Available levels: {{availableLevels.length}}
        </span>
      </div>
    </div>
    <div v-if="currentRoulette" class="full-roulette">
      <div class="roulette-container">
        <div v-for="(level, index) in currentRoulette.levels" class="level-container">
          <h3>#{{level.position}} - {{level.name}}</h3>
          <button v-clipboard:copy="level.level_id"><h4>({{level.level_id}})</h4></button>
          <div v-if="index === currentRoulette.levels.length - 1 && !currentRoulette.finished" class="level-interact">
            <input type="number" :placeholder="'At least ' + level.percent + ' or more'" v-model="inputPercent" v-on:keyup.enter="next()"/>
            <button @click="next(false)">Next</button>
            <button v-if="currentRoulette.remainingSkips > 0" @click="next(true)">Skip</button>
            <button @click="end()">End</button>
          </div>
        </div>
      </div>
      <div v-if="currentRoulette.finished" class="roulette-container">
        <h2>Finished with a score of {{currentRoulette.score}}</h2>
        <h3 v-if="currentRoulette.preGeneratedList.length > 0">Remaining levels</h3>
        <div v-for="level in currentRoulette.preGeneratedList" class="level-container">
          <h3>#{{level.position}} - {{level.name}}</h3>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

.page {
  display: flex;
  flex-direction: column;
  width: 100%;
  align-items: center;
  gap: 2rem;
}

.full-roulette {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-width: 40rem;
}

.roulette-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;

  & .level-container {
    display: flex;
    border: 2px solid var(--color-primary);
    border-radius: 0.5rem;
    padding: 0.5rem;
  }
}

.settings {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  margin-top: 1rem;

  & form {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    gap: 1rem;

    & .attributes {
      display: flex;
      gap: 2rem;
      & .input-field {
        display: flex;
        gap: 0.5rem;
        align-items: center;

        & input {
          max-width: 2.5rem;
        }
      }
    }

    & .excluded-levels {
      margin-top: 1rem;
      max-width: 40rem;
      display: flex;
      flex-direction: column;

      & .excluded-label {
        font-size: 16px;
      }

      & .level-select {
      }
    }

  }

  & .actions {
    display: flex;
    gap: 0.5rem;
    align-items: center;

    & button {

    }

  }
}
</style>