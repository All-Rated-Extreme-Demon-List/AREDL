<script setup>
import {onMounted, ref, watch} from "vue";

const props = defineProps(['pack'])

const sortLevels = () => {
  props.pack.levels.sort((left, right) => {
    return left.position - right.position;
  })
}

onMounted(async () => {
  sortLevels()
})

watch(props, () => {
  sortLevels()
})

</script>

<template>
  <div class="pack_view" :style="{'background': pack.color}">
    <div class="content">
      <div class="pack_header">
        <span>{{pack.name}}</span>
        <span>{{pack.points}} points</span>
      </div>
    </div>
    <div class="content sub_content">
      <div class="pack_content">
        <table>
          <tr v-for="level in pack.levels">
            <td class="rank">#{{level.position}}</td>
            <td>
              <RouterLink :to="{ name:'ListSelect', params: {id: level.level_id}}" class="level_name">
                {{level.name}}
              </RouterLink>
            </td>
          </tr>
        </table>
      </div>
    </div>
  </div>
</template>

<style scoped>
.pack_view {
  background-size: 100% auto !important;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  width: 16rem;
  height: 14rem;
  white-space: nowrap;
  padding: 3px;
  border-radius: 0.5rem;

  & .pack_header {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    padding: 5px;
    background-color: color-mix(in srgb, var(--color-background), rgba(255, 255, 255, 5%) 6.5%);
    transition: background-color 400ms ease;
    flex-direction: column;
    border-radius: 0.5rem;
    text-shadow: 0 0 2px var(--color-background), 0 0 2px var(--color-background), 0 0 2px var(--color-background), 0 0 2px var(--color-background), 0 0 2px var(--color-background), 0 0 2px var(--color-background), 0 0 2px var(--color-background), 0 0 2px var(--color-background), 0 0 2px var(--color-background);
  }

  & .sub_content {
    height: 100%;
  }

  & .pack_content {
    height: 100%;
    padding: 5px;
    overflow: hidden;
    background-color: color-mix(in srgb, var(--color-background), rgba(255, 255, 255, 5%) 6.5%);
    border-radius: 0.5rem;
    text-shadow: 0 0 2px var(--color-background), 0 0 2px var(--color-background), 0 0 2px var(--color-background), 0 0 2px var(--color-background), 0 0 2px var(--color-background), 0 0 2px var(--color-background), 0 0 2px var(--color-background), 0 0 2px var(--color-background), 0 0 2px var(--color-background);


    & table {
      gap: 0.5rem;
      height: 100%;
      border-spacing: 3px 3px;

      & td {
        height: fit-content;
      }
    }
  }

  & .rank {
    text-align: right;
  }

  & .level_name {
    text-decoration: none;
    border-radius: 0.5rem;
    padding-left: 5px;
    padding-right: 5px;

    &:hover {
      background-color: color-mix(in srgb, var(--color-background), rgba(255, 255, 255) 10%);;
    }
  }
}

.pack_view:hover .pack_header {
  background: rgba(0, 0, 0, 0.3);
}

@media (max-width: 550px) {
  .pack_view {
    width: 100%;
  }
}
</style>
