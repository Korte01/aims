<script lang="ts">
	import CardContent from '$lib/components/ui/card/card-content.svelte';
	import Card from '$lib/components/ui/card/card.svelte';
	import Label from '$lib/components/ui/label/label.svelte';
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

	function podiumOrder(): {
		team: { teamId: number; teamName: string; points: number };
		rank: number;
	}[] {
		const orderedRanks = [1, 0, 2];
		return orderedRanks
			.map((rank) => {
				const team = teams[rank];
				return team ? { team, rank } : null;
			})
			.filter(
				(
					entry
				): entry is { team: { teamId: number; teamName: string; points: number }; rank: number } =>
					Boolean(entry)
			);
	}

	function podiumHeight(rank: number): string {
		if (rank === 0) return 'min-h-[220px]';
		if (rank === 1) return 'min-h-[180px] mt-10';
		return 'min-h-[160px] mt-16';
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

<div class="grid w-full grid-cols-1 gap-4 px-2 md:hidden">
	<div class="max-w-[600px] md:mx-auto md:max-w-[700px] lg:max-w-[900px]">
		<Label class=" bg-primary w-fit   rounded-md px-2 py-1 text-sm font-medium text-white"
			>Gesamtpunktestand</Label
		>
	</div>

	{#each teams as team, i (team.teamName)}
		<div animate:flip>
			<Card
				class={` max-w-[600px] p-4 text-lg md:mx-auto md:max-w-[700px] lg:max-w-[900px] ${podiumClass(i)} shiny  relative overflow-hidden rounded-2xl text-stone-800 shadow-md`}
			>
				<CardContent
					class=" relative z-10 flex min-h-[30px] items-center justify-between gap-4 lg:min-h-[50px]"
				>
					<div class="w-[40px] text-xl font-black">{i + 1}.</div>
					<div class="flex-1 truncate text-lg font-bold">{team.teamName}</div>
					<div class="w-[80px] text-right font-semibold">{team.points}P</div>
				</CardContent>

				<!-- Metallischer Overlay -->
				<div class="metallic-gradient pointer-events-none absolute inset-0"></div>
			</Card>
		</div>
	{/each}
</div>

<div class="hidden w-full px-2 md:block">
	<div class="mx-auto mb-4 max-w-5xl">
		<Label class="bg-primary w-fit rounded-md px-2 py-1 text-sm font-medium text-white">
			Gesamtpunktestand
		</Label>
	</div>

	<div class="mx-auto grid max-w-5xl grid-cols-3 items-end gap-4">
		{#each podiumOrder() as { team, rank } (team.teamName)}
			<div animate:flip>
				<Card
					class={`h-full overflow-hidden rounded-t-lg rounded-b-none border-2 border-b-0 ${podiumClass(rank)} shiny relative text-stone-900 shadow-sm ${podiumHeight(rank)}`}
				>
					<CardContent class="relative z-10 flex h-full flex-col justify-between p-5">
						<div class="flex items-start justify-between gap-3">
							<div class="text-6xl font-black text-stone-400">{rankLabel(rank)}</div>
							<div
								class={`rounded-full px-3 py-2 text-center text-lg font-black text-stone-900 shadow-sm ${mobileRankClass(rank)}`}
							>
								{team.points}P
							</div>
						</div>
						<div class="min-w-0">
							<div class="truncate text-2xl font-black">{team.teamName}</div>
							<div class="mt-1 text-sm font-medium text-stone-500">Platz {rank + 1}</div>
						</div>
					</CardContent>

					<div class="metallic-gradient pointer-events-none absolute inset-0"></div>
				</Card>
			</div>
		{/each}
	</div>

	{#if teams.length > 3}
		<div class="mx-auto mt-4 grid max-w-5xl grid-cols-1 gap-3">
			{#each teams.slice(3) as team, i (team.teamName)}
				<div animate:flip>
					<Card
						class="shiny relative overflow-hidden rounded-lg border border-stone-200 bg-white text-stone-800 shadow-sm"
					>
						<CardContent
							class="relative z-10 grid grid-cols-[72px_1fr_90px] items-center gap-4 p-4"
						>
							<div class="text-3xl font-black text-stone-400">{i + 4}.</div>
							<div class="truncate text-lg font-bold">{team.teamName}</div>
							<div class="text-right text-lg font-black text-[#1cd086]">{team.points}P</div>
						</CardContent>

						<div class="metallic-gradient pointer-events-none absolute inset-0"></div>
					</Card>
				</div>
			{/each}
		</div>
	{/if}
</div>

<style>
	:global(.metallic-gradient) {
		pointer-events: none;
		background: linear-gradient(
			45deg,
			rgba(255, 255, 255, 0.5) 0%,
			rgba(255, 255, 255, 0.3) 20%,
			rgba(255, 255, 255, 0.1) 50%,
			rgba(255, 255, 255, 0.3) 80%,
			rgba(255, 255, 255, 0.5) 100%
		);
		background-size: 300% 300%;
		animation: shine 10s ease-in-out infinite;
		mix-blend-mode: screen;
		border-radius: inherit; /* sorgt für abgerundete Ecken passend zur Card */
	}

	:global(.shiny) {
		position: relative;
		overflow: hidden;
	}

	:global(.shiny::before) {
		content: '';
		position: absolute;
		top: 0;
		bottom: 0;
		left: -50%;
		width: 50%;
		pointer-events: none;

		background: linear-gradient(
			90deg,
			transparent 0%,
			rgba(255, 255, 255, 0.15) 30%,
			rgba(255, 255, 255, 0.5) 50%,
			rgba(255, 255, 255, 0.15) 70%,
			transparent 100%
		);

		filter: blur(10px);
		transform: skewX(-20deg);
		animation: shine-move 10s infinite;
	}
	@keyframes float {
		0%,
		100% {
			transform: translateY(0);
		}
		50% {
			transform: translateY(-10px);
		}
	}

	@keyframes shine-move {
		0% {
			left: -50%;
		}
		100% {
			left: 150%;
		}
	}
</style>
