<script setup>
import {onMounted, ref} from "vue";
import {pb} from "@/pocketbase";
import {useRoute} from "vue-router";
import PackDisplay from "@/components/PackDisplay.vue";
import PackView from "@/components/packs/PackView.vue";

const pack_data = ref(null)

const route = useRoute()

onMounted(async () => {
  /*if (route.params.id !== '') {
    selected_level.value = route.params.id;
  }*/
  pack_data.value = await pb.send("/api/aredl/packs", {})
  //console.log(pack_data.value)
})
</script>

<template>
  <div class="container">
    <div class="pack_display">
      <PackView v-for="pack in pack_data" :pack="pack"></PackView>
    </div>
  </div>
</template>

<style scoped>
.pack_display {
  display: inline-flex;
  flex-flow: column wrap;
  padding: 1rem;
  gap: 0.75rem;
  max-height: 100%;
}

.container {
  overflow: auto;
}


@media (max-width: 880px) {
  .pack_display {
    display: inline-flex;
    flex-flow: column;
    padding: 1rem;
    gap: 0.75rem;
  }
}
</style>