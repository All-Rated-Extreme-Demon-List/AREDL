import List from "./pages/List.vue";
import Leaderboard from "./pages/Leaderboard.vue";
import Roulette from "./pages/Roulette.vue";
import ListPacks from "./pages/ListPacks.vue";
import Login from "./pages/Login.vue";

export default [
	{
		path: "/",
		name: "List",
		component: List,
	},
	{
		path: "/leaderboard",
		name: "Leaderboard",
		component: Leaderboard,
	},
	{
		path: "/roulette",
		name: "Roulette",
		component: Roulette,
	},
	{
		path: "/list-packs",
		name: "ListPacks",
		component: ListPacks,
	},
	{
		path: "/login",
		name: "Login",
		component: Login,
	},
];
