<script setup>
import {onMounted, ref} from "vue";
import {pb} from "@/pocketbase";
import {useRoute} from "vue-router";
import PackDisplay from "@/components/PackDisplay.vue";
import PackView from "@/components/packs/PackView.vue";
import {LoadingStatus} from "@/loadingStatus";
import LoadingPanel from "@/components/util/LoadingPanel.vue";

const pack_data = ref(null)

const route = useRoute()
const loading_status = ref(LoadingStatus.LOADING)

onMounted(async () => {
  loading_status.value = LoadingStatus.LOADING;
  /*if (route.params.id !== '') {
    selected_level.value = route.params.id;
  }*/
  try {
    pack_data.value = await pb.send("/api/aredl/packs", {})
  } catch (error) {
    loading_status.value = LoadingStatus.ERROR;
    return;
  }
  //console.log(pack_data.value)
  loading_status.value = LoadingStatus.FINISHED;
})
</script>

<template>
  <LoadingPanel :status="loading_status">
    <div class="container">
      <div class="pack_display">
        <PackView v-for="pack in pack_data" :pack="pack"></PackView>
      </div>
    </div>
  </LoadingPanel>

</template>

<style scoped>
.pack_display {
  display: flex;
  width: 100%;
  flex-flow: row wrap;
  padding: 1rem;
  gap: 0.75rem;
}

.container {
  overflow: auto;
}

@media (max-width: 550px) {
  .pack_display {
  display: flex;
  width: 100%;
  flex-flow: column;
  padding: 1rem;
  gap: 0.75rem;
  justify-content: center;
}
}
</style>