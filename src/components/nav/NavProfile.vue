<script setup>
import {ref} from "vue";
import {pb} from "@/pocketbase";
import {store} from "@/main";

const isProfileDropdownOpen = ref(false);

const toggleProfileDropdown = () => {
  isProfileDropdownOpen.value = !isProfileDropdownOpen.value;
}

const doLogin = async() => {
  await pb.collection("users").authWithOAuth2({
    provider: "discord",
    scopes: ['identify', 'email', "connections"]
  })
}

const doLogout = async() => {
  pb.authStore.clear()
}

</script>

<template>
  <div class="nav_user">
    <div class="nav_profile" v-if="store.user">
      <img :src="store.user.avatar_url" alt="Avatar">
      <button @click="toggleProfileDropdown" class="profile_toggle_button"></button>
      <ul :class="isProfileDropdownOpen && 'show'">
        <li>
          <RouterLink :to="{ name: 'Leaderboard', params: {id: store.user.id}}" class="profile_link">
            <span>Profile</span>
          </RouterLink>
        </li>
        <li v-if="store.hasPermission('aredl.user_submit').value">
          <RouterLink :to="{ name: 'Submit'}" class="profile_link">
            <span>Submit</span>
          </RouterLink>
        </li>
        <li>
          <button @click="doLogout">Logout</button>
        </li>
      </ul>
    </div>
    <div class="nav_login" v-else>
      <button @click="doLogin">Login</button>
    </div>
  </div>
</template>

<style scoped>

/* text format */
.nav_profile span, .nav_profile button, .nav_login button {
  font-size: 17px;
  line-height: 20px;
  font-weight: 500;
}

.nav_user {
  height: 100%
}

.nav_login {
  display: flex;
  height: 100%;
  align-items: center;
  justify-content: center;
}

.nav_login button {
  background-color: var(--color-on-primary);
  color: var(--color-primary);
  border-radius: 10%;
  padding: 0.6rem 1rem;
  border: none;
  cursor: pointer;
  box-shadow: 0 1px 0.5rem 0 rgba(0, 0 , 102, 0.5);
  transition: transform 100ms ease;
}

.nav_login button:hover {
  transform: translateY(-1px);
}

.profile_link {
  text-decoration: none;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-on-primary);
}

.nav_profile {
  display: flex;
  height: 100%;
  justify-content: center;
  align-items: center;
}

.nav_profile img {
  border-radius: 50%;
  max-height: 75%;
  overflow: hidden;
  background-color: color-mix(in srgb, var(--color-on-primary), transparent 0%);
  transition: opacity 100ms ease;
}

.nav_profile:hover img {
  opacity: 0.85;
}

.nav_profile ul {
  display: none;
  list-style: none;
  flex-direction: column;
  width: 100px;
  background-color: color-mix(in srgb, var(--color-background), rgba(255, 255, 255) 10%);
  height: min-content;
  border-bottom-left-radius: 10%;
  border-bottom-right-radius: 10%;
  justify-content: flex-end;
  align-items: center;
  position: absolute;
  top: var(--navbar-height);
  overflow: clip;
}

.nav_profile:hover ul {
  display: flex;
}

.nav_profile ul li {
  display: flex;
  cursor: pointer;
  width: 100%;
  align-items: center;
  justify-content: center;
  position: relative;
  height: 3rem;
}

.nav_profile ul li:hover {
  background-color: color-mix(in srgb, var(--color-on-primary), transparent 60%);
}

.nav_profile ul li button {
  width: 100%;
  height: 100%;
  cursor: pointer;
  background-color: transparent;
  border: none;
  color: var(--color-on-primary);
}

.profile_toggle_button {
  display: none;
}

@media (max-width: 880px) {
  .profile_toggle_button {
    position: absolute;
    display: block;
    background-color: transparent;
    border: none;
    cursor: pointer;
    width: 4.5rem;
    height: var(--navbar-height);
  }

  .nav_profile ul.show {
    display: flex;
  }
}

</style>