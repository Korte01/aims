<script lang="ts">
	import { goto } from '$app/navigation';
	import { store } from '$lib/store/MainStore.svelte';
	import { onMount } from 'svelte';
	let {
		title,
		icon,
		visible = true,
		isVs = false
	}: { icon: string; title: string; visible: boolean; isVs: boolean } = $props();
	let points = [10, 8, 6, 4, 2, 0];
	let game = $state(store.games[store.games.findIndex((value) => value.title == title)]);
	let punkte = $state('?');
	$effect(() => {
		if (!isVs) {
			let place = game.results?.findIndex((value) => value == store.teamID);
			if (place != -1) punkte = points[place] + 'P';
		}
	});

	//    onMount(() => {
	//     let game=store.games[store.games.findIndex(value=> value.title==title)];
	//     let punkte="?";
	//     if(!isVs){
	//     let place=game.results?.findIndex(value => value==store.teamID);
	//     if(place!=-1)
	//     punkte=points[place]+"P";}
	//  });
</script>

<div
	class="relative flex aspect-square flex-col items-center justify-center rounded-md bg-[#1cd086] p-4 text-center text-white shadow transition select-none hover:scale-[1.02] hover:shadow-lg"
	onclick={() => visible && goto(`/games/${encodeURIComponent(title)}`)}
>
	{#if visible && !isVs}
		<!-- Fragezeichen in der Ecke -->
		<div
			class=" text-md absolute top-1 right-1 rounded-full bg-white px-1.5 font-bold text-[#1cd086] shadow select-none"
		>
			{punkte}
		</div>
	{/if}
	<div class="text-4xl select-none md:text-5xl" class:blur-sm={!visible}>{icon}</div>
	<div class="mt-2 text-lg font-bold select-none md:text-xl" class:blur-xs={!visible}>{title}</div>
	<div class=" text-sm font-thin" class:blur-xs={!visible}>
		{isVs ? 'Team vs Team' : 'Alle Teams'}
	</div>
</div>
