<script lang="ts">
	import { goto } from '$app/navigation';
	import Button from '$lib/components/ui/button/button.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import {
		loadActiveRound,
		loadGames,
		setActiveRound,
		setVisible
	} from '$lib/service/supabaseAPI.svelte';
	import { store } from '$lib/store/MainStore.svelte';
	import { onMount } from 'svelte';
	import Sidebar from '../Sidebar.svelte';

	type Vote = {
		first: number | null;
		second: number | null;
		third: number | null;
	};

	type VotingState = {
		categories: string[];
		votes?: Record<string, Vote>;
		votesByTeam?: Record<string, Record<string, Vote>>;
	};

	const votingStorageKey = 'teamVoting';
	const defaultCategories = ['Bestes Kostuem', 'Fairplay', 'Teamgeist'];

	let round = $state<number | string>('');
	let votingCategories = $state<string[]>(defaultCategories);
	let newVotingCategory = $state('');
	let votingMessage = $state('');

	onMount(async () => {
		const activeRound = await loadActiveRound();
		const games = await loadGames();

		if (typeof activeRound === 'number') store.activeRound = activeRound;
		if (Array.isArray(games)) store.games = games as typeof store.games;

		round = store.activeRound + 1;
		loadVotingCategories();
		localStorage.setItem('admin', 'true');
	});

	function setShow(game: any) {
		setVisible(game.title, !game.visible);
		game.visible = !game.visible;
	}

	function save() {
		const selectedRound = Number(round);
		if (Number.isNaN(selectedRound)) return;

		store.activeRound = selectedRound - 1;
		setActiveRound(selectedRound);
		goto('/punktetabelle');
	}

	function readSavedVoting() {
		const savedVoting = localStorage.getItem(votingStorageKey);

		if (!savedVoting) return undefined;

		try {
			return JSON.parse(savedVoting) as VotingState;
		} catch (error) {
			console.error('Voting konnte nicht gelesen werden:', error);
			return undefined;
		}
	}

	function writeVotingState(nextState: VotingState, message: string) {
		localStorage.setItem(votingStorageKey, JSON.stringify(nextState));

		if (!message) return;

		votingMessage = message;
		window.setTimeout(() => (votingMessage = ''), 1600);
	}

	function loadVotingCategories() {
		const parsed = readSavedVoting();
		votingCategories = parsed?.categories?.length ? parsed.categories : defaultCategories;

		if (!parsed?.categories?.length) {
			writeVotingState(
				{ categories: votingCategories, votesByTeam: parsed?.votesByTeam ?? {} },
				''
			);
		}
	}

	function addVotingCategory() {
		const trimmedCategory = newVotingCategory.trim();

		if (!trimmedCategory || votingCategories.includes(trimmedCategory)) return;

		const parsed = readSavedVoting();
		votingCategories = [...votingCategories, trimmedCategory];
		newVotingCategory = '';

		writeVotingState(
			{
				...parsed,
				categories: votingCategories,
				votesByTeam: parsed?.votesByTeam ?? {}
			},
			'Kategorie gespeichert'
		);
	}

	function removeVotingCategory(category: string) {
		const parsed = readSavedVoting();
		const nextVotesByTeam: Record<string, Record<string, Vote>> = {};

		for (const [teamKey, teamVotes] of Object.entries(parsed?.votesByTeam ?? {})) {
			const nextTeamVotes = { ...teamVotes };
			delete nextTeamVotes[category];
			nextVotesByTeam[teamKey] = nextTeamVotes;
		}

		votingCategories = votingCategories.filter((item) => item !== category);

		writeVotingState(
			{
				...parsed,
				categories: votingCategories,
				votesByTeam: nextVotesByTeam
			},
			'Kategorie geloescht'
		);
	}
</script>

<Sidebar />
<main class="min-h-screen overflow-y-auto bg-stone-100 px-4 pt-6 pb-10 md:px-8 md:py-8">
	<div class="mx-auto flex max-w-5xl flex-col gap-5">
		<section class="rounded-lg border border-stone-200 bg-white p-4 shadow-sm md:p-5">
			<div class="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
				<div>
					<h1 class="text-2xl font-bold text-stone-900">Admin Panel</h1>
					<p class="text-sm text-stone-600">Runde, sichtbare Spiele und Voting-Kategorien.</p>
				</div>
				<Button class="h-10 md:w-36" onclick={save}>Speichern</Button>
			</div>
		</section>

		<section class="rounded-lg border border-stone-200 bg-white p-4 shadow-sm md:p-5">
			<label class="flex flex-col gap-2 text-sm font-semibold text-stone-700">
				Aktive Runde
				<Input type="number" min="1" max="5" bind:value={round} />
			</label>
		</section>

		<section class="rounded-lg border border-stone-200 bg-white p-4 shadow-sm md:p-5">
			<div>
				<h2 class="text-xl font-bold text-stone-900">Spiele anzeigen</h2>
				<p class="text-sm text-stone-600">Tippen blendet ein Spiel ein oder aus.</p>
			</div>

			<div class="mt-4 grid gap-2 sm:grid-cols-2">
				{#each store.games as game}
					<Button
						variant={game.visible ? 'default' : 'outline'}
						class="min-h-11 justify-start text-left whitespace-normal"
						onclick={() => setShow(game)}
					>
						<span class="mr-2">{game.visible ? 'An' : 'Aus'}</span>
						{game.title}
					</Button>
				{/each}
			</div>
		</section>

		<section class="rounded-lg border border-stone-200 bg-white p-4 shadow-sm md:p-5">
			<div class="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
				<div>
					<h2 class="text-xl font-bold text-stone-900">Voting-Kategorien</h2>
					<p class="text-sm text-stone-600">Kategorien werden hier erstellt und geloescht.</p>
				</div>
				{#if votingMessage}
					<p class="rounded-md bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-700">
						{votingMessage}
					</p>
				{/if}
			</div>

			<div class="mt-4 flex flex-col gap-2 sm:flex-row">
				<Input
					bind:value={newVotingCategory}
					placeholder="Neue Kategorie"
					onkeydown={(event) => event.key === 'Enter' && addVotingCategory()}
				/>
				<Button class="h-9 sm:w-44" onclick={addVotingCategory}>Hinzufuegen</Button>
			</div>

			<div class="mt-4 flex flex-col gap-2">
				{#each votingCategories as category}
					<div
						class="flex flex-col gap-2 rounded-md border border-stone-200 bg-stone-50 p-3 sm:flex-row sm:items-center sm:justify-between"
					>
						<p class="font-semibold text-stone-900">{category}</p>
						<Button variant="outline" size="sm" onclick={() => removeVotingCategory(category)}>
							Loeschen
						</Button>
					</div>
				{:else}
					<p class="rounded-md bg-stone-50 p-3 text-sm text-stone-500">
						Noch keine Kategorien angelegt.
					</p>
				{/each}
			</div>
		</section>
	</div>
</main>
