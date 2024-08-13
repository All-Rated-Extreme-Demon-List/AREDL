<script setup>
const props = defineProps(['role'])
</script>

<template>
  <div class="container">
    <img src="@/assets/staff/owner.svg" alt="" v-if="role==='listOwner'">
    <img src="@/assets/staff/co_owner.svg" alt="" v-if="role==='listCoOwner'">
    <img src="@/assets/staff/admin.svg" alt="" v-if="role==='listAdmin'">
    <img src="@/assets/staff/code.svg" alt="" v-if="role==='developer'">
    <img src="@/assets/staff/mod.svg" alt="" v-if="role==='listMod'">
    <img src="@/assets/staff/helper.svg" alt="" v-if="role==='listHelper'">
    <img src="@/assets/staff/patreon.svg" alt="" v-if="role==='aredlPlus'" class="aredl_plus">
  </div>
</template>

<style scoped>
.container {
  display: flex;
  justify-content: center;
  align-items: center;

  & img {
    max-width: 23px;
  }
}
</style>