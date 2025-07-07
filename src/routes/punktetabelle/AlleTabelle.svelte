<script lang="ts">
	import CardContent from '$lib/components/ui/card/card-content.svelte';
	import Card from '$lib/components/ui/card/card.svelte';
	import { store } from '$lib/store/MainStore.svelte';
	import Sidebar from '../Sidebar.svelte';
let {teams=$bindable(), game=null}:{teams:any, game:string}=$props();

let points=[10,8,6,4,2,0];
	// let teams = [
	// 	{ name: "Ei hoch 2", points: 13 },
	// 	{ name: "Tom Max", points: 8 },
	// 	{ name: "Momo Torben", points: 31 },
	// 	{ name: "Team Mexiko", points: 15 },
	// 	{ name: "Marten Feldhans", points: 12 },
	// 	{ name: "Mädels", points: 23 }
	// ].sort((a, b) => b.points - a.points);

	function getBgClass(index: number): string {
		if (index === 0) return 'bg-yellow-300';
		if (index === 1) return 'bg-gray-300';
		if (index === 2) return 'bg-orange-300';
		return 'bg-white';
	}
</script>


<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 px-2">
	{#each teams as team, i}
	<Card class={`p-4 text-lg ${getBgClass(i)} rounded-2xl shadow-md text-stone-800 relative overflow-hidden shiny`}>
		<CardContent class="flex items-center justify-between gap-4 relative z-10">
			<div class="font-black text-xl w-[40px]">{i + 1}.</div>
			<div class="text-lg font-bold flex-1 truncate">{team== -1 ? "---" : store.teams[team]}</div>
			<div class="font-semibold text-right w-[80px]">{points[i]}P</div>
		</CardContent>
	  
		<!-- Metallischer Overlay -->
		<div class="absolute inset-0 pointer-events-none metallic-gradient"></div>
	  
		</Card>
	{/each}
</div>