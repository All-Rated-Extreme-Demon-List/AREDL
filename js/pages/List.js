import { fetchList } from '../content.js';

import Spinner from '../components/Spinner.js';
import Level from '../components/Level.js';
import List from '../components/List.js';

export default {
    components: { Spinner, Level, List },
    template: `
        <Spinner v-if="loading"></Spinner>
        <template v-else>
            <List :list="list" v-model="selected"></List>
            <Level :level="level" :rank="selected + 1"></Level>
        </template>
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
};
