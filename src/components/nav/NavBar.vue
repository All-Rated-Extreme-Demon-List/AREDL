<script setup>
import NavLogo from "@/components/nav/NavLogo.vue";
import ProfileNav from "@/components/nav/NavProfile.vue";
import {ref} from "vue";
import {store} from "@/main";
import {ColorPicker} from "vue-accessible-color-picker";

const isNavMenuOpen = ref(false);
const isColorPickerOpen = ref(false);

const toggleNavMenu = () => {
  isNavMenuOpen.value = !isNavMenuOpen.value;
};
</script>

<template>
  <div class="nav_bar">
    <div class="left-nav">
      <NavLogo></NavLogo>
      <nav class="nav" :class="isNavMenuOpen && 'show'" @click="toggleNavMenu()">
        <RouterLink :to="{ name: 'List' }" class="nav_tab">
          <span>Demon List</span>
        </RouterLink>
        <RouterLink :to="{ name: 'Leaderboard' }" class="nav_tab">
          <span>Leaderboard</span>
        </RouterLink>
        <RouterLink :to="{ name: 'Packs' }" class="nav_tab">
          <span>Packs</span>
        </RouterLink>
        <!--<RouterLink :to="{ name: 'Roulette' }" class="nav_tab">
        <span>Roulette</span>
      </RouterLink>-->
        <RouterLink :to="{ name: 'Moderation' }" class="nav_tab" v-if="store.hasPermission('aredl.mod_view').value">
          <span>Mod</span>
        </RouterLink>
      </nav>
    </div>
    <div class="right-nav">
      <button class="nav_toggle_button" @click="toggleNavMenu">
        <div class="menu-icon">
        <img src="@/assets/navmenu.svg" alt="Navigation Menu" style="width: 120%; translate: 0px -7px;"/>
        </div>
      </button>
      <a class="nav_icon discord_button" href="https://discord.gg/aredl">
        <img src="@/assets/discord.svg" alt="Discord Logo" />
      </a>
      <button class="settings nav_icon" @click="isColorPickerOpen = !isColorPickerOpen">
        <img src="../../assets/settings.svg" alt="Settings">
      </button>
      <div class="color-picker-menu" v-if="isColorPickerOpen">
        <ColorPicker class="color-picker" @color-change="data => store.color = data.cssColor" :color="store.color || '#ff6f00'" alpha-channel="hide" :visible-formats="['hex']"/>
        <button @click="() =>{store.color = ''; isColorPickerOpen = false}">Reset</button>
      </div>
      <!--<ProfileNav></ProfileNav> -->
    </div>
  </div>
</template>

<style scoped>

.color-picker-menu {
  position: absolute;
  display: flex;
  flex-direction: column;
  z-index: 10;
  translate: -2rem calc(var(--navbar-height) + 5.5rem);
  height: 15rem;
  width: 10rem;

  & .color-picker {
    background-color: var(--color-primary);
    text-shadow: 0 0 1px var(--color-background), 0 0 1px var(--color-background), 0 0 1px var(--color-background), 0 0 1px var(--color-background), 0 0 2px var(--color-background), 0 0 1px var(--color-background), 0 0 1px var(--color-background), 0 0 1px var(--color-background), 0 0 1px var(--color-background);
  }

  & button {
    width: 10rem;
    height: 20rem;
    background-color: var(--color-primary);
    border: none;
    border-bottom-left-radius: 0.25rem;
    border-bottom-right-radius: 0.25rem;

    &:hover {
      background-color: color-mix(in srgb, var(--color-primary), rgba(255, 255, 255) 20%);
    }
  }
}

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

.settings {
  background-color: var(--color-primary);
  border: none;
  filter: invert();

  & img {
  }
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
  text-shadow: 0 0 1px var(--color-background), 0 0 1px var(--color-background), 0 0 1px var(--color-background), 0 0 1px var(--color-background), 0 0 2px var(--color-background), 0 0 1px var(--color-background), 0 0 1px var(--color-background), 0 0 1px var(--color-background), 0 0 1px var(--color-background);
  justify-content: center;
  border-bottom: 4px solid transparent;
  padding-top: 4px;
  padding-inline: 0.5rem;
  color: var(--color-on-primary);
  text-decoration: none;
  transition: border-color 400ms ease, background-color 400ms ease;
}

.nav .nav_tab span {
  font-size: 18px;
  font-weight: 700;
}

.nav .nav_tab:hover, .nav .nav_tab.router-link-active {
  border-color: var(--color-on-primary);
}

.nav .nav_tab:hover {
  background-color: color-mix(in srgb, var(--color-primary), rgba(255, 255, 255) 10%);
}

.nav_toggle_button {
  display: none;
}

.right-nav {
  display: flex;
  column-gap: 1rem;
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

  @media (max-width: 500px) {

    .discord_button {
      display: none;
    }

    .nav_bar {
      column-gap: 1rem;
    }


  }

}
</style>