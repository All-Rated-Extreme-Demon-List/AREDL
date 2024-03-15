<script setup>
import NavLogo from "@/components/nav/NavLogo.vue";
import ProfileNav from "@/components/nav/NavProfile.vue";
import {ref} from "vue";
import {store} from "@/main";

const isNavMenuOpen = ref(false);

const toggleNavMenu = () => {
  isNavMenuOpen.value = !isNavMenuOpen.value;
};
</script>

<template>
  <div class="nav_bar">
    <div class="left-nav">
      <NavLogo></NavLogo>
      <nav class="nav" :class="isNavMenuOpen && 'show'">
        <RouterLink :to="{ name: 'List' }" class="nav_tab">
          <span>Demon List</span>
        </RouterLink>
        <RouterLink :to="{ name: 'Leaderboard' }" class="nav_tab">
          <span>Leaderboard</span>
        </RouterLink>
        <RouterLink :to="{ name: 'Packs' }" class="nav_tab">
          <span>Packs</span>
        </RouterLink>
        <RouterLink :to="{ name: 'Moderation' }" class="nav_tab" v-if="store.hasPermission('aredl.mod_view').value">
          <span>Mod</span>
        </RouterLink>
      </nav>
    </div>
    <div class="right-nav">
      <button class="nav_toggle_button" @click="toggleNavMenu">
        <div class="menu-icon">
          <div></div>
          <div></div>
          <div></div>
        </div>
      </button>
      <a class="nav_icon" href="https://discord.gg/aredl">
        <img src="@/assets/discord.svg" alt="Discord Logo" />
      </a>
      <!-- <ProfileNav></ProfileNav> -->
    </div>
  </div>
</template>

<style scoped>

.nav_bar {
  column-gap: 2rem;
  display: flex;
  justify-content: space-between;
  padding-inline: 2rem;
  height: var(--navbar-height);
  background-color: var(--color-primary);
  color: var(--color-on-primary);
  padding-left: 0;
  overflow:hidden;
}

.left-nav {
  display: flex;
  justify-content: space-between;
  gap: 2rem;
}

.nav {
  display: flex;
  column-gap: 2rem;
}

.nav_icon {
  height: 3rem;
  width: 3rem;
  border: none;
  border-radius: 50%;
  background-color: transparent;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: background-color 100ms ease;
}

.nav_icon img {
  height: 80%;
  width: 80%;
}

.nav_icon:hover {
  background-color: rgba(255, 255, 255, 0.2);
}

.nav .nav_tab {
  display: flex;
  white-space: nowrap;
  align-items: center;
  justify-content: center;
  border-bottom: 4px solid transparent;
  padding-top: 4px;
  padding-inline: 0.5rem;
  color: var(--color-on-primary);
  text-decoration: none;
  transition: border-color 100ms ease;
}

.nav .nav_tab span {
  font-size: 18px;
  font-weight: 700;
}

.nav .nav_tab:hover, .nav .nav_tab.router-link-active {
  border-color: var(--color-on-primary);
}

.nav_toggle_button {
  display: none;
}

.right-nav {
  display: flex;
  column-gap: 1.5rem;
  align-items: center;
}

.menu-icon {
  width: 30px;
  height: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  cursor: pointer;
}

.menu-icon div {
  width: 30px;
  height: 3px;
  background-color: var(--color-on-primary);
}

@media (max-width: 880px) {

  .nav_toggle_button {
    display: block;
    background: none;
    border: none;
    font-size: 20px;
    cursor: pointer;
    padding: 10px;
  }

  .nav {
    width: 100%;
    left: 0;
    top: var(--navbar-height);
    position: absolute;
    display: none;
    z-index: 1;
  }

  .nav.show {
    display: block;
  }

  .nav .nav_tab {
    padding: 30px 0;
    background-color: color-mix(in srgb, var(--color-background), rgba(255, 255, 255) 10%);
    border: none;
    width: 100%;
    height: min-content;
    transition: all ease 500ms;
  }

  .nav .nav_tab.router-link-active, .nav .nav_tab:hover {
    background-color: color-mix(in srgb, var(--color-background), rgba(255, 255, 255) 20%);
  }

}
</style>