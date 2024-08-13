<script setup>

</script>

<template>
  <div class="logo">
    <h2>AREDL</h2>
    <img src="@/assets/extreme-demon.webp" alt="">
  </div>
</template>

<style scoped>

/* text format */
.logo h2 {
  font-size: 32px;
  line-height: 40px;
  font-weight: 900;
  letter-spacing: -1px;
  color: black;
}

.logo {
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(70deg, var(--color-on-primary) 88%,  transparent 89%);
  height: var(--navbar-height);
  width: 18rem;
  min-width: 14rem;
  gap: 0.6rem;
}

.logo img {
  filter: brightness(0%);
  height: 60%;
  margin-right: 30px;
  width: auto;
}

</style>