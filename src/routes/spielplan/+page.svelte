<script lang="ts">
	import Label from "$lib/components/ui/label/label.svelte";
import Separator from "$lib/components/ui/separator/separator.svelte";
	import { store } from "$lib/store/MainStore.svelte";
	import { onMount } from "svelte";
	import DrawerSelectPoints from "../games/[slug]/DrawerSelectPoints.svelte";
	import Sidebar from "../Sidebar.svelte";
	import { loadActiveRound, loadGames, loadSpielplan, loadTeams } from "$lib/service/supabaseAPI.svelte";
	import { supabase } from "$lib/service/supabaseClient";
	import { Badge } from "$lib/components/ui/badge/index.js";

	let rounds = $state();
	onMount(async () => {
		store.spielplan=await loadSpielplan();
		rounds=store.spielplan;

			// Listener für Tabelle "teams"
	
		// rounds=store.spielplan;
	});
</script>
<Sidebar/>
<div class=" px-2 mb-20 bg-stone-200">
	{#each store.spielplan as round, i}
		<div class=" p-2 ">

			<div class=" bg-white rounded-xl shadow-md ">
				<Label class={`text-xl font-bold rounded-t-xl p-4 text-white flex justify-between items-center ${
					i<=store.activeRound ? 'bg-red-400' : 'bg-red-300'
				}`}>
 <span class="flex items-center gap-x-2">
    Runde {i + 1}
	{#if i==store.activeRound}
    <Badge variant="outline" class="text-white">aktuelle Runde</Badge>
	{/if}
  </span>					<span>8P</span>
				  </Label>
				{#each round.matches as match}
					<div class={`flex items-center justify-between  p-4  ${
						i<=store.activeRound ? 'text-stone-800 ' : 'text-stone-500 '
					}`}>
						<div class="text-sm font-bold truncate w-[45%] text-left"   class:text-yellow-500={match?.winner === match.teamA}
					>{match?.winner==match.teamA ? "🏆"+store.teams[match.teamA]:store.teams[match.teamA]}</div>
					<div class="text-sm font-bold truncate w-[45%] text-center"  >:</div>
						<div class="text-sm font-bold truncate w-[45%] text-right" class:text-yellow-500={match?.winner === match.teamB}
						
					  >{match?.winner==match.teamB ?store.teams[match.teamB]+"🏆":store.teams[match.teamB]}</div>
                        
				
					</div>
                    <Separator/>
				{/each}
			</div>
		</div>
	{/each}
</div>
<div class="fixed bottom-4 left-0 right-0 w-full px-4">
	<DrawerSelectPoints ></DrawerSelectPoints>
</div>


