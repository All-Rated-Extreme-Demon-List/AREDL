<script setup>

import NavBar from "@/components/nav/NavBar.vue";
import {computed, nextTick, onMounted, watch} from "vue";
import {pb} from "@/pocketbase";
import {store} from "@/main";
import {LoadingStatus} from "@/loadingStatus";

onMounted(async () => {
  pb.authStore.onChange(() => {
    store.user = pb.authStore.model
    if (pb.authStore.model === null) {
      store.permissions = null
    } else {
      nextTick(async () => {
        try {
          store.permissions = await pb.send("/api/me/permissions", {})
        } catch (error) {
        }
        //console.log(store.permissions)
      })
    }
  }, true)
  store.color = localStorage.getItem('color') || '';
})

watch(store, () => {
  let item = document.getElementById("app")
  if (store.color) {
    localStorage.setItem('color', store.color)
    item.style.setProperty("--color-primary", store.color)
  } else {
    localStorage.setItem('color', '')
    item.style.setProperty("--color-primary", item.style.getPropertyValue('--color-default-primary'))
  }
})
</script>

<template>
  <header>
    <NavBar></NavBar>
  </header>
  <RouterView id="view" class="router_view"></RouterView>
</template>

<style>
@import url('vue-accessible-color-picker/styles');
</style>
