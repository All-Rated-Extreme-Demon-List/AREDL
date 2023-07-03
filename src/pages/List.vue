<script setup>
import { ref, computed, onMounted } from "vue";

import { store } from "../main.js";
import { embed, getFontColour } from "../util.js";
import { score } from "../score.js";
import { fetchEditors, fetchList } from "../content.js";
import Spinner from "../components/Spinner.vue";
import LevelAuthors from "../components/LevelAuthors.vue";

const roleIconMap = {
	owner: "crown",
	admin: "user-gear",
	helper: "user-shield",
	dev: "code",
	trial: "user-lock",
};

const list = ref([]);
const editors = ref([]);
const loading = ref(true);
const selected = ref(0);
const errors = ref([]);

const level = computed(() => {
	return list.value[selected.value][0];
});

onMounted(async () => {
	list.value = await fetchList();
	editors.value = await fetchEditors();

	// Error handling
	if (!list.value) {
		errors.value = [
			"Failed to load list. Retry in a few minutes or notify list staff.",
		];
	} else {
		errors.value.push(
			...list.value
				.filter((err) => err)
				.map((err) => {
					return `Failed to load level. (${err}.json)`;
				}),
		);
		if (!editors.value) {
			errors.value.push("Failed to load list editors.");
		}
	}

	// Hide loading spinner
	loading.value = false;
});
</script>

<template>
	<main v-if="loading">
		<Spinner></Spinner>
	</main>
	<main v-else class="page-list">
		<div class="list-container">
			<table class="list" v-if="list">
				<tr v-for="([level, err], i) in list" :key="i">
					<td class="rank">
						<p v-if="i + 1 <= 999" class="type-label-lg">#{{ i + 1 }}</p>
						<p v-else class="type-label-lg">Legacy</p>
					</td>
					<td class="level" :class="{ active: selected == i, error: !level }">
						<button @click="selected = i">
							<span class="type-label-lg">{{
								level?.name || `Error (${err}.json)`
							}}</span>
						</button>
					</td>
				</tr>
			</table>
		</div>
		<div class="level-container">
			<div class="level" v-if="level">
				<h1>{{ level.name }}</h1>
				<LevelAuthors
					:author="level.author"
					:creators="level.creators"
					:verifier="level.verifier"
				></LevelAuthors>
				<div class="packs" v-if="level.packs.length > 0">
					<div
						v-for="pack in level.packs"
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
					:src="embed(level.verification)"
					frameborder="0"
				></iframe>
				<ul class="stats">
					<li>
						<div class="type-title-sm">Points when completed</div>
						<p>{{ score(selected + 1, 100, level.percentToQualify) }}</p>
					</li>
					<li>
						<div class="type-title-sm">ID</div>
						<p>{{ level.id }}</p>
					</li>
					<li>
						<div class="type-title-sm">Password</div>
						<p>{{ level.password || "Free to Copy" }}</p>
					</li>
				</ul>
				<h2>Records</h2>
				<p v-if="selected + 1 <= 150">
					<strong>{{ level.percentToQualify }}%</strong> or better to qualify
				</p>
				<p v-else>100% or better to qualify</p>
				<table class="records">
					<tr v-for="record in level.records" :key="record" class="record">
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
								:src="`src/assets/phone-landscape${store.dark ? '-dark' : ''}.svg`"
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
				<div class="og">
					<p class="type-label-md">
						Original List by
						<a href="https://tsl.pages.dev/#/" target="_blank">TheShittyList</a>
					</p>
				</div>
				<template v-if="editors">
					<h3 align="center">List Editors</h3>
					<ol class="editors">
						<ol class="rank" v-for="rank in editors" :key="rank.role">
							<li v-for="member in rank.members" :key="member.name">
								<img
									:src="`src/assets/${roleIconMap[rank.role]}${
										store.dark ? '-dark' : ''
									}.svg`"
									:alt="rank.role"
								/>
								<a
									v-if="member.link"
									class="type-label-lg link"
									target="_blank"
									:href="member.link"
									>{{ member.name }}</a
								>
								<p v-else>{{ member.name }}</p>
							</li>
						</ol>
					</ol>
				</template>
				<h3>> How to Submit Records</h3>
				<p>Join the discord, and use /submit record</p>
				<p>
					If your records hasn't accepted or denied after 1 week of submitting
					it, please resubmit the record again
				</p>
				<h3>> Why was my record denied?</h3>
				<p>If you're record was denied, please check the following</p>
				<p>Does the video follow the requirements? (Below)</p>
				<p>Is the level placed on the list? (#pending-changes)</p>
				<p>Was the submission command filled out correctly?</p>
				<p>Was the record submitted with several links?</p>
				<p>
					Note: The record will say its been denied and the reason in #records,
					if it isn't accepted or denied after a week, the record will need to
					resubmitted
				</p>
				<p>
					If the record was wrongfully denied, please make a post in #support or
					DM any list staff on Discord
				</p>
				<h3>> Submission Requirements</h3>
				<p>
					Achieved the record without using hacks (however, FPS bypass is
					allowed, up to 360fps)
				</p>
				<p>
					Achieved the record on the level that is listed on the site - please
					check the level ID before you submit a record
				</p>
				<p>
					The recording must have a previous attempt and entire death animation
					shown before the completion, unless the completion is on the first
					attempt. Everyplay records are exempt from this
				</p>
				<p>
					The recording must also show the player hit the endwall, or the
					completion will be invalidated.
				</p>
				<p>Do not use secret routes or bug routes</p>
				<p>
					Do not use Banned Hacks (<a
						href="https://docs.google.com/document/d/1AsQS0WH_OzPAzS7avtAB4e8rnYhoqWnFsV068Tcu5VU/edit?usp=sharing"
						target="_blank"
						>Full List of Allowed / Banned hacks listed here</a
					>)
				</p>
				<p>
					Your completion needs to have clicks. If it doesn't, you have to
					provide a raw footage with clicks. If you don't, your record will be
					rejected.
				</p>
				<p>
					You need to rebeat an updated level if the previous version is easier
					than the current one.
				</p>
				<p>
					You need a full completion from 0 - 100% (excluding long endscreens
					where you can't die). If your video is corrupted, we will reject your
					record
				</p>
				<p>
					For levels in the top 250, you also need to provide raw footage or a
					screenshot of a pointercrate record.
				</p>
				<h3>> Allowed Hacks / Modifications</h3>
				<p>- LDMs / ULDMs</p>
				<p>- Show Hitboxes on Death</p>
				<p>- Cosmetic Hacks (Show / Hide Player Trail, RGB Icons, etc)</p>
				<p>- Speedhack above x1 Speed</p>
				<h3>> Banned Hacks</h3>
				<p>- Noclip</p>
				<p>- Speedhack below x1 Speed</p>
				<p>- Show Hitboxes</p>
				<p>- Show Layout</p>
				<p>- Replay Bot / Macro</p>
				<p>- No Mirror</p>
				<p>- Hitbox Multiplier</p>
			</div>
		</div>
	</main>
</template>

<style>
.page-list .list-container,
.page-list .level-container,
.page-list .meta-container {
	padding-block: 2rem;
}
.page-list .list-container {
	padding-inline: 1rem;
}
.page-list .meta-container {
	padding-right: 2rem;
}

.page-list .list {
	table-layout: auto;
}
.page-list .list .rank {
	text-align: end;
	padding-right: 1rem;
}
.page-list .list .level {
	width: 100%;
}
.page-list .list .level button {
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
.page-list .list .level.error button {
	color: var(--color-error);
	cursor: not-allowed;
	text-decoration: line-through;
}
.page-list .list .level button:hover {
	background-color: var(--color-background-hover);
	color: var(--color-on-background-hover);
}
.page-list .list .level.active button {
	background-color: var(--color-primary);
	color: var(--color-on-primary);
}
.page-list .level-container .level {
	display: flex;
	flex-direction: column;
	gap: 2rem;
	padding-right: 2rem;
	max-width: 48rem;
}
.page-list .level-container .level .level-authors {
	display: grid;
	grid-template-columns: max-content 1fr;
	grid-auto-rows: max-content;
	gap: 1rem;
}
.page-list .level-container .level .video {
	aspect-ratio: 16/9;
}
.page-list .level-container .level .stats {
	display: flex;
	justify-content: space-evenly;
	text-align: center;
	gap: 2rem;
}
.page-list .level-container .level .stats li {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 1rem;
}
.page-list .level-container .level .packs {
	display: flex;
	flex-wrap: wrap;
	gap: 0.4em;
}
.page-list .level-container .level .packs .tag {
	display: flex;
	flex-shrink: 0;
}
.page-list .level-container .level .records {
	table-layout: fixed;
}
.page-list .level-container .level .records tr td:not(:last-child) {
	padding-right: 1rem;
}
.page-list .level-container .level .records .percent,
.page-list .level-container .level .records .user,
.page-list .level-container .level .records .hz {
	padding-block: 1rem;
}
.page-list .level-container .level .records .user {
	width: 100%;
}
.page-list .level-container .level .records .percent,
.page-list .level-container .level .records .hz {
	text-align: end;
}
.page-list .meta-container .og a:hover,
.page-list .level-container .level .records a:hover {
	text-decoration: underline;
}
.page-list .meta {
	display: flex;
	flex-direction: column;
	gap: 2rem;
}
.page-list .meta .errors {
	display: flex;
	flex-direction: column;
	gap: 1rem;
}
.page-list .meta .errors .error {
	padding: 1rem;
	background-color: var(--color-error);
	color: var(--color-on-error);
	border-radius: 0.5rem;
}
.page-list .meta .editors {
	display: flex;
	align-items: center;
	flex-direction: column;
	gap: 0.75rem;
}
.page-list .meta .editors .rank {
	display: flex;
	flex-wrap: wrap;
	gap: 0.75rem;
	justify-content: center;
	background-color: rgba(255, 255, 255, 0.1);
	border-radius: 0.5rem;
	padding: 0.5rem;
}
.page-list .meta .editors .rank li {
	display: flex;
	align-items: center;
	gap: 0.5rem;
}
.page-list .meta .editors .rank li img {
	height: 1.25rem;
}
.page-list .meta .editors .rank li a:hover {
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
