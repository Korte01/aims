<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import { loadTeams } from '$lib/service/supabaseAPI.svelte';
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

	const storageKey = 'teamVoting';
	const emptyVote: Vote = { first: null, second: null, third: null };
	const pointsByPlace = { first: 3, second: 2, third: 1 };

	let categories = $state<string[]>(['Bestes Kostuem', 'Fairplay', 'Teamgeist']);
	let votes = $state<Record<string, Vote>>({});
	let savedMessage = $state('');
	let currentTeamKey = $state('team-0');

	onMount(async () => {
		if (!store.teams?.length) {
			const loadedTeams = await loadTeams();
			if (Array.isArray(loadedTeams)) store.teams = loadedTeams as never[];
		}

		loadVoting();
	});

	function getTeamKey() {
		return `team-${store.teamID}`;
	}

	function readSavedVoting() {
		const savedVoting = localStorage.getItem(storageKey);

		if (!savedVoting) return undefined;

		try {
			return JSON.parse(savedVoting) as VotingState;
		} catch (error) {
			console.error('Voting konnte nicht gelesen werden:', error);
			return undefined;
		}
	}

	function loadVoting() {
		const parsed = readSavedVoting();

		if (!parsed) {
			ensureVotes();
			return;
		}

		currentTeamKey = getTeamKey();
		categories = parsed.categories?.length ? parsed.categories : categories;
		votes = parsed.votesByTeam?.[currentTeamKey] ?? parsed.votes ?? {};
		ensureVotes();
	}

	function ensureVotes() {
		const nextVotes: Record<string, Vote> = {};

		for (const category of categories) {
			nextVotes[category] = votes[category] ?? { ...emptyVote };
		}

		votes = nextVotes;
		saveVoting(false);
	}

	function saveVoting(showMessage = true) {
		currentTeamKey = getTeamKey();

		const parsed = readSavedVoting();
		const votesByTeam = parsed?.votesByTeam ?? {};

		localStorage.setItem(
			storageKey,
			JSON.stringify({
				categories,
				votesByTeam: {
					...votesByTeam,
					[currentTeamKey]: votes
				}
			})
		);

		if (showMessage) {
			savedMessage = 'Gespeichert';
			window.setTimeout(() => (savedMessage = ''), 1600);
		}
	}

	function setVote(category: string, place: keyof Vote, value: string) {
		const teamId = value === '' ? null : Number(value);
		const currentVote = votes[category] ?? { ...emptyVote };
		const nextVote: Vote = { ...currentVote, [place]: teamId };

		if (teamId !== null) {
			for (const votePlace of Object.keys(nextVote) as Array<keyof Vote>) {
				if (votePlace !== place && nextVote[votePlace] === teamId) {
					nextVote[votePlace] = null;
				}
			}
		}

		votes = { ...votes, [category]: nextVote };
		saveVoting();
	}

	function selectableTeams(category: string, place: keyof Vote) {
		const currentVote = votes[category] ?? emptyVote;

		return store.teams
			.map((name: string, id: number) => ({ id, name }))
			.filter(({ id }) => {
				if (id === store.teamID) return false;

				return Object.entries(currentVote).every(
					([votePlace, selectedId]) => votePlace === place || selectedId !== id
				);
			});
	}

	function teamName(teamId: number | null) {
		if (teamId === null) return '-';

		return store.teams[teamId] ?? `Team ${teamId + 1}`;
	}

	function categoryScores(category: string) {
		const scoreMap = new Map<number, number>();
		const categoryVote = votes[category] ?? emptyVote;

		for (const [place, teamId] of Object.entries(categoryVote) as Array<
			[keyof Vote, number | null]
		>) {
			if (teamId === null) continue;
			scoreMap.set(teamId, (scoreMap.get(teamId) ?? 0) + pointsByPlace[place]);
		}

		return [...scoreMap.entries()]
			.map(([teamId, points]) => ({ teamId, points }))
			.sort((a, b) => b.points - a.points);
	}
</script>

<Sidebar />
<main class="px-4 pt-6 pb-12 md:min-h-screen md:bg-stone-100 md:px-8 md:py-8">
	<div class="mx-auto flex max-w-5xl flex-col gap-5">
		<section class="rounded-lg border border-stone-200 bg-white p-4 shadow-sm md:p-5">
			<div class="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
				<div>
					<h1 class="text-2xl font-bold text-stone-900">Voting</h1>
					<p class="text-sm text-stone-600">
						{store.teams[store.teamID] ?? 'Dein Team'} votet pro Kategorie Platz 1, 2 und 3.
					</p>
				</div>
				{#if savedMessage}
					<p class="rounded-md bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-700">
						{savedMessage}
					</p>
				{/if}
			</div>
		</section>

		{#each categories as category}
			<section class="rounded-lg border border-stone-200 bg-white p-4 shadow-sm md:p-5">
				<div class="flex items-start justify-between gap-3">
					<div>
						<h2 class="text-xl font-bold text-stone-900">{category}</h2>
						<p class="text-sm text-stone-600">Eigenes Team und doppelte Auswahl sind gesperrt.</p>
					</div>
				</div>

				<div class="mt-4 grid gap-3 md:grid-cols-3">
					<label class="flex flex-col gap-1 text-sm font-semibold text-stone-700">
						Platz 1
						<select
							class="focus:border-ring focus:ring-ring/40 h-10 rounded-md border border-stone-300 bg-white px-3 text-sm transition outline-none focus:ring-2"
							value={votes[category]?.first ?? ''}
							onchange={(event) => setVote(category, 'first', event.currentTarget.value)}
						>
							<option value="">Auswaehlen</option>
							{#each selectableTeams(category, 'first') as team}
								<option value={team.id}>{team.name}</option>
							{/each}
						</select>
					</label>

					<label class="flex flex-col gap-1 text-sm font-semibold text-stone-700">
						Platz 2
						<select
							class="focus:border-ring focus:ring-ring/40 h-10 rounded-md border border-stone-300 bg-white px-3 text-sm transition outline-none focus:ring-2"
							value={votes[category]?.second ?? ''}
							onchange={(event) => setVote(category, 'second', event.currentTarget.value)}
						>
							<option value="">Auswaehlen</option>
							{#each selectableTeams(category, 'second') as team}
								<option value={team.id}>{team.name}</option>
							{/each}
						</select>
					</label>

					<label class="flex flex-col gap-1 text-sm font-semibold text-stone-700">
						Platz 3
						<select
							class="focus:border-ring focus:ring-ring/40 h-10 rounded-md border border-stone-300 bg-white px-3 text-sm transition outline-none focus:ring-2"
							value={votes[category]?.third ?? ''}
							onchange={(event) => setVote(category, 'third', event.currentTarget.value)}
						>
							<option value="">Auswaehlen</option>
							{#each selectableTeams(category, 'third') as team}
								<option value={team.id}>{team.name}</option>
							{/each}
						</select>
					</label>
				</div>

				<div class="mt-4 rounded-md bg-stone-50 p-3">
					<p class="text-sm font-bold text-stone-800">Auswertung dieser Stimme</p>
					<div class="mt-2 flex flex-wrap gap-2">
						{#each categoryScores(category) as result}
							<span
								class="rounded-md border border-stone-200 bg-white px-3 py-1 text-sm text-stone-700"
							>
								{teamName(result.teamId)}: {result.points} Punkte
							</span>
						{:else}
							<span class="text-sm text-stone-500">Noch keine Stimme abgegeben.</span>
						{/each}
					</div>
				</div>
			</section>
		{:else}
			<section class="rounded-lg border border-stone-200 bg-white p-4 shadow-sm md:p-5">
				<p class="text-sm text-stone-600">
					Noch keine Voting-Kategorien angelegt. Kategorien werden im Admin Panel verwaltet.
				</p>
			</section>
		{/each}
	</div>
</main>
