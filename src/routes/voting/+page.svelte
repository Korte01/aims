<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import {
		loadTeams,
		loadVotingCategories,
		loadVotingResults,
		saveVotingResult,
		type VotingCategory
	} from '$lib/service/supabaseAPI.svelte';
	import { store } from '$lib/store/MainStore.svelte';
	import { onMount } from 'svelte';
	import Sidebar from '../Sidebar.svelte';

	type Vote = {
		first: number | null;
		second: number | null;
		third: number | null;
	};

	const emptyVote: Vote = { first: null, second: null, third: null };

	let categories = $state<VotingCategory[]>([]);
	let votes = $state<Record<string, Vote>>({});
	let savedMessage = $state('');
	let isLoading = $state(true);

	onMount(async () => {
		if (!store.teams?.length) {
			const loadedTeams = await loadTeams();
			if (Array.isArray(loadedTeams)) store.teams = loadedTeams as never[];
		}

		await loadVoting();
	});

	async function loadVoting() {
		isLoading = true;

		const loadedCategories = await loadVotingCategories();
		const loadedResults = await loadVotingResults(store.teamID);

		if (Array.isArray(loadedCategories)) categories = loadedCategories;

		const nextVotes: Record<string, Vote> = {};

		for (const category of categories) {
			nextVotes[category.id] = { ...emptyVote };
		}

		if (Array.isArray(loadedResults)) {
			for (const result of loadedResults) {
				nextVotes[result.votingID] = {
					first: result.first_place,
					second: result.sec_place,
					third: result.third_place
				};
			}
		}

		votes = nextVotes;
		isLoading = false;
	}

	async function saveVote(categoryId: number, vote: Vote) {
		const response = await saveVotingResult({
			teamID: store.teamID,
			votingID: categoryId,
			first_place: vote.first,
			sec_place: vote.second,
			third_place: vote.third
		});

		savedMessage = response.error ? 'Fehler beim Speichern' : 'Gespeichert';
		window.setTimeout(() => (savedMessage = ''), 1600);
	}

	function setVote(categoryId: number, place: keyof Vote, value: string) {
		const teamId = value === '' ? null : Number(value);
		const currentVote = votes[categoryId] ?? { ...emptyVote };
		const nextVote: Vote = { ...currentVote, [place]: teamId };

		if (teamId !== null) {
			for (const votePlace of Object.keys(nextVote) as Array<keyof Vote>) {
				if (votePlace !== place && nextVote[votePlace] === teamId) {
					nextVote[votePlace] = null;
				}
			}
		}

		votes = { ...votes, [categoryId]: nextVote };
		void saveVote(categoryId, nextVote);
	}

	function selectableTeams(categoryId: number, place: keyof Vote) {
		const currentVote = votes[categoryId] ?? emptyVote;

		return store.teams
			.map((name: string, id: number) => ({ id, name }))
			.filter(({ id }) => {
				if (id === store.teamID) return false;

				return Object.entries(currentVote).every(
					([votePlace, selectedId]) => votePlace === place || selectedId !== id
				);
			});
	}
</script>

<Sidebar />
<main class="px-4 pt-6 pb-12 md:min-h-screen md:bg-stone-100 md:px-8 md:py-8">
	<div class="mx-auto flex max-w-5xl flex-col gap-5">
		<section class="rounded-lg border border-stone-200 bg-white p-4 shadow-sm md:p-5">
			<div class="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
				<div>
					<h1 class="text-2xl font-bold text-stone-900">Voting</h1>
				</div>
				{#if savedMessage}
					<p class="rounded-md bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-700">
						{savedMessage}
					</p>
				{/if}
			</div>
		</section>

		{#if isLoading}
			<section class="rounded-lg border border-stone-200 bg-white p-4 shadow-sm md:p-5">
				<p class="text-sm text-stone-600">Voting wird geladen...</p>
			</section>
		{:else if categories.length}
			{#each categories as category}
				<section class="rounded-lg border border-stone-200 bg-white p-4 shadow-sm md:p-5">
					<div class="flex items-start justify-between gap-3">
						<div>
							<h2 class="text-xl font-bold text-stone-900">{category.name}</h2>
						</div>
					</div>

					<div class="mt-4 grid gap-3 md:grid-cols-3">
						<label class="flex flex-col gap-1 text-sm font-semibold text-stone-700">
							Platz 1
							<select
								class="focus:border-ring focus:ring-ring/40 h-10 rounded-md border border-stone-300 bg-white px-3 text-sm transition outline-none focus:ring-2"
								value={votes[category.id]?.first ?? ''}
								onchange={(event) => setVote(category.id, 'first', event.currentTarget.value)}
							>
								<option value="">Auswaehlen</option>
								{#each selectableTeams(category.id, 'first') as team}
									<option value={team.id}>{team.name}</option>
								{/each}
							</select>
						</label>

						<label class="flex flex-col gap-1 text-sm font-semibold text-stone-700">
							Platz 2
							<select
								class="focus:border-ring focus:ring-ring/40 h-10 rounded-md border border-stone-300 bg-white px-3 text-sm transition outline-none focus:ring-2"
								value={votes[category.id]?.second ?? ''}
								onchange={(event) => setVote(category.id, 'second', event.currentTarget.value)}
							>
								<option value="">Auswaehlen</option>
								{#each selectableTeams(category.id, 'second') as team}
									<option value={team.id}>{team.name}</option>
								{/each}
							</select>
						</label>

						<label class="flex flex-col gap-1 text-sm font-semibold text-stone-700">
							Platz 3
							<select
								class="focus:border-ring focus:ring-ring/40 h-10 rounded-md border border-stone-300 bg-white px-3 text-sm transition outline-none focus:ring-2"
								value={votes[category.id]?.third ?? ''}
								onchange={(event) => setVote(category.id, 'third', event.currentTarget.value)}
							>
								<option value="">Auswaehlen</option>
								{#each selectableTeams(category.id, 'third') as team}
									<option value={team.id}>{team.name}</option>
								{/each}
							</select>
						</label>
					</div>
				</section>
			{/each}
		{:else}
			<section class="rounded-lg border border-stone-200 bg-white p-4 shadow-sm md:p-5">
				<p class="text-sm text-stone-600">
					Noch keine Voting-Kategorien angelegt. Kategorien werden im Admin Panel verwaltet.
				</p>
			</section>
		{/if}
	</div>
</main>
