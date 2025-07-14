<script lang="ts">
	import { loadGames } from '$lib/service/supabaseAPI.svelte';
	import { store } from '$lib/store/MainStore.svelte';
	import { onMount } from 'svelte';
	import Sidebar from '../Sidebar.svelte';
    import type { PageData } from './$types';
	import GameDiv from './GameDiv.svelte';

    let { data }: { data: PageData } = $props();
    let games = $state();
	let mounted=$state(false);
	onMount(async () => {
store.games=await loadGames();


});
</script>
<Sidebar />
<div class="grid grid-cols-2 gap-4 px-4 mt-4">

	{#each store.games as game,i}
		<GameDiv  title={game.title} icon={game.icon} visible={game.visible} isVs={game.isVs} />
	{/each}

</div>