<script setup>

const props = defineProps(['video_url'])

const getYoutubeIdFromUrl = (url) => {
  return url.match(
      /.*(?:youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=)([^#\&\?]*).*/,
  )?.[1] ?? '';
}

const embed = (video) => {
  const video_id = getYoutubeIdFromUrl(video);
  return `https://www.youtube.com/embed/${video_id}`;
}
</script>

<template>
  <div class="container">
    <iframe class="video" :src="embed(props.video_url)" style="visibility:hidden;" onload="this.style.visibility='visible';" allowfullscreen="allowfullscreen"></iframe>
  </div>
</template>

<style scoped>
.container {
  width: 100%;
  position: relative;
  padding-bottom: 56.25%;
}

.video {
  position: absolute;
  border: 0;
  width: 100%;
  height: 100%;
}
</style>