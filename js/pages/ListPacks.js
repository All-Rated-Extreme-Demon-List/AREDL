import { fetchPacks, fetchPackLevels } from "../content.js";

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
            <div class="packs-nav">
                <button @click="switchLevels(i)" v-for="(pack, i) in packs" :style="{backgroundColor: pack.colour}">
                    {{pack.name}}
                </button>
            </div>
            <div v-if="loadingPack" class="levels-list">
                <Spinner></Spinner>
            </div>
            <div v-else class="levels-list">
                <div v-for="(level, i) in selectedPackLevels" :style="{backgroundColor: pack.colour}" class="pack-div">
                    {{level[0].level.name}}
                </div>
            </div>
        </main>
    `,
    data: () => ({
        packs: [],
        errors: [],
        selected: 0,
        selectedPackLevels: [],
        loading: true,
        loadingPack: true,
    }),
    computed: {
        pack() {
            return this.packs[this.selected];
        },
    },
    async mounted() {
        this.packs = await fetchPacks();
        this.selectedPackLevels = await fetchPackLevels(this.packs[this.selected].name);

        // Error handling todo: make error handling
        // if (!this.packs) {
        //     this.errors = [
        //         "Failed to load list. Retry in a few minutes or notify list staff.",
        //     ];
        // } else {
        //     this.errors.push(
        //         ...this.packs
        //             .filter(([_, err]) => err)
        //             .map(([_, err]) => {
        //                 return `Failed to load level. (${err}.json)`;
        //             })
        //     );
        // }

        // Hide loading spinner
        this.loading = false;
        this.loadingPack = false;
    },
    methods: {
        async switchLevels(i){
            this.loadingPack = true

            this.selected = i
            this.selectedPackLevels = await fetchPackLevels(this.packs[this.selected].name);

            this.loadingPack = false
        },
    },
};
