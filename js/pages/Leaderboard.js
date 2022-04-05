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
        <Spinner v-if="loading"></Spinner>
        <template v-else>
            <ul>
                <li v-for="entry in leaderboard">
                    <p>{{ entry.user }}: {{ entry.total }}</p>
                </li>
            </ul>
            <article>
                <h1>{{ selEntry.user }}</h1>
                <p>{{ selEntry.total }}</p>
                <ol>
                    <li v-for="score in selEntry.scores">
                        {{ score.percent }}%: {{ score.level }} (+{{ score.score }})
                    </li>
                </ol>
            </article>
        </template>
    `,
    computed: {
        selEntry() {
            return this.leaderboard[this.selected];
        },
    },
    async mounted() {
        this.leaderboard = await fetchLeaderboard();
        // Hide loading spinner
        this.loading = false;
    },
};
