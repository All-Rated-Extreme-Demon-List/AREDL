import { fetchPacks } from "../content.js";

import Spinner from "../components/Spinner.js";

export default {
    components: {
        Spinner,
    },
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
    data: () => ({
        packs: [],
        errors: [],
        loading: true,
    }),
    computed: {},
    async mounted() {
        this.packs = await fetchList();

        // Error handling
        if (!this.list) {
            this.errors = [
                "Failed to load list. Retry in a few minutes or notify list staff.",
            ];
        } else {
            this.errors.push(
                ...this.list
                    .filter(([_, err]) => err)
                    .map(([_, err]) => {
                        return `Failed to load level. (${err}.json)`;
                    })
            );
        }

        // Hide loading spinner
        this.loading = false;
    },
    methods: {},
};
