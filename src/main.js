import routes from "./routes.js";
import App from "./App.vue";
import { createApp, reactive } from "vue";
import { createRouter, createWebHashHistory } from "vue-router";

export const store = reactive({
	dark: JSON.parse(localStorage.getItem("dark")) || false,
	toggleDark() {
		this.dark = !this.dark;
		localStorage.setItem("dark", JSON.stringify(this.dark));
	},
});

const router = createRouter({
	history: createWebHashHistory(),
	routes,
});

const app = createApp(App);

app.use(router);
app.mount("#app");