<script setup>

import NavBar from "@/components/nav/NavBar.vue";
import {nextTick, onMounted} from "vue";
import {pb} from "@/pocketbase";
import {store} from "@/main";

onMounted(async () => {
  pb.authStore.onChange(() => {
    store.user = pb.authStore.model
    if (pb.authStore.model === null) {
      store.permissions = null
    } else {
      nextTick(async () => {
        store.permissions = await pb.send("/api/user/permissions", {})
        //console.log(store.permissions)
      })
    }
  }, true)
})
</script>

<template>
  <header>
    <NavBar></NavBar>
  </header>
  <RouterView id="view" class="router_view"></RouterView>
</template>

<style scoped>

</style>
