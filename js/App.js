import Leaderboard from './components/Leaderboard.js';
import Level from './components/Level.js';
import List from './components/List.js';

export default {
    components: { Leaderboard, Level, List },
    template: `
        <List :list="list" v-model="selected"></List>
        <Level :level="level" :rank="selected + 1"></Level>
        <Leaderboard :list="list"></Leaderboard>
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
