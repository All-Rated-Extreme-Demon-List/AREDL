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
            <div class="board-container surface">
                <ol class="list">
                    <li v-for="(ientry, i) in leaderboard" class="list__item" :class="{ 'active': selected == i }">
                        <button @click="selected = i">
                            <p class="type-label-lg">#{{ i + 1 }} &mdash; {{ localize(ientry.total) }}: {{ ientry.user }}</p>
                        </button>
                    </li>
                </ol>
            </div>
            <div class="player-container surface">
                <div class="player">
                    <h1>#{{ selected + 1 }} {{ entry.user }}</h1>
                    <h3>{{ entry.total }}</h3>
                    <h2>Verified</h2>
                    <div class="table">
                        <template v-for="score in entry.verified">
                            <p class="rank">#{{ score.rank }}</p>
                            <p>{{ score.level }}</p>
                            <p class="score">+{{ localize(score.score) }}</p>
                            <a :href="score.link">
                                <img src="assets/video.svg" alt="Video">
                            </a>
                        </templa>
                    </div>
                    <h2>Completed</h2>
                    <div class="table">
                        <template v-for="score in entry.completed">
                            <p class="rank">#{{ score.rank }}</p>
                            <p>{{ score.level }}</p>
                            <p class="score">+{{ localize(score.score) }}</p>
                            <a :href="score.link">
                                <img src="assets/video.svg" alt="Video">
                            </a>
                        </template>
                    </div>
                    <h2>Progressed</h2>
                    <div class="table">
                        <template v-for="score in entry.progressed">
                            <p class="rank">#{{ score.rank }}</p>
                            <p>{{ score.percent }}% {{ score.level }}</p>
                            <p class="score">+{{ localize(score.score) }}</p>
                            <a :href="score.link">
                                <img src="assets/video.svg" alt="Video">
                            </a>
                        </temp>
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
