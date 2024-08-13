<script setup>
import UserNameDisplay from "@/components/UserNameDisplay.vue";
import {ref, watch} from "vue";

const props = defineProps(['level_data'])

const created_and_verified = ref(false)

watch(props, async (newValue, _) => {
  const level_data = newValue.level_data
  created_and_verified.value = level_data.creators.length === 1 && level_data.creators[0].id === level_data.verification.submitted_by.id;
})

</script>

<template>
  <div class="level-authors">
    <h3 v-if="!created_and_verified">{{props.level_data.creators.length > 1 ? "creators": "creator"}}</h3>
    <div v-if="!created_and_verified" class="author-list">
      <UserNameDisplay v-for="creator in level_data.creators" :user_data="creator" class="author-name">
      </UserNameDisplay>
    </div>
    <h3 v-if="!created_and_verified">verifier</h3>
    <h3 v-else>creator & verifier</h3>
    <div class="author-list">
      <UserNameDisplay :user_data="props.level_data.verification.submitted_by"  class="author-name">
      </UserNameDisplay>
    </div>
    <h3>publisher</h3>
    <div class="author-list">
      <UserNameDisplay :user_data="props.level_data.publisher"  class="author-name">
      </UserNameDisplay>
    </div>
  </div>
</template>

<style scoped>
.level-authors .author-name:not(:last-child)::after {
  content: ', ';
  color: var(--color-on-primary);
}

.level-authors h3 {
  font-size: 17px;
  line-height: 18px;
  font-weight: 700;
  margin: 0;
  text-transform: uppercase;
  color: var(--color-on-primary);
}

.author-list {
  display: flex;
  column-gap: 0.3rem;
  row-gap: 0.5rem;
  flex-wrap: wrap;
}

.author-name {
  height: 21px;
  line-height: 18px;
  text-align: center;
}

.level-authors {
  display: grid;
  grid-template-columns: max-content 2fr;
  grid-auto-rows: max-content;
  gap: 0.5rem 1rem;
}

@media (max-width: 880px) {
  .level-authors h3 {
    font-size: 15px;
    line-height: 18px;
    font-weight: 700;
    text-transform: uppercase;
    color: var(--color-on-primary);
  }

  .author-name {
    text-align: center;
  }

  .level-authors {
    display: grid;
    grid-template-columns: max-content 2fr;
    grid-auto-rows: max-content;
    gap: 1rem 1rem;
  }

}

</style>