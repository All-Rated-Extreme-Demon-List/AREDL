<script setup>
import { store } from "./main";
</script>

<template>
	<header :class="{ dark: store.dark }">
		<div class="logo">
			<h2>AREDL</h2>
			<p>v1.7.1</p>
		</div>
		<nav class="nav">
			<RouterLink :to="{ name: 'List' }" class="nav__tab">
				<span class="type-label-lg">List</span>
			</RouterLink>
			<RouterLink :to="{ name: 'Leaderboard' }" class="nav__tab">
				<span class="type-label-lg">Leaderboard</span>
			</RouterLink>
			<RouterLink :to="{ name: 'Roulette' }" class="nav__tab">
				<span class="type-label-lg">Roulette</span>
			</RouterLink>
			<RouterLink :to="{ name: 'ListPacks' }" class="nav__tab">
				<span class="type-label-lg">Packs</span>
			</RouterLink>
			<div class="nav__actions">
				<button class="nav__icon" @click.prevent="store.toggleDark()">
					<img
						:src="store.dark ? 'src/assets/light.svg' : 'src/assets/dark.svg'"
						alt=""
					/>
				</button>
				<a class="nav__icon" href="https://discord.gg/UKC8RnGJvA">
					<img src="src/assets/discord.svg" alt="Discord Logo" />
				</a>
				<a
					class="nav__cta type-label-lg"
					href="https://forms.gle/T9XwQaiwo1wYKu256"
					target="_blank"
					>Submit Record</a
				>
			</div>
		</nav>
	</header>
	<RouterView id="view" :class="{ dark: store.dark }" ></RouterView>
</template>

<style>
#view {
	height: 100vh;
}
</style>
