import { createWebHistory, createRouter } from "vue-router";
// @ts-ignore
import List from "@/views/List.vue";
// @ts-ignore
import Empty from "@/views/Empty.vue";
// @ts-ignore
import Leaderboard from "@/views/Leaderboard.vue";
// @ts-ignore
import Packs from "@/views/Packs.vue";
// @ts-ignore
import Submission from "@/views/Submission.vue";
// @ts-ignore
import Roulette from "@/views/Roulette.vue";

const routes = [
    {
        path: '/',
        name: "List",
        component: List,
        children: [
            {
                path: 'list/:id?',
                name: "ListSelect",
                component: List,
            }
        ]
    },
    {
        path: '/leaderboard/:id?',
        name: "Leaderboard",
        component: Leaderboard,
    },
    {
        path: '/packs/:id?',
        name: "Packs",
        component: Packs,
    },
    {
        path: '/submit',
        name: "Submit",
        component: Submission,
    },
    {
        path: '/mod',
        name: "Moderation",
        component: Empty,
    },
    {
        path: "/roulette",
        name: "Roulette",
        component: Roulette,
    },
    {
        path: '/:catchAll(.*)*',
        name: "Empty",
        component: Empty,
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router