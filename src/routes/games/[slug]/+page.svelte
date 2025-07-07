<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import { store } from '$lib/store/MainStore.svelte';
	import { onMount } from 'svelte';

	import AlleTabelle from '../../punktetabelle/AlleTabelle.svelte';
	import VsTabelle from '../../punktetabelle/VsTabelle.svelte';
import Sidebar from '../../Sidebar.svelte';
    import type { PageData } from './$types';
	import DrawerSelectPlace from './DrawerSelectPlace.svelte';
	import DrawerSelectPoints from './DrawerSelectPoints.svelte';
	import CardContent from '$lib/components/ui/card/card-content.svelte';
	import Card from '$lib/components/ui/card/card.svelte';
	import CardHeader from '$lib/components/ui/card/card-header.svelte';
	import Label from '$lib/components/ui/label/label.svelte';
	import Beschreibung from './Beschreibung.svelte';
	import { loadGames } from '$lib/service/supabaseAPI.svelte';

    let { data }: { data: PageData } = $props();
    let results=$state();
    console.log(results);

    onMount(async ()=>{
	
		store.games=await loadGames();


        results=store.games[store.games.findIndex(game => game.title === data.game.title)].results;

		
});
</script>


<!-- Sidebar -->
<Sidebar />

<!-- Hauptcontainer -->
<div class="flex flex-col  px-4 pt-6 pb-24">
	<!-- Titel -->
	<h1 class="text-3xl font-bold mb-6">Spiel: {data.game.title+" "+data.game.icon}</h1>

	<!-- Inhalt -->
	<div class="flex-1">
        {#if data.game.isVs}
		<Beschreibung game_disciption={data.game.discription}></Beschreibung>

        {:else}
        <AlleTabelle bind:teams={store.games[store.games.findIndex(game => game.title === data.game.title)].results} game={data.game.title}/>

        {/if}
	</div>

	<!-- Fester Button unten -->
	<div class="fixed bottom-4 left-0 right-0 w-full px-4">
        {#if !data.game.isVs}
		<DrawerSelectPlace   bind:results={results} game={data.game.title}></DrawerSelectPlace>
        

        {/if}
	</div>

</div>
