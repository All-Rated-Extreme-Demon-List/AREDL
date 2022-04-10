import { fetchLeaderboard } from '../content.js';
import { localize } from '../util.js';

import Spinner from '../components/Spinner.js';

export default {
    components: {
        Spinner,
    },
    data: () => ({
        leaderboard: [],
        loading: true,
        selected: 0,
    }),
    template: `
        <main v-if="loading">
            <Spinner></Spinner>
        </main>
        <main v-else class="page-leaderboard">
            <div class="board-container">
                <div class="board">
                    <template v-for="(ientry, i) in leaderboard">
                        <div class="rank">
                            <p class="type-label-lg">#{{ i + 1 }}</p>
                        </div>
                        <div class="total">
                            <p class="type-label-lg">{{ localize(ientry.total) }}</p>
                        </div>
                        <div class="user" :class="{ 'active': selected == i }">
                            <button @click="selected = i">
                                <span class="type-label-lg">{{ ientry.user }}</span>
                            </button>
                        </div>
                    </template>
                </div>
            </div>
            <div class="player-container">
                <div class="player">
                    <h1>#{{ selected + 1 }} {{ entry.user }}</h1>
                    <h3>{{ entry.total }}</h3>
                    <h2 v-if="entry.verified.length > 0">Verified</h2>
                    <div class="table">
                        <template v-for="score in entry.verified">
                            <p class="rank">#{{ score.rank }}</p>
                            <a class="level type-label-lg" :href="score.link">{{ score.level }}</a>
                            <p class="score">+{{ localize(score.score) }}</p>
                        </template>
                    </div>
                    <h2 v-if="entry.completed.length > 0">Completed</h2>
                    <div class="table">
                        <template v-for="score in entry.completed">
                            <p class="rank">#{{ score.rank }}</p>
                            <a class="level type-label-lg" :href="score.link">{{ score.level }}</a>
                            <p class="score">+{{ localize(score.score) }}</p>
                        </template>
                    </div>
                    <h2 v-if="entry.progressed.length > 0">Progressed</h2>
                    <div class="table">
                        <template v-for="score in entry.progressed">
                            <p class="rank">#{{ score.rank }}</p>
                            <a class="level type-label-lg" :href="score.link">{{ score.percent }}% {{ score.level }}</a>
                            <p class="score">+{{ localize(score.score) }}</p>
                        </template>
                    </div>
                </div>
            </div>
        </main>
    `,
    computed: {
        entry() {
            return this.leaderboard[this.selected];
        },
    },
    async mounted() {
        this.leaderboard = await fetchLeaderboard();
        // Hide loading spinner
        this.loading = false;
    },
    methods: {
        localize,
    },
};
