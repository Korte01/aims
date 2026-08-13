<script lang="ts">
	import { goto } from '$app/navigation';
	import Button from '$lib/components/ui/button/button.svelte';
	import { loadTeams } from '$lib/service/supabaseAPI.svelte';
	import { store } from '$lib/store/MainStore.svelte';
	import { onMount } from 'svelte';

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

	type Result = {
		teamId: number;
		name: string;
		points: number;
		firstPlaces: number;
		secondPlaces: number;
		thirdPlaces: number;
	};

	const storageKey = 'teamVoting';
	const pointsByPlace = { first: 3, second: 2, third: 1 };
	const revealOrder = [3, 2, 1];

	let isAdmin = $state(false);
	let categories = $state<string[]>([]);
	let votesByTeam = $state<Record<string, Record<string, Vote>>>({});
	let currentCategoryIndex = $state(0);
	let revealedPlaces = $state(0);

	onMount(() => {
		isAdmin = localStorage.getItem('admin') === 'true';

		if (!isAdmin) {
			goto('/punktetabelle');
			return;
		}

		void loadInitialData();
		loadVotingResults();
		window.addEventListener('keydown', handleKeydown);

		return () => window.removeEventListener('keydown', handleKeydown);
	});

	async function loadInitialData() {
		if (store.teams?.length) return;

		const loadedTeams = await loadTeams();
		if (Array.isArray(loadedTeams)) store.teams = loadedTeams as never[];
	}

	function loadVotingResults() {
		const savedVoting = localStorage.getItem(storageKey);

		if (!savedVoting) return;

		try {
			const parsed = JSON.parse(savedVoting) as VotingState;
			categories = parsed.categories ?? [];
			votesByTeam = parsed.votesByTeam ?? (parsed.votes ? { 'team-0': parsed.votes } : {});
		} catch (error) {
			console.error('Voting-Auswertung konnte nicht gelesen werden:', error);
		}
	}

	function categoryResults(category: string) {
		const results = new Map<number, Result>();

		for (const teamVotes of Object.values(votesByTeam)) {
			const vote = teamVotes[category];
			if (!vote) continue;

			for (const [place, teamId] of Object.entries(vote) as Array<[keyof Vote, number | null]>) {
				if (teamId === null) continue;

				const result = results.get(teamId) ?? {
					teamId,
					name: teamName(teamId),
					points: 0,
					firstPlaces: 0,
					secondPlaces: 0,
					thirdPlaces: 0
				};

				result.points += pointsByPlace[place];
				if (place === 'first') result.firstPlaces += 1;
				if (place === 'second') result.secondPlaces += 1;
				if (place === 'third') result.thirdPlaces += 1;
				results.set(teamId, result);
			}
		}

		return [...results.values()].sort((a, b) => {
			if (b.points !== a.points) return b.points - a.points;
			if (b.firstPlaces !== a.firstPlaces) return b.firstPlaces - a.firstPlaces;
			if (b.secondPlaces !== a.secondPlaces) return b.secondPlaces - a.secondPlaces;
			if (b.thirdPlaces !== a.thirdPlaces) return b.thirdPlaces - a.thirdPlaces;
			return a.name.localeCompare(b.name);
		});
	}

	function currentCategory() {
		return categories[currentCategoryIndex] ?? '';
	}

	function currentResults() {
		return categoryResults(currentCategory());
	}

	function visibleWinners() {
		const winners = currentResults().slice(0, 3);
		const visiblePlaces = revealOrder.slice(0, revealedPlaces);

		return visiblePlaces
			.map((place) => ({ place, result: winners[place - 1] }))
			.filter((entry) => entry.result);
	}

	function teamName(teamId: number) {
		return store.teams[teamId] ?? `Team ${teamId + 1}`;
	}

	function voteCount() {
		return Object.keys(votesByTeam).length;
	}

	function nextStep() {
		if (!categories.length) return;

		if (revealedPlaces < 3) {
			revealedPlaces += 1;
			return;
		}

		if (currentCategoryIndex < categories.length - 1) {
			currentCategoryIndex += 1;
			revealedPlaces = 0;
		}
	}

	function previousStep() {
		if (revealedPlaces > 0) {
			revealedPlaces -= 1;
			return;
		}

		if (currentCategoryIndex > 0) {
			currentCategoryIndex -= 1;
			revealedPlaces = 3;
		}
	}

	function resetPresentation() {
		currentCategoryIndex = 0;
		revealedPlaces = 0;
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'ArrowRight' || event.key === ' ') {
			event.preventDefault();
			nextStep();
		}

		if (event.key === 'ArrowLeft') {
			event.preventDefault();
			previousStep();
		}
	}
</script>

{#if isAdmin}
	<main
		class="relative h-screen overflow-hidden bg-neutral-950 px-4 pt-3 pb-20 text-white md:px-8 md:pt-4 md:pb-20"
	>
		<div class="mx-auto flex h-full max-w-7xl flex-col overflow-hidden">
			<header
				class="flex shrink-0 flex-col gap-2 border-b border-white/15 pb-2 md:flex-row md:items-end md:justify-between"
			>
				<div>
					<p class="text-sm font-semibold tracking-[0.22em] text-emerald-300 uppercase">
						Voting Auswertung
					</p>
					<h1 class="text-3xl font-black md:text-4xl">
						{currentCategory() || 'Noch keine Kategorien'}
					</h1>
				</div>

				<div
					class="flex flex-wrap items-center gap-2 text-xs font-semibold text-neutral-300 md:text-sm"
				>
					<span class="rounded-md border border-white/15 px-3 py-1">
						Kategorie {categories.length ? currentCategoryIndex + 1 : 0} / {categories.length}
					</span>
					<span class="rounded-md border border-white/15 px-3 py-1">{voteCount()} Team-Votings</span
					>
				</div>
			</header>

			{#if categories.length}
				<section class="grid min-h-0 flex-1 content-center gap-3 py-3 md:grid-cols-3 md:gap-4">
					{#each visibleWinners() as winner}
						<div
							class={`flex min-h-36 flex-col justify-between rounded-lg border p-4 shadow-2xl md:min-h-48 md:p-5 ${
								winner.place === 1
									? 'border-emerald-300 bg-emerald-400 text-neutral-950'
									: 'border-white/15 bg-white text-neutral-950'
							}`}
						>
							<div class="flex items-start justify-between gap-4">
								<p class="text-2xl font-black md:text-3xl">Platz {winner.place}</p>
								<p
									class="rounded-md bg-neutral-950 px-3 py-1 text-xl font-black text-white md:text-2xl"
								>
									{winner.result.points}
								</p>
							</div>

							<div>
								<p class="text-3xl leading-tight font-black break-words md:text-4xl">
									{winner.result.name}
								</p>
							</div>
						</div>
					{/each}

					{#if revealedPlaces === 0}
						<div class="rounded-lg border border-white/15 bg-white/5 p-5 md:col-span-3 md:p-8">
							<p class="text-3xl font-black md:text-5xl">Bereit fuer die Gewinner?</p>
						</div>
					{/if}
				</section>

				{#if revealedPlaces === 3}
					<section
						class="max-h-32 shrink-0 overflow-hidden rounded-lg border border-white/15 bg-white/5 p-3 md:max-h-36"
					>
						<h2 class="text-base font-black">Komplette Rangliste</h2>
						<div class="mt-2 grid gap-1 md:grid-cols-2">
							{#each currentResults() as result, index}
								<div
									class="flex items-center justify-between gap-3 rounded-md bg-white px-3 py-1 text-sm text-neutral-950"
								>
									<span class="font-bold">{index + 1}. {result.name}</span>
									<span class="font-black">{result.points} Punkte</span>
								</div>
							{/each}
						</div>
					</section>
				{/if}

				<footer
					class="absolute right-4 bottom-3 left-4 mx-auto flex max-w-7xl flex-col gap-2 border-t border-white/15 bg-neutral-950 pt-3 sm:flex-row sm:items-center sm:justify-between md:right-8 md:left-8"
				>
					<div class="flex gap-2">
						<Button variant="outline" class="bg-white text-neutral-950" onclick={previousStep}
							>Zurueck</Button
						>
						<Button class="bg-emerald-400 text-neutral-950 hover:bg-emerald-300" onclick={nextStep}>
							{revealedPlaces < 3
								? `Platz ${revealOrder[revealedPlaces]} zeigen`
								: currentCategoryIndex < categories.length - 1
									? 'Naechste Kategorie'
									: 'Fertig'}
						</Button>
					</div>
					<div class="flex gap-2">
						<Button variant="outline" class="bg-white text-neutral-950" onclick={loadVotingResults}>
							Aktualisieren
						</Button>
						<Button variant="outline" class="bg-white text-neutral-950" onclick={resetPresentation}>
							Neu starten
						</Button>
					</div>
				</footer>
			{:else}
				<section class="flex flex-1 items-center justify-center py-10">
					<div class="max-w-2xl rounded-lg border border-white/15 bg-white/5 p-8 text-center">
						<h2 class="text-3xl font-black">Noch keine Voting-Daten gefunden</h2>
						<p class="mt-3 text-neutral-300">
							Sobald im Browser unter Voting Stimmen gespeichert sind, erscheint hier die
							Auswertung.
						</p>
					</div>
				</section>
			{/if}
		</div>
	</main>
{/if}
