<script setup>
import Spinner from "../components/Spinner.vue";
import { pb } from "../pocketbase.js";

const Login = async () => {
	const authData = await pb.collection("users").authWithOAuth2({
		provider: "discord",
		redirectUrl:
			"https://discord.com/api/v10/oauth2/authorize?client_id=1128066454768599100&redirect_uri=http%3A%2F%2F157.245.244.129%2Fapi%2Foauth2-redirect&response_type=code&scope=identify%20email%20connections%20guilds%20guilds.members.read",
		createData: {
			permissions: "member",
		},
	});

	// const discordResponse = await fetch("https://discord.com/api/v10/users/@me", {
	// 	headers: {
	// 		Authorization: `Bearer ${authData.meta.accessToken}`,
	// 	},
	// });
	// const discordData = await discordResponse.json();

	const discordData = await authData.meta.rawUser;

	await pb.collection("users").update(pb.authStore.model.id, {
		global_name: discordData.global_name,
		avatar_url: `https://cdn.discordapp.com/avatars/${discordData.id}/${discordData.avatar}`,
		discord_id: discordData.id,
		banner: discordData.banner
			? `https://cdn.discordapp.com/banners/${discordData.id}/${discordData.banner}`
			: null,
		banner_color: discordData.banner_color,
	});
};
</script>

<template>
	<main v-if="loading">
		<Spinner></Spinner>
	</main>
	<main v-else>
		<button @click="Login">Login with Discord OAuth2</button>
	</main>
</template>

<style>
button {
	background-color: teal;
}
</style>
