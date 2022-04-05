import { embed } from '../util.js';
import { score } from '../score.js';
import { fetchList } from '../content.js';

import Spinner from '../components/Spinner.js';
import LevelAuthors from '../components/List/LevelAuthors.js';

export default {
    components: { Spinner, LevelAuthors },
    template: `
        <main v-if="loading">
            <Spinner></Spinner>
        </main>
        <main v-else class="page-list">
            <div class="list-container">
                <table class="list">
                    <tr v-for="(level, i) in list" class="list__item" :class="{ 'list__item--active': selected == i }">
                        <td class="list__rank">
                            <p class="type-label-lg">#{{ i + 1 }}</p>
                        </td>
                        <td class="list__level">
                            <button @click="selected = i">
                                <span class="type-label-lg">{{ level.name }}</span>
                            </button>
                        </td>
                    </tr>
                </table>
            </div>
            <div class="level-container">
                <div class="level">
                    <h1>{{ level.name }}</h1>
                    <LevelAuthors :author="level.author" :creators="level.creators" :verifier="level.verifier"></LevelAuthors>
                    <iframe class="video" :src="embed(level.verification)" frameborder="0"></iframe>
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
                            <p>{{ level.password || 'Free to copy' }}</p>
                        </li>
                    </ul>
                    <h2>Records</h2>
                    <p><strong>{{ level.percentToQualify }}%</strong> or better to qualify</p>
                    <table class="records">
                        <tr v-for="record in level.records" class="record">
                            <td class="percent">
                                <p>{{ record.percent }}%</p>
                            </td>
                            <td class="user">
                                <p>{{ record.user }}</p>
                            </td>
                            <td class="hz">
                                <p>{{ record.hz }}Hz</p>
                            </td>
                            <td class="link">
                                <a :href="record.link">
                                    <img src="/assets/video.svg" alt="Video">
                                </a>
                            </td>
                        </tr>
                    </table>
                </div>
            </div>
        </main>
    `,
    data: () => ({
        list: [],
        loading: true,
        selected: 0,
    }),
    computed: {
        level() {
            return this.list[this.selected];
        },
    },
    async mounted() {
        // Hide loading spinner
        this.list = await fetchList();
        this.loading = false;
    },
    methods: {
        embed,
        score,
    },
};
