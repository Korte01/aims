<script lang="ts">
	import CardContent from '$lib/components/ui/card/card-content.svelte';
	import Card from '$lib/components/ui/card/card.svelte';
	import Sidebar from '../Sidebar.svelte';

	let matches = [
		{ teamA: "Momo Torben", teamB: "Ei hoch 2", scoreA: 3, scoreB: 1 },
		{ teamA: "Mädels", teamB: "Tom Max", scoreA: 2, scoreB: 2 },
		{ teamA: "Team Mexiko", teamB: "Marten Feldhans", scoreA: 0, scoreB: 1 }
	];
</script>



<div class="mt-8">
	<h2 class="text-center text-2xl font-bold mb-4">Matches</h2>
	<div class="space-y-4 px-2">
		{#each matches as match}
			<div class="flex items-center justify-between bg-white rounded-xl p-4 shadow-md text-stone-800">
				<div class="text-lg font-bold truncate w-[30%] text-left">{match.teamA}</div>
				<div class="text-center font-black text-xl w-[20%]">
					{match.scoreA} : {match.scoreB}
				</div>
				<div class="text-lg font-bold truncate w-[30%] text-right">{match.teamB}</div>
			</div>
		{/each}
	</div>
    <div class="mt-8">
    <h2 class="text-center text-2xl font-bold mb-4">Rückrunde</h2>
	<div class="space-y-4 px-2">
		{#each matches as match}
			<div class="flex items-center justify-between bg-white rounded-xl p-4 shadow-md text-stone-800">
				<div class="text-lg font-bold truncate w-[30%] text-left">{match.teamA}</div>
				<div class="text-center font-black text-xl w-[20%]">
					{match.scoreA} : {match.scoreB}
				</div>
				<div class="text-lg font-bold truncate w-[30%] text-right">{match.teamB}</div>
			</div>
		{/each}
	</div>
</div>
</div>
