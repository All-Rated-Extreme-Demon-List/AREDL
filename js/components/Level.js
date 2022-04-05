import { embed } from '../util.js';
import { score } from '../score.js';

export default {
    props: ['level', 'rank'],
    template: `<div>
        <template v-if="level">
            <h1>{{ level.name }}</h1>
            <p>{{ level.author }}</p>
            <p>{{ score(rank, 100, level.percentToQualify) }}</p>
            <iframe :src="embed(level.verification)" frameborder="0"></iframe>
            <ul>
                <li v-for="record in level.records">
                    <div>{{ record.percent }}</div>
                    <a :href="record.link">{{ record.user }}</a>
                </li>
            </ul>
        </template>
    </div>`,
    methods: {
        embed,
        score,
    },
};
