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
                <table class="list">
                    <tr v-for="(ientry, i) in leaderboard" class="list__item" :class="{ 'list__item--active': selected == i }">
                        <td class="list__rank">
                            <p class="type-label-lg">#{{ i + 1 }}</p>
                        </td>
                        <td class="list__rank">
                            <p class="type-label-lg">{{ localize(ientry.total) }}</p>
                        </td>
                        <td class="list__level">
                            <button @click="selected = i">
                                <span class="type-label-lg">{{ ientry.user }}</span>
                            </button>
                        </td>
                    </tr>
                </table>
            </div>
            <div class="player-container">
                <div class="player">
                    <h1>#{{ selected + 1 }} {{ entry.user }}</h1>
                    <h3>{{ entry.total }}</h3>
                    <h2 v-if="entry.verified.length > 0">Verified</h2>
                    <div class="table">
                        <template v-for="score in entry.verified">
                            <p class="rank">#{{ score.rank }}</p>
                            <p>{{ score.level }}</p>
                            <p class="score">+{{ localize(score.score) }}</p>
                            <a :href="score.link">
                                <img src="/assets/video.svg" alt="Video">
                            </a>
                        </template>
                    </div>
                    <h2 v-if="entry.completed.length > 0">Completed</h2>
                    <div class="table">
                        <template v-for="score in entry.completed">
                            <p class="rank">#{{ score.rank }}</p>
                            <p>{{ score.level }}</p>
                            <p class="score">+{{ localize(score.score) }}</p>
                            <a :href="score.link">
                                <img src="/assets/video.svg" alt="Video">
                            </a>
                        </template>
                    </div>
                    <h2 v-if="entry.progressed.length > 0">Progressed</h2>
                    <div class="table">
                        <template v-for="score in entry.progressed">
                            <p class="rank">#{{ score.rank }}</p>
                            <p>{{ score.percent }}% {{ score.level }}</p>
                            <p class="score">+{{ localize(score.score) }}</p>
                            <a :href="score.link">
                                <img src="/assets/video.svg" alt="Video">
                            </a>
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
