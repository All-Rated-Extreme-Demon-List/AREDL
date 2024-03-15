import { getFontColour, embed } from "../util.js";

import { store } from "../main.js";
import Spinner from "../components/Spinner.js";
import LevelAuthors from "../components/List/LevelAuthors.js";
import {pb} from "../pocketbase.js";

export default {
    components: {
        Spinner,
        LevelAuthors,
    },
    template: `
        <main v-if="loading">
            <Spinner></Spinner>
        </main>
        <main v-else class="pack-list">
            <div class="packs-nav">
                <div>
                    <button @click="switchPacks(i)" v-for="(pack, i) in packs" :style="{background: pack.color}" class="type-label-lg">
                        <p>{{pack.name}}</p>
                    </button>
                </div>
            </div>
            <div class="list-container">
                <h3>Pack points: {{pack.points}}</h3>
                <table class="list">
                    <tr v-for="(level, i) in levels">
                        <td class="rank">
                            <p class="type-label-lg">#{{ level.position }}</p>
                        </td>
                        <td class="level" :class="{ 'active': selectedLevel === i }">
                            <button :style= "[selectedLevel === i ? {background: pack.color} : {}]" @click="switchLevel(i)">
                                <span class="type-label-lg">{{ level.name }}</span>
                            </button>
                        </td>
                    </tr>
                </table>
            </div>
            <div class="level-container">
                <spinner v-if="loading_level"></spinner>
                <div class="level" v-else>
                    <h1>{{ level.name }}</h1>
                    <LevelAuthors :author="level.publisher" :creators="level.creators"
                                  :verifier="level.verification.submitted_by"></LevelAuthors>
                    <div class="packs" v-if="level.packs.length > 0" style="display: flex; gap: 0.5rem">
                        <div v-for="pack in level.packs" class="tag" :style="{background:pack.color}">
                            <p>{{ pack.name }}</p>
                        </div>
                    </div>
                    <iframe class="video" :src="embed(level.verification.video_url)" frameborder="0"></iframe>
                    <ul class="stats">
                        <li>
                            <div class="type-title-sm">Points when completed</div>
                            <p>{{ level.points }}</p>
                        </li>
                        <li>
                            <div class="type-title-sm">ID</div>
                            <p>{{ level.level_id }}</p>
                        </li>
                    </ul>
                    <h2 v-if="level.records.length === 0">No Records</h2>
                    <h2 v-else>Records ({{ level.records.length }})</h2>
                    <p>100% or better to qualify</p>
                    <table class="records">
                        <tr v-for="record in level.records" class="record">
                            <td class="percent">
                                <p>100%</p>
                            </td>
                            <td class="user">
                                <a :href="record.video_url" target="_blank"
                                   class="type-label-lg">{{ record.submitted_by.global_name }}</a>
                            </td>
                            <td class="mobile">
                                <img v-if="record.mobile"
                                     :src="\`/assets/phone-landscape\${store?.dark ? '-dark' : ''}.svg\`"
                                     alt="Mobile">
                            </td>
                            <td class="hz">
                                <p>{{ record.fps }}Hz</p>
                            </td>
                        </tr>
                    </table>
                </div>
            </div>
            <div class="meta-container">
                <div class="meta">
                    <div class="errors" v-show="errors.length > 0">
                        <p class="error" v-for="error of errors">{{ error }}</p>
                    </div>
                    <h3>About the packs</h3>
                    <p>
                        These are list packs all chosen by the staff team that you can beat levels for and get the packs attached to your profile
                    </p>
                    <h3>How can I get these packs?</h3>
                    <p>
                        It's as simple as just beating the levels and getting your records added! The packs will automatically appear on your profile when all levels have been completed
                    </p>
                </div>
            </div>
        </main>
    `,
    data: () => ({
        packs: [],
        errors: [],
        level: null,
        selected: 0,
        selectedLevel: 0,
        loading: true,
        loading_level: true,
        store,
    }),
    computed: {
        pack() {
            return this.packs[this.selected];
        },
        levels() {
            return this.pack.levels.sort((a, b) => a.position - b.position);
        }
    },
    async mounted() {
        this.packs = await pb.send("/api/aredl/packs", {})
        console.log(this.packs)

        // Hide loading spinner
        this.loading = false;
        await this.switchPacks(0);

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
    },
    methods: {
        async switchPacks(i) {
            this.selected = i;
            await this.switchLevel(0);
        },
        async switchLevel(i) {
            this.loading_level = true;
            this.selectedLevel = i;
            this.level = await pb.send("/api/aredl/level", {
                query: {
                    "id": this.levels[this.selectedLevel].id,
                    "records": true,
                    "creators": true,
                    "verification": true,
                    "packs": true,
                }
            })
            this.loading_level = false;

        },
        embed,
        getFontColour,
    },
};
