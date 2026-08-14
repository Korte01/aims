<script lang="ts">
	import CardContent from '$lib/components/ui/card/card-content.svelte';
	import Card from '$lib/components/ui/card/card.svelte';
	import { store } from '$lib/store/MainStore.svelte';
	import { onMount } from 'svelte';
	import { loadGames, loadSpielplan, loadTeams } from '$lib/service/supabaseAPI.svelte';
	import { onDataChanged } from '$lib/store/eventBus';
	import { flip } from 'svelte/animate';

	let teams: { teamId: number; teamName: string; points: number }[] = $state([]);
	let points = [10, 8, 6, 4, 2, 0];

	function buildResults() {
		let result = [];
		let allteams = store.teams;
		let i = 0;

		for (const team of allteams as any[]) {
			let gesPoints = 0;

			for (const game of store.games as any[]) {
				if (!game.isVs) {
					let place = game.results?.findIndex((value: number) => value === i);
					if (typeof place === 'number' && place >= 0) gesPoints += points[place];
				}
			}

			for (const round of store.spielplan as any[]) {
				for (const match of round.matches as any[]) {
					if (match.winner == i) gesPoints += 8;
				}
			}

			result.push({ teamId: i, teamName: team, points: gesPoints });
			i++;
		}

		teams = result.sort((a, b) => b.points - a.points);
	}

	function podiumClass(index: number): string {
		if (index === 0) return 'border-yellow-300 bg-yellow-50';
		if (index === 1) return 'border-neutral-300 bg-neutral-50';
		return 'border-emerald-300 bg-emerald-50';
	}

	function mobileRankClass(index: number): string {
		if (index === 0) return 'bg-yellow-300';
		if (index === 1) return 'bg-gray-300';
		if (index === 2) return 'bg-[#1cd086]';
		return 'bg-white';
	}

	function rankLabel(index: number): string {
		if (index === 0) return '1.';
		if (index === 1) return '2.';
		if (index === 2) return '3.';
		return `${index + 1}.`;
	}

	onMount(() => {
		let unsubscribe: (() => void) | undefined;

		async function init() {
			store.games = (await loadGames()) as any;
			store.spielplan = (await loadSpielplan()) as any;
			store.teams = (await loadTeams()) as any;
			buildResults();

			unsubscribe = onDataChanged(async () => {
				buildResults();
			});
		}

		init();

		return () => {
			unsubscribe?.();
		};
	});
</script>

<section class="w-full max-w-7xl px-2 pb-10 md:px-0">
	<div class="grid grid-cols-1 gap-4 md:hidden">
		<div class="bg-primary w-fit rounded-md px-2 py-1 text-sm font-medium text-white">
			Gesamtpunktestand
		</div>

		{#each teams as team, i (team.teamName)}
			<div animate:flip>
				<Card
					class={`relative overflow-hidden rounded-2xl p-4 text-lg ${mobileRankClass(i)} text-stone-800 shadow-md`}
				>
					<CardContent class="relative z-10 flex items-center justify-between gap-4">
						<div class="w-[40px] text-xl font-black">{i + 1}.</div>
						<div class="flex-1 truncate text-lg font-bold">{team.teamName}</div>
						<div class="w-[80px] text-right font-semibold">{team.points}P</div>
					</CardContent>
				</Card>
			</div>
		{/each}
	</div>

	<div class="hidden md:block">
		<div class="mb-8 flex flex-col items-center gap-1 text-center">
			<p class="text-sm font-semibold tracking-[0.18em] text-[#1cd086] uppercase">Gesamtwertung</p>
			<h1 class="text-5xl font-black text-stone-900">Punktestand</h1>
		</div>

		{#if teams.length > 0}
			<div class="grid gap-4 md:grid-cols-3 md:items-end">
				{#each teams.slice(0, 3) as team, i (team.teamName)}
					<div animate:flip class={i === 0 ? 'md:order-2' : i === 1 ? 'md:order-1' : 'md:order-3'}>
						<Card
							class={`relative overflow-hidden rounded-lg border-2 ${podiumClass(i)} p-5 text-stone-900 shadow-sm ${i === 0 ? 'md:min-h-56' : 'md:min-h-44'}`}
						>
							<CardContent class="relative z-10 flex h-full flex-col gap-5 p-0">
								<div class="flex items-center justify-between">
									<div class="text-7xl font-black">{rankLabel(i)}</div>
									<div class="rounded-full bg-white px-4 py-2 text-xl font-black shadow-sm">
										{team.points}P
									</div>
								</div>
								<div>
									<div class="truncate text-3xl font-black">{team.teamName}</div>
									<div class="mt-1 text-sm font-medium text-stone-500">Team #{team.teamId + 1}</div>
								</div>
							</CardContent>
							<div
								class="absolute right-0 bottom-0 h-28 w-28 translate-x-8 translate-y-8 rounded-full bg-white/60"
							></div>
						</Card>
					</div>
				{/each}
			</div>

			{#if teams.length > 3}
				<div class="mt-6 overflow-hidden rounded-lg border border-stone-200 bg-white shadow-sm">
					{#each teams.slice(3) as team, i (team.teamName)}
						<div
							animate:flip
							class="grid grid-cols-[88px_1fr_120px] items-center gap-4 border-b border-stone-100 px-7 py-4 last:border-b-0"
						>
							<div class="text-2xl font-black text-stone-400">{rankLabel(i + 3)}</div>
							<div class="min-w-0 truncate text-xl font-bold text-stone-900">
								{team.teamName}
							</div>
							<div class="text-right text-xl font-black text-[#1cd086]">{team.points}P</div>
						</div>
					{/each}
				</div>
			{/if}
		{/if}
	</div>
</section>
