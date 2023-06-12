import { fetchPacks } from "../content.js";

import Spinner from "../components/Spinner.js";

export default {
    components: {
        Spinner,
    },
    data: () => ({
        packs: [],
        loading: true,
    }),
    template: `
        <main v-if="loading">
            <Spinner></Spinner>
        </main>
        <main v-else class="page-packs">
            <div v-for="pack in packs" :style="{backgroundColor: pack.colour}">
                {{pack.name}}
                <p v-for="level in pack.levels">
                    {{level}}
                </p>
            </div>
        </main>
    `,
    computed: {
    },
    async mounted() {
        const packs = await fetchPacks();
        this.packs = packs;
        console.log(this.packs)
        // Hide loading spinner
        this.loading = false;
    },
    methods: {
    },
};
