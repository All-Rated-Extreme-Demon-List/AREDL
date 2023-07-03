<script setup>
import { ref, computed, onMounted } from "vue";

import { fetchList } from "../content.js";
import { getThumbnailFromId, getYoutubeIdFromUrl, shuffle } from "../util.js";
import Spinner from "../components/Spinner.vue";
import Btn from "../components/Btn.vue";

// data
const loading = ref(false);
const levels = ref([]);
const progression = ref([]);
const percentage = ref(undefined);
const givenUp = ref(false);
const showRemaining = ref(false);
const useMainList = ref(true);
const useExtendedList = ref(true);
const toasts = ref([]);
const fileInput = ref(undefined);

// computed properties
const currentLevel = computed(() => {
	return levels.value[progression.value.length];
});
const currentPercentage = computed(() => {
	return progression.value[progression.value.length - 1] || 0;
});
const placeholder = computed(() => {
	return `At least ${currentPercentage.value + 1}%`;
});
const hasCompleted = computed(() => {
	return (
		progression.value[progression.value.length - 1] >= 100 ||
		progression.value.length === levels.value.length
	);
});
const isActive = computed(() => {
	return progression.value.length > 0 && !givenUp.value && !hasCompleted.value;
});

// methods
const onStart = async () => {
	if (isActive.value) {
		showToast.value("Give up before starting a new roulette.");
		return;
	}

	if (!useMainList.value && !useExtendedList.value) {
		return;
	}

	loading.value = true;

	const fullList = await fetchList();

	// eslint-disable-next-line no-unused-vars
	if (fullList.filter(([_, err]) => err).length > 0) {
		loading.value = false;
		showToast.value(
			"List is currently broken. Wait until it's fixed to start a roulette.",
		);
		return;
	}

	// eslint-disable-next-line no-unused-vars
	const fullListMapped = fullList.map(([lvl, _], i) => ({
		rank: i + 1,
		id: lvl.id,
		name: lvl.name,
		video: lvl.verification,
	}));
	const list = [];
	if (useMainList.value) list.push(...fullListMapped.slice(0, 150));
	if (useExtendedList.value) {
		list.push(...fullListMapped.slice(150, 999));
	}

	// random 100 levels
	levels.value = shuffle(list).slice(0, 100);
	showRemaining.value = false;
	givenUp.value = false;
	progression.value = [];
	percentage.value = undefined;

	loading.value = false;
};
const save = () => {
	localStorage.setItem(
		"roulette",
		JSON.stringify({
			levels: levels.value,
			progression: progression.value,
		}),
	);
};
const onDone = () => {
	if (!percentage.value) {
		return;
	}

	if (percentage.value <= currentPercentage.value || percentage.value > 100) {
		showToast("Invalid percentage.");
		return;
	}

	progression.value.push(percentage.value);
	percentage.value = undefined;

	save();
};
const onGiveUp = () => {
	givenUp.value = true;

	// Save progress
	localStorage.removeItem("roulette");
};
const onImport = () => {
	if (
		isActive.value &&
		!window.confirm(
			"This will overwrite the currently running roulette. Continue?",
		)
	) {
		return;
	}

	fileInput.value.showPicker();
};
const onImportUpload = async () => {
	if (fileInput.value.files.length === 0) return;

	const file = fileInput.value.files[0];

	if (file.type !== "application/json") {
		showToast("Invalid file.");
		return;
	}

	try {
		const roulette = JSON.parse(await file.text());

		if (!roulette.levels || !roulette.progression) {
			showToast("Invalid file.");
			return;
		}

		levels.value = roulette.levels;
		progression.value = roulette.progression;
		save();
		givenUp.value = false;
		showRemaining.value = false;
		percentage.value = undefined;
	} catch {
		showToast("Invalid file.");
		return;
	}
};
const onExport = () => {
	const file = new Blob(
		[
			JSON.stringify({
				levels: levels.value,
				progression: progression.value,
			}),
		],
		{ type: "application/json" },
	);
	const a = document.createElement("a");
	a.href = URL.createObjectURL(file);
	a.download = "tsl_roulette";
	a.click();
	URL.revokeObjectURL(a.href);
};
const showToast = (msg) => {
	toasts.value.push(msg);
	setTimeout(() => {
		toasts.value.shift();
	}, 3000);
};

// on mounted
onMounted(async () => {
	// Create File Input
	fileInput.value = document.createElement("input");
	fileInput.value.type = "file";
	fileInput.value.multiple = false;
	fileInput.value.accept = ".json";
	fileInput.value.addEventListener("change", onImportUpload.value);

	// Load progress from local storage
	const roulette = JSON.parse(localStorage.getItem("roulette"));

	if (!roulette) {
		return;
	}

	levels.value = roulette.levels;
	progression.value = roulette.progression;
});
</script>

<template>
	<main v-if="loading">
		<Spinner></Spinner>
	</main>
	<main v-else class="page-roulette">
		<div class="sidebar">
			<p class="type-label-md" style="color: #aaa">
				Shameless copy of the Extreme Demon Roulette by
				<a
					href="https://matcool.github.io/extreme-demon-roulette/"
					target="_blank"
					>matcool</a
				>.
			</p>
			<form class="options">
				<div class="check">
					<input
						type="checkbox"
						id="main"
						value="Main List"
						v-model="useMainList"
					/>
					<label for="main">Main List</label>
				</div>
				<div class="check">
					<input
						type="checkbox"
						id="extended"
						value="Extended List"
						v-model="useExtendedList"
					/>
					<label for="extended">Extended List</label>
				</div>
				<Btn @click.prevent="onStart">{{
					levels.length === 0 ? "Start" : "Restart"
				}}</Btn>
			</form>
			<p class="type-label-md" style="color: #aaa">
				The roulette saves automatically.
			</p>
			<form class="save">
				<p>Manual Load/Save</p>
				<div class="btns">
					<Btn @click.prevent="onImport">Import</Btn>
					<Btn :disabled="!isActive" @click.prevent="onExport">Export</Btn>
				</div>
			</form>
		</div>
		<section class="levels-container">
			<div class="levels">
				<template v-if="levels.length > 0">
					<!-- Completed Levels -->
					<div
						class="level"
						v-for="(level, i) in levels.slice(0, progression.length)"
						:key="i"
					>
						<a :href="level.video" class="video">
							<img
								:src="getThumbnailFromId(getYoutubeIdFromUrl(level.video))"
								alt=""
							/>
						</a>
						<div class="meta">
							<p>#{{ level.rank }}</p>
							<h2>{{ level.name }}</h2>
							<p style="color: #00b54b; font-weight: 700">
								{{ progression[i] }}%
							</p>
						</div>
					</div>
					<!-- Current Level -->
					<div class="level" v-if="!hasCompleted">
						<a :href="currentLevel.video" target="_blank" class="video">
							<img
								:src="
									getThumbnailFromId(getYoutubeIdFromUrl(currentLevel.video))
								"
								alt=""
							/>
						</a>
						<div class="meta">
							<p>#{{ currentLevel.rank }}</p>
							<h2>{{ currentLevel.name }}</h2>
							<p>{{ currentLevel.id }}</p>
						</div>
						<form class="actions" v-if="!givenUp">
							<input
								type="number"
								v-model="percentage"
								:placeholder="placeholder"
								:min="currentPercentage + 1"
								max="100"
							/>
							<Btn @click.prevent="onDone">Done</Btn>
							<Btn @click.prevent="onGiveUp" style="background-color: #e91e63"
								>Give Up</Btn
							>
						</form>
					</div>
					<!-- Results -->
					<div v-if="givenUp || hasCompleted" class="results">
						<h1>Results</h1>
						<p>Number of levels: {{ progression.length }}</p>
						<p>Highest percent: {{ currentPercentage }}%</p>
						<Btn
							v-if="currentPercentage < 99 && !hasCompleted"
							@click.prevent="showRemaining = true"
							>Show remaining levels</Btn
						>
					</div>
					<!-- Remaining Levels -->
					<template v-if="givenUp && showRemaining">
						<div
							class="level"
							v-for="(level, i) in levels.slice(
								progression.length + 1,
								levels.length - currentPercentage + progression.length,
							)"
							:key="i"
						>
							<a :href="level.video" target="_blank" class="video">
								<img
									:src="getThumbnailFromId(getYoutubeIdFromUrl(level.video))"
									alt=""
								/>
							</a>
							<div class="meta">
								<p>#{{ level.rank }}</p>
								<h2>{{ level.name }}</h2>
								<p style="color: #d50000; font-weight: 700">
									{{ currentPercentage + 2 + i }}%
								</p>
							</div>
						</div>
					</template>
				</template>
			</div>
		</section>
		<div class="toasts-container">
			<div class="toasts">
				<div v-for="toast in toasts" :key="toast" class="toast">
					<p>{{ toast }}</p>
				</div>
			</div>
		</div>
	</main>
</template>

<style>
.page-roulette .sidebar {
	padding: 2rem;
	display: flex;
	flex-direction: column;
	gap: 2rem;
	align-items: flex-start;
}
.page-roulette .sidebar a {
	text-decoration: underline;
}
.page-roulette .sidebar a:hover {
	color: var(--color-on-background);
}

.page-roulette .sidebar .check {
	display: flex;
	gap: 0.5rem;
	align-items: center;
}

.page-roulette .sidebar form {
	display: flex;
	flex-direction: column;
	gap: 1rem;
	align-items: flex-start;
}

.page-roulette .sidebar .save .btns {
	display: flex;
	gap: 1rem;
}

.page-roulette .levels-container {
	grid-row: 1;
	grid-column: 2 / span 2;
	overflow-y: auto;
	padding-right: 2rem;
}

.page-roulette .levels {
	display: flex;
	flex-direction: column;
	padding-block: 2rem;
	gap: 2rem;
}

.page-roulette .levels .level {
	display: grid;
	grid-template-columns: 12rem 1fr;
	grid-auto-rows: max-content;
	border-radius: 0.5rem;
	overflow: hidden;
	background-color: var(--color-background-hover);
}
.page-roulette .levels .level .video img {
	width: 100%;
	height: 100%;
	object-fit: cover;
}
.page-roulette .levels .level .meta {
	flex: 1;
	padding: 1rem;
	display: flex;
	flex-direction: column;
	gap: 1rem;
}
.page-roulette .levels .level .actions {
	grid-column: 1 / span 2;
	background-color: #1b314f;
	margin: 0;
	padding: 1rem;
	display: flex;
	gap: 1rem;
}
.page-roulette .levels .level .actions input[type="number"] {
	border: none;
	border-radius: 0.5rem;
	padding: 0.7rem;
	background-color: #475a7b;
	flex: 1;
	color: white;
}
.page-roulette .levels .level .actions input[type="number"]::placeholder {
	color: #7487aa;
}
.page-roulette .levels .results {
	display: flex;
	flex-direction: column;
	gap: 1rem;
}
.page-roulette .levels .results h1 {
	margin-bottom: 0.5rem;
}
.page-roulette .levels .results .btn {
	margin-top: 1rem;
}
.page-roulette .toasts-container {
	overflow-y: auto;
	grid-column: 2 / span 2;
	grid-row: 1;
	align-self: start;
	margin-block: 2rem;
	margin-right: 2rem;
}
.page-roulette .toasts {
	display: flex;
	flex-direction: column;
	gap: 2rem;
	overflow-y: auto;
}
.page-roulette .toast {
	display: flex;
	background-color: #d50000;
	color: white;
	padding: 1rem;
	border-radius: 0.5rem;
}

@media screen and (min-width: 1366px) {
	.page-roulette .levels-container {
		grid-column: 2;
		padding-right: 0;
	}
	.page-roulette .toasts-container {
		grid-column: 3;
		margin: 0;
		padding-right: 2rem;
		padding-block: 2rem;
		align-self: stretch;
	}
}
</style>
