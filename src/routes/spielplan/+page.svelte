<script lang="ts">
	import Label from '$lib/components/ui/label/label.svelte';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import { store } from '$lib/store/MainStore.svelte';
	import { onMount } from 'svelte';
	import DrawerSelectPoints from '../games/[slug]/DrawerSelectPoints.svelte';
	import Sidebar from '../Sidebar.svelte';
	import {
		loadActiveRound,
		loadGames,
		loadSpielplan,
		loadTeams
	} from '$lib/service/supabaseAPI.svelte';
	import { supabase } from '$lib/service/supabaseClient';
	import { Badge } from '$lib/components/ui/badge/index.js';

	let rounds = $state();
	onMount(async () => {
		store.spielplan = await loadSpielplan();
		rounds = store.spielplan;

		// Listener für Tabelle "teams"

		// rounds=store.spielplan;
	});
</script>

<Sidebar />
<main class="bg-stone-200 px-2 pb-28 md:min-h-screen md:px-8 md:py-8">
	<div class="mx-auto grid max-w-6xl gap-4 md:grid-cols-2 xl:grid-cols-3">
		{#each store.spielplan as round, i}
			<div class="p-2 md:p-0">
				<div class="rounded-lg bg-white shadow-md">
					<Label
						class={`flex items-center justify-between rounded-t-lg p-4 text-xl font-bold text-white ${
							i <= store.activeRound ? 'bg-[#1cd086]' : 'bg-[#1cd086]'
						}`}
					>
						<span class="flex items-center gap-x-2">
							Runde {i + 1}
							{#if i == store.activeRound}
								<Badge variant="outline" class="text-white">aktuelle Runde</Badge>
							{/if}
						</span> <span>8P</span>
					</Label>
					{#each round.matches as match}
						<div
							class={`flex items-center justify-between  p-4  ${
								i <= store.activeRound ? 'text-stone-800 ' : 'text-stone-500 '
							}`}
						>
							<div
								class="w-[45%] truncate text-left text-sm font-bold"
								class:text-yellow-500={match?.winner === match.teamA}
							>
								{match?.winner == match.teamA
									? '🏆' + store.teams[match.teamA]
									: store.teams[match.teamA]}
							</div>
							<div class="w-[45%] truncate text-center text-sm font-bold">:</div>
							<div
								class="w-[45%] truncate text-right text-sm font-bold"
								class:text-yellow-500={match?.winner === match.teamB}
							>
								{match?.winner == match.teamB
									? store.teams[match.teamB] + '🏆'
									: store.teams[match.teamB]}
							</div>
						</div>
						<Separator />
					{/each}
				</div>
			</div>
		{/each}
	</div>
</main>
<div class="fixed right-0 bottom-4 left-0 w-full px-4 md:px-8">
	<DrawerSelectPoints></DrawerSelectPoints>
</div>
