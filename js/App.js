import { embed } from './util.js';

export default {
    template: `<ul>
        <li v-for="(level, i) in list">
            <button @click="this.selected = i">
                {{ level.name }}
            </button>
        </li>
    </ul>
    <div>
        <template v-if="level">
            <h1>{{ level.name }}</h1>
            <p>{{ level.author }}</p>
            <iframe :src="embed(level.verification)" frameborder="0"></iframe>
            <ul>
                <li v-for="record in level.records">
                    <div>{{ record.percent }}</div>
                    <a :href="record.link">{{ record.user }}</a>
                </li>
            </ul>
        </template>
    </div>
    <ul></ul>`,
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
    methods: {
        embed,
    },
    async mounted() {
        const listResult = await fetch('/data/_list.json');
        const list = await listResult.json();
        this.list = await Promise.all(
            list.map(async (name) => {
                const levelResult = await fetch(`/data/${name}.json`);
                return await levelResult.json();
            })
        );
        this.loading = false;
    },
};
