<script setup>
import { ref, computed, onMounted } from "vue";
import Spinner from "../components/Spinner.vue";
import { fetchLeaderboard } from "../content.js";
import { localize, getFontColour } from "../util.js";

const leaderboard = ref([]);
const loading = ref(true);
const selected = ref(0);
const err = ref([]);

const entry = computed(() => {
	return leaderboard.value[selected.value];
});

onMounted(async () => {
	const [leaderboard, err] = await fetchLeaderboard();
	leaderboard.value = leaderboard;
	err.value = err;
	// Hide loading spinner
	loading.value = false;
});
</script>

<template>
	<main v-if="loading">
		<Spinner></Spinner>
	</main>
	<main v-else class="page-leaderboard-container">
		<div class="page-leaderboard">
			<div class="error-container">
				<p class="error" v-if="err.length > 0">
					Leaderboard may be incorrect, as the following levels could not be
					loaded: {{ err.join(", ") }}
				</p>
			</div>
			<div class="board-container">
				<table class="board">
					<tr v-for="(ientry, i) in leaderboard" :key="i">
						<td class="rank">
							<p class="type-label-lg">#{{ i + 1 }}</p>
						</td>
						<td class="total">
							<p class="type-label-lg">{{ localize(ientry.total) }}</p>
						</td>
						<td class="user" :class="{ active: selected == i }">
							<button @click="selected = i">
								<span class="type-label-lg">{{ ientry.user }}</span>
							</button>
						</td>
					</tr>
				</table>
			</div>
			<div class="player-container">
				<div class="player">
					<h2>
						#{{ selected + 1 }} {{ entry.user }} -
						{{ entry.verified.length + entry.completed.length }} demons
					</h2>
					<h3>{{ entry.total }} points</h3>
					<p>Packs Bonus: {{ entry.packBonus }} points</p>
					<div class="packs" v-if="entry.packs.length > 0">
						<div
							v-for="pack in entry.packs"
							:key="pack.name"
							class="tag"
							:style="{
								background: pack.colour,
								color: getFontColour(pack.colour),
							}"
						>
							{{ pack.name }}
						</div>
					</div>
					<h2 v-if="entry.verified.length > 0">
						Verified ({{ entry.verified.length }})
					</h2>
					<table class="table">
						<tr v-for="score in entry.verified" :key="score">
							<td class="rank">
								<p>#{{ score.rank }}</p>
							</td>
							<td class="level">
								<a class="type-label-lg" target="_blank" :href="score.link">{{
									score.level
								}}</a>
							</td>
							<td class="score">
								<p>+{{ localize(score.score) }}</p>
							</td>
						</tr>
					</table>
					<h2 v-if="entry.completed.length > 0">
						Completed ({{ entry.completed.length }})
					</h2>
					<table class="table">
						<tr v-for="score in entry.completed" :key="score">
							<td class="rank">
								<p>#{{ score.rank }}</p>
							</td>
							<td class="level">
								<a class="type-label-lg" target="_blank" :href="score.link">{{
									score.level
								}}</a>
							</td>
							<td class="score">
								<p>+{{ localize(score.score) }}</p>
							</td>
						</tr>
					</table>
					<h2 v-if="entry.progressed.length > 0">
						Progressed ({{ entry.progressed.length }})
					</h2>
					<table class="table">
						<tr v-for="score in entry.progressed" :key="score">
							<td class="rank">
								<p>#{{ score.rank }}</p>
							</td>
							<td class="level">
								<a class="type-label-lg" target="_blank" :href="score.link"
									>{{ score.percent }}% {{ score.level }}</a
								>
							</td>
							<td class="score">
								<p>+{{ localize(score.score) }}</p>
							</td>
						</tr>
					</table>
				</div>
			</div>
		</div>
	</main>
</template>

<style>
.page-leaderboard-container {
	display: block;
}
.page-leaderboard {
	height: 100%;
	display: grid;
	grid-template-columns: minmax(24rem, 2fr) 3fr;
	grid-template-rows: max-content 1fr;
	column-gap: 2rem;
	max-width: 80rem;
	margin: 0 auto;
}
.page-leaderboard > div {
	overflow-y: auto;
}
.page-leaderboard .error-container {
	grid-row: 1;
	grid-column: 1 / span 2;
}
.page-leaderboard .error-container .error {
	padding: 1rem;
	background-color: var(--color-error);
	color: var(--color-on-error);
}
.page-leaderboard .board-container,
.page-leaderboard .player-container {
	grid-row: 2;
	padding-block: 2rem;
}
.page-leaderboard .board-container {
	padding-inline: 1rem;
}
.page-leaderboard .board {
	table-layout: auto;
	display: block;
	width: 100%;
}
.page-leaderboard .board .rank {
	padding-block: 1rem;
	text-align: end;
}
.page-leaderboard .board .total {
	padding: 1rem;
	text-align: end;
}
.page-leaderboard .board .user {
	width: 100%;
}
.page-leaderboard .board .user button {
	background-color: var(--color-background);
	color: var(--color-on-background);
	border: none;
	border-radius: 0.5rem;
	padding: 1rem;
	text-align: start;
	word-break: normal;
	overflow-wrap: anywhere;
}
.page-leaderboard .board .user button:hover {
	background-color: var(--color-background-hover);
	color: var(--color-on-background-hover);
	cursor: pointer;
}
.page-leaderboard .board .user.active button {
	background-color: var(--color-primary);
	color: var(--color-on-primary);
}
.page-leaderboard .player {
	display: flex;
	flex-direction: column;
	gap: 2rem;
	padding-right: 2rem;
}
.page-leaderboard .player .table {
	table-layout: fixed;
}
.page-leaderboard .player .table tr td:not(:last-child) {
	padding-right: 2rem;
}
.page-leaderboard .player .table p,
.page-leaderboard .player .table a {
	padding-block: 1rem;
}
.page-leaderboard .player .table .rank p,
.page-leaderboard .player .table .score p {
	text-align: end;
}

.page-leaderboard .player .packs {
	display: flex;
	flex-wrap: wrap;
	gap: 0.4em;
}
.page-leaderboard .player .packs .tag {
	display: flex;
	flex-shrink: 0;
}

.page-leaderboard .player .table .level {
	width: 100%;
}
.page-leaderboard .player .table a:hover {
	text-decoration: underline;
}
</style>
