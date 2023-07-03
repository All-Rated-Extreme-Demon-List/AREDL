<script setup>
import { ref, computed, onMounted } from "vue";

import { fetchPacks, fetchPackLevels } from "../content.js";
import { getFontColour, embed } from "../util.js";
import { score } from "../score.js";
import Spinner from "../components/Spinner.vue";
import LevelAuthors from "../components/LevelAuthors.vue";

const packs = ref([]);
const errors = ref([]);
const selected = ref(0);
const selectedLevel = ref(0);
const selectedPackLevels = ref([]);
const loading = ref(true);
// TODO use loadingPack to make pack show loading while loading like how to list loads in list.js
// const loadingPack = ref(true);

const pack = computed(() => {
	return packs.value[selected.value];
});

onMounted(async () => {
	packs.value = await fetchPacks();
	selectedPackLevels.value = await fetchPackLevels(
		packs.value[selected.value].name,
	);

	// Error handling todo: make error handling
	// if (!packs.value) {
	//     errors.value = [
	//         "Failed to load list. Retry in a few minutes or notify list staff.",
	//     ];
	// } else {
	//     errors.value.push(
	//         ...packs.value
	//             .filter(([_, err]) => err)
	//             .map(([_, err]) => {
	//                 return `Failed to load level. (${err}.json)`;
	//             })
	//     );
	// }

	// Hide loading spinner
	loading.value = false;
	// loadingPack.value = false;
});
</script>

<template>
	<main v-if="loading">
		<Spinner></Spinner>
	</main>
	<main v-else class="pack-list">
		<div class="packs-nav">
			<div>
				<button
					@click="switchLevels(i)"
					v-for="(pack, i) in packs"
					:key="i"
					:style="{
						background: pack.colour,
						color: getFontColour(pack.colour),
					}"
					class="type-label-lg"
				>
					{{ pack.name }}
				</button>
			</div>
		</div>
		<div class="list-container">
			<table class="list" v-if="selectedPackLevels">
				<tr v-for="(level, i) in selectedPackLevels" :key="i">
					<td class="rank">
						<p class="type-label-lg">#{{ i + 1 }}</p>
					</td>
					<td
						class="level"
						:class="{ active: selectedLevel == i, error: !level }"
					>
						<button
							:style="[
								selectedLevel == i
									? {
											background: pack.colour,
											color: getFontColour(pack.colour),
										}
									: {},
							]"
							@click="selectedLevel = i"
						>
							<span class="type-label-lg">{{
								level[0].level.name || `Error (.json)`
							}}</span>
						</button>
					</td>
				</tr>
			</table>
		</div>
		<div class="level-container">
			<div class="level" v-if="selectedPackLevels[selectedLevel]">
				<h1>{{ selectedPackLevels[selectedLevel][0].level.name }}</h1>
				<LevelAuthors
					:author="selectedPackLevels[selectedLevel][0].level.author"
					:creators="selectedPackLevels[selectedLevel][0].level.creators"
					:verifier="selectedPackLevels[selectedLevel][0].level.verifier"
				></LevelAuthors>
				<div style="display: flex">
					<div
						v-for="pack in selectedPackLevels[selectedLevel][0].level.packs"
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
				<iframe
					class="video"
					:src="embed(selectedPackLevels[selectedLevel][0].level.verification)"
					frameborder="0"
				></iframe>
				<ul class="stats">
					<li>
						<div class="type-title-sm">Points when completed</div>
						<p>
							{{
								score(
									selected + 1,
									100,
									selectedPackLevels[selectedLevel][0].level.percentToQualify,
								)
							}}
						</p>
					</li>
					<li>
						<div class="type-title-sm">ID</div>
						<p>{{ selectedPackLevels[selectedLevel][0].level.id }}</p>
					</li>
					<li>
						<p>
							{{
								selectedPackLevels[selectedLevel][0].level.password ||
								"Free to Copy"
							}}
						</p>
					</li>
				</ul>
				<h2>Records</h2>
				<p v-if="selected + 1 <= 150">
					<strong
						>{{
							selectedPackLevels[selectedLevel][0].level.percentToQualify
						}}%</strong
					>
					or better to qualify
				</p>
				<p v-else>100% or better to qualify</p>
				<table class="records">
					<tr
						v-for="record in selectedPackLevels[selectedLevel][0].level.records"
						:key="record"
						class="record"
					>
						<td class="percent">
							<p>{{ record.percent }}%</p>
						</td>
						<td class="user">
							<a :href="record.link" target="_blank" class="type-label-lg">{{
								record.user
							}}</a>
						</td>
						<td class="mobile">
							<img
								v-if="record.mobile"
								:src="`/assets/phone-landscape${
									store?.dark ? '-dark' : ''
								}.svg`"
								alt="Mobile"
							/>
						</td>
						<td class="hz">
							<p>{{ record.hz }}Hz</p>
						</td>
					</tr>
				</table>
			</div>
			<div
				v-else
				class="level"
				style="height: 100%; justify-content: center; align-items: center"
			>
				<p>(ノಠ益ಠ)ノ彡┻━┻</p>
			</div>
		</div>
		<div class="meta-container">
			<div class="meta">
				<div class="errors" v-show="errors.length > 0">
					<p class="error" v-for="error of errors" :key="error">{{ error }}</p>
				</div>
				<h3>About the packs</h3>
				<p>
					These are list packs all chosen by the staff team that you can beat
					levels for and get the packs attached to your profile
				</p>
				<h3>How can I get these packs?</h3>
				<p>
					It's as simple as just beating the levels and getting your records
					added! The packs will automatically appear on your profile when all
					levels have been completed
				</p>
			</div>
		</div>
	</main>
</template>

<style>
.packs-nav {
	z-index: 1;
	position: absolute;
	background-color: var(--color-background-hover);
	height: 50px;
	overflow-x: auto;
	overflow-y: hidden;
	width: 100%;
}

.packs-nav button {
	border-top-right-radius: 0.75em;
	border-top-left-radius: 0.75em;
	border: none;
	padding: 10px;
	padding-left: 25px;
	padding-right: 25px;
	text-align: start;
	word-break: normal;
	overflow-wrap: anywhere;
	cursor: pointer;
	flex-shrink: 0;
	height: 100%;
}

.packs-nav > div {
	height: 100%;
	display: flex;
}

.pack-list .list-container,
.pack-list .level-container,
.pack-list .meta-container {
	margin-top: 50px;
	padding-block: 2rem;
}
.pack-list .list-container {
	padding-inline: 1rem;
}
.pack-list .meta-container {
	padding-right: 2rem;
}

.pack-list .list {
	table-layout: auto;
}
.pack-list .list .rank {
	text-align: end;
	padding-right: 1rem;
}
.pack-list .list .level {
	width: 100%;
}
.pack-list .list .level button {
	background-color: var(--color-background);
	color: var(--color-on-background);
	border: none;
	border-radius: 0.5rem;
	padding: 1rem;
	text-align: start;
	word-break: normal;
	overflow-wrap: anywhere;
	cursor: pointer;
}
.pack-list .list .level.error button {
	color: var(--color-error);
	cursor: not-allowed;
	text-decoration: line-through;
}
.pack-list .list .level button:hover {
	background-color: var(--color-background-hover);
	color: var(--color-on-background-hover);
}
.pack-list .list .level.active button {
	background-color: var(--color-primary);
	color: var(--color-on-primary);
}
.pack-list .level-container .level {
	display: flex;
	flex-direction: column;
	gap: 2rem;
	padding-right: 2rem;
	max-width: 48rem;
}
.pack-list .level-container .level .level-authors {
	display: grid;
	grid-template-columns: max-content 1fr;
	grid-auto-rows: max-content;
	gap: 1rem;
}
.pack-list .level-container .level .video {
	aspect-ratio: 16/9;
}
.pack-list .level-container .level .stats {
	display: flex;
	justify-content: space-evenly;
	text-align: center;
	gap: 2rem;
}
.pack-list .level-container .level .stats li {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 1rem;
}
.pack-list .level-container .level .records {
	table-layout: fixed;
}
.pack-list .level-container .level .records tr td:not(:last-child) {
	padding-right: 1rem;
}
.pack-list .level-container .level .records .percent,
.pack-list .level-container .level .records .user,
.pack-list .level-container .level .records .hz {
	padding-block: 1rem;
}
.pack-list .level-container .level .records .user {
	width: 100%;
}
.pack-list .level-container .level .records .percent,
.pack-list .level-container .level .records .hz {
	text-align: end;
}
.pack-list .meta-container .og a:hover,
.pack-list .level-container .level .records a:hover {
	text-decoration: underline;
}
.pack-list .meta {
	display: flex;
	flex-direction: column;
	gap: 2rem;
}
.pack-list .meta .errors {
	display: flex;
	flex-direction: column;
	gap: 1rem;
}
.pack-list .meta .errors .error {
	padding: 1rem;
	background-color: var(--color-error);
	color: var(--color-on-error);
	border-radius: 0.5rem;
}
.pack-list .meta .editors {
	display: flex;
	flex-direction: column;
	gap: 0.75rem;
}
.pack-list .meta .editors li {
	display: flex;
	align-items: center;
	gap: 0.5rem;
}
.pack-list .meta .editors li img {
	height: 1.25rem;
}
.pack-list .meta .editors li a:hover {
	text-decoration: underline;
}
.tag {
	font-family: "Lexend Deca", sans-serif;
	display: block;
	border-radius: 14px;
	color: white;
	background-color: #5d5d5d;
	padding: 7px;
}
</style>
