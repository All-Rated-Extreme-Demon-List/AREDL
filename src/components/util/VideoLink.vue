<script setup>
defineProps(['video_url'])
</script>

<template>
  <a class="video_link" :href="video_url" target="_blank">
    <div class="box">
      <div class="triangle"></div>
    </div>
  </a>
</template>

<style scoped>

.video_link .box {
  width: 50px;
  height: 30px;
  border: solid var(--color-on-primary) 2px;
  border-radius: 0.3rem;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: background-color 400ms ease;

  &:hover {
    background-color: color-mix(in srgb, var(--color-background), rgba(255, 255, 255) 20%);
  }
}

.video_link .triangle {
  border-style: solid;
  border-width: 0 7px 15px 7px;
  border-color: transparent transparent var(--color-on-primary) transparent;
  transform: rotate(90deg);
}


</style>