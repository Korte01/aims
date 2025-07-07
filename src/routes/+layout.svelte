<script lang="ts">
	import { onMount } from 'svelte';
	import '../app.css';
	import { goto } from '$app/navigation';
	import { store } from '$lib/store/MainStore.svelte';
	import { get } from 'svelte/store';
	import { page } from '$app/stores';
	import { loadActiveRound, loadGames, loadSpielplan, loadTeams } from '$lib/service/supabaseAPI.svelte';
	import { supabase } from '$lib/service/supabaseClient';
	import { emitDataChanged } from '$lib/store/eventBus';

	let { children } = $props();
	onMount(async () => {
		store.teams=await loadTeams();
		const currentPath = get(page).url.pathname;

		const savedTeamID = localStorage.getItem('teamID');

		if (savedTeamID === null) {
			// Nicht gesetzt → weiterleiten auf Startseite
			goto('/');
		} else {
			// Team-ID aus localStorage ins store übernehmen
			store.teamID = parseInt(savedTeamID);
			if (currentPath === '/') {
				goto('/punktetabelle');
			}
		}
		console.log(loadTeams());

		const teamsSub = supabase
		.channel('public:teams')
		.on('postgres_changes', { event: '*', schema: 'public', table: 'teams' }, async () => {
			const teams = await loadTeams();
			if (Array.isArray(teams)) store.teams = teams;
			emitDataChanged();

		})
		.subscribe();

	// Listener für Tabelle "games"
	const gamesSub = supabase
		.channel('public:games')
		.on('postgres_changes', { event: '*', schema: 'public', table: 'games' }, async () => {
			const games = await loadGames();

			if (Array.isArray(games)) store.games = games;
			emitDataChanged();
		})
		.subscribe();

	// Listener für Tabelle "spielplan"
	const spielplanSub = supabase
		.channel('public:spielplan')
		.on('postgres_changes', { event: '*', schema: 'public', table: 'spielplan' }, async () => {
			const spielplan = await loadSpielplan();

			if (spielplan) store.spielplan = spielplan;
			emitDataChanged();
		})
		.subscribe();

	// Listener für aktive Runde
	const roundSub = supabase
		.channel('public:general')
		.on('postgres_changes', { event: '*', schema: 'public', table: 'general' }, async () => {
			const active = await loadActiveRound();
			if (typeof active === 'number') store.activeRound = active;
		})
		.subscribe();

	// Cleanup (wenn Komponente entladen wird)
	return () => {
		supabase.removeChannel(teamsSub);
		supabase.removeChannel(gamesSub);
		supabase.removeChannel(spielplanSub);
		supabase.removeChannel(roundSub);
	};
	});
</script>


<div></div>
{@render children()}
