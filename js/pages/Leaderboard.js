import { getFontColour } from '../util.js';

import Spinner from '../components/Spinner.js';
import {pb} from "../pocketbase.js";

const perPage = 100;

export default {
    components: {
        Spinner,
    },
    data: () => ({
        leaderboardData: null,
        loadingLeaderboard: true,
        user: null,
        loadingUser: true,
        usedFilter: null,
        filter: null,
        page: 1,
        selectedUser: 0,
    }),
    template: `
        <main class="page-leaderboard-container">
            <div class="page-leaderboard">
                <div class="board-container">
                    <div class="page-leaderboard-header">
                        <div class="name-filter">
                            <input type="text" v-model="filter" v-on:keyup.enter="updateFilter" placeholder="search">
                            <button @click="updateFilter">
                                <img src="/assets/search-icon.svg" alt="search icon">
                            </button>
                        </div>
                        <div class="page-nav">
                            <button @click="updatePage(page - 1)" class="previous" :disabled="page === 1">\<</button>
                            <input type="number" v-model="page" v-on:keyup.enter="updatePage(page)">
                            <p>/ {{leaderboardData?.pages}}</p>
                            <button @click="updatePage(page + 1)" class="next" :disabled="!leaderboardData || page === leaderboardData.pages">\></button>
                        </div>
                    </div>
                    <spinner v-if="loadingLeaderboard"></spinner>
                    <table v-else class="board">
                        <tr v-for="entry in leaderboardData.list">
                            <td class="rank">
                                <p class="type-label-lg">#{{ entry.rank }}</p>
                            </td>
                            <td class="total">
                                <p class="type-label-lg">{{ entry.points }}</p>
                            </td>
                            <td class="user" :class="{ 'active': selectedUser === entry.user.id }">
                                <button @click="switchUser(entry.user.id)">
                                    <span class="type-label-lg">{{ entry.user.global_name }}</span>
                                </button>
                            </td>
                        </tr>
                    </table>
                </div>
                <div class="player-container">
                    <spinner v-if="loadingUser"></spinner>
                    <div v-else class="player">
                        <h2>#{{ user.rank.position }} {{user.global_name}} - {{ user.records.length }} demons</h2>
                        <h3>{{ user.rank.points }} points</h3>
                        <p>Packs Bonus: {{ packPoints }} points</p>
                        <div class="packs" v-if="user.packs && user.packs.length > 0">
                            <div v-for="pack in user.packs" class="tag" :style="{background:pack.color, color:getFontColour(pack.color)}">
                                {{pack.name}}
                            </div>
                        </div>
                        <h2 v-if="verified.length > 0">Verified ({{ verified.length}})</h2>
                        <table class="table">
                            <tr v-for="score in verified">
                                <td class="rank">
                                    <p>#{{ score.level.position }}</p>
                                </td>
                                <td class="level">
                                    <a class="type-label-lg" target="_blank" :href="score.video_url">{{ score.level.name }}</a>
                                </td>
                                <td class="score">
                                    <p>+{{ score.level.points.toFixed(1) }}</p>
                                </td>
                            </tr>
                        </table>
                        <h2 v-if="completed.length > 0">Completed ({{ completed.length }})</h2>
                        <table class="table">
                            <tr v-for="score in completed">
                                <td class="rank">
                                    <p>#{{ score.level.position }}</p>
                                </td>
                                <td class="level">
                                    <a class="type-label-lg" target="_blank" :href="score.video_url">{{ score.level.name }}</a>
                                </td>
                                <td class="score">
                                    <p>+{{ score.level.points.toFixed(1) }}</p>
                                </td>
                            </tr>
                        </table>
                    </div>
                </div>
            </div>
        </main>
    `,
    computed: {
        verified() {
            return this.user.records.filter(function(r) {return r.placement_order === 1})
        },
        completed() {
            return this.user.records.filter(function(r) {return r.placement_order !== 1})
        },
        packPoints() {
            if (!this.user.packs) {
                return 0;
            }
            return this.user.packs.reduce((accumulator, value) => {
                return accumulator + value.points;
            }, 0).toFixed(1);
        }
    },
    async mounted() {
        await this.updateLeaderboardData()
        if (this.leaderboardData && this.leaderboardData.list.length > 0) {
            await this.switchUser(this.leaderboardData.list[0].user.id)
        }
    },
    methods: {
        async updateLeaderboardData() {
            this.loadingLeaderboard = true;
            let query_options= {
                page: this.page,
                per_page: perPage,
            }
            if (this.usedFilter) {
                query_options["name_filter"] = this.usedFilter
            }
            this.leaderboardData = await pb.send("/api/aredl/leaderboard", {
                query: query_options
            });
            this.loadingLeaderboard = false;
        },
        async switchUser(userId) {
            this.loadingUser = true;
            this.selectedUser = userId;
            this.user = await pb.send("/api/aredl/user", {
                query: {
                    id: userId,
                }
            })
            this.loadingUser = false;
        },
        async updateFilter() {
            this.usedFilter = this.filter;
            this.page = 1;
            await this.updateLeaderboardData();
        },
        async updatePage(page) {
            this.page = page;
            if (page <= 0) {
                this.page = 1;
            } else if (this.leaderboardData && this.page > this.leaderboardData.pages) {
                this.page = this.leaderboardData.pages;
            }
            await this.updateLeaderboardData();
        },
        getFontColour,
    },
};
