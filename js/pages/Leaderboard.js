import { fetchLeaderboard } from '../content.js';
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
            <ul>
                <li v-for="ientry in leaderboard">
                    <p>{{ ientry.user }}: {{ ientry.total }}</p>
                </li>
            </ul>
            <article>
                <h1>{{ entry.user }}</h1>
                <p>{{ entry.total }}</p>
                <ol>
                    <li v-for="score in entry.scores">
                        {{ score.percent }}%: {{ score.level }} (+{{ score.score }})
                    </li>
                </ol>
            </article>
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
};
