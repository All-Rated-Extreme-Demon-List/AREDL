import { fetchList } from '../content.js';
import { getThumbnailFromId, getYoutubeIdFromUrl, shuffle } from '../util.js';

import Spinner from '../components/Spinner.js';
import Btn from '../components/Btn.js';

export default {
    components: { Spinner, Btn },
    template: `
        <main v-if="loading">
            <Spinner></Spinner>
        </main>
        <main v-else class="page-roulette">
            <form class="options">
                <p class="type-label-md" style="color: #aaa">
                    Shameless copy of the Extreme Demon Roulette by <a href="https://matcool.github.io/extreme-demon-roulette/">matcool</a>.
                </p>
                <div class="check">
                    <input type="checkbox" id="main" value="Main List" checked>
                    <label for="main">Main List</label>
                </div>
                <div class="check">
                    <input type="checkbox" id="extended" value="Extended List" checked>
                    <label for="extended">Extended List</label>
                </div>
                <Btn @click.native.prevent="onStart">{{ levels.length === 0 ? 'Start' : 'Restart'}}</Btn>
            </form>
            <section class="levels-container">
                <div class="levels">
                    <template v-if="levels.length > 0">
                        <!-- Completed Levels -->
                        <div class="level" v-for="(level, i) in levels.slice(0, progression.length)">
                            <a :href="level.video" class="video">
                                <img :src="getThumbnailFromId(getYoutubeIdFromUrl(level.video))" alt="">
                            </a>
                            <div class="meta">
                                <p>#{{ level.rank }}</p>
                                <h2>{{ level.name }}</h2>
                                <p>{{ progression[i] }}%</p>
                            </div>
                        </div>
                        <!-- Current Level -->
                        <div class="level">
                            <a :href="currentLevel.video" target="_blank" class="video">
                                <img :src="getThumbnailFromId(getYoutubeIdFromUrl(currentLevel.video))" alt="">
                            </a>
                            <div class="meta">
                                <p>#{{ currentLevel.rank }}</p>
                                <h2>{{ currentLevel.name }}</h2>
                                <p>{{ currentLevel.id }}</p>
                            </div>
                            <form class="actions" v-if="!givenUp">
                                <input type="number" v-model="percentage" :placeholder="placeholder" :min="(this.progression[this.progression.length - 1] || 0) + 1" max=100>
                                <Btn @click.native.prevent="onDone">Done</Btn>
                                <Btn @click.native.prevent="onGiveUp" style="background-color: #e91e63;">Give Up</Btn>
                            </form>
                        </div>
                        <!-- Results -->
                        <div v-if="givenUp" class="results">
                            <h1>Results</h1>
                            <p>Number of levels: {{ progression.length }}</p>
                            <p>Highest percent: {{ progression[progression.length - 1] || 0 }}%</p>
                            <Btn @click.native.prevent="showRemaining = true">Show remaining levels</Btn>
                        </div>
                        <!-- Remaining Levels -->
                        <template v-if="givenUp && showRemaining">
                            <div class="level" v-for="(level, i) in levels.slice(progression.length)">
                                <a :href="level.video" class="video">
                                    <img :src="getThumbnailFromId(getYoutubeIdFromUrl(level.video))" alt="">
                                </a>
                                <div class="meta">
                                    <p>#{{ level.rank }}</p>
                                    <h2>{{ level.name }}</h2>
                                    <p>{{ (progression[progression.length - 1] || 0) + 1 + i }}%</p>
                                </div>
                            </div>
                        </template>
                    </template>
                </div>
            </section>
        </main>
    `,
    data: () => ({
        loading: false,
        levels: [],
        progression: [], // list of percentages completed
        percentage: undefined,
        givenUp: false,
        showRemaining: false,
    }),
    async mounted() {
        // Hide loading spinner
        // this.loading = false;
    },
    computed: {
        currentLevel() {
            return this.levels[this.progression.length];
        },
        placeholder() {
            return `At least ${(this.progression[this.progression.length - 1] || 0) + 1}%`;
        },
    },
    methods: {
        shuffle,
        getThumbnailFromId,
        getYoutubeIdFromUrl,
        async onStart() {
            if (this.levels.length > 0 && !this.givenUp) {
                alert('Give up before starting a new roulette.');
                return;
            }

            this.loading = true;

            const list = await fetchList();
            this.levels = shuffle(
                list.slice(0, 99).map((lvl, i) => ({
                    rank: i + 1,
                    id: lvl.id,
                    name: lvl.name,
                    video: lvl.verification,
                })),
            ); // random 100 levels
            this.showRemaining = false;
            this.givenUp = false;

            this.loading = false;
        },
        onDone() {
            if (
                !this.percentage ||
                this.percentage <= this.progression[this.progression.length - 1]
            ) {
                return;
            }

            this.progression.push(this.percentage);
            this.percentage = undefined;
        },
        onGiveUp() {
            this.givenUp = true;
        },
    },
};
