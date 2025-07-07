<script lang="ts">
	import CardContent from '$lib/components/ui/card/card-content.svelte';
	import Card from '$lib/components/ui/card/card.svelte';
	import Label from '$lib/components/ui/label/label.svelte';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import { onMount } from 'svelte';
	import Sidebar from '../Sidebar.svelte';


	import type { PageData } from './$types';
	import AlleTabelle from './AlleTabelle.svelte';
	import GesamtTabelle from './GesamtTabelle.svelte';
	import { store } from '$lib/store/MainStore.svelte';
	import { loadActiveRound, loadGames, loadSpielplan, loadTeams } from '$lib/service/supabaseAPI.svelte';
	import { supabase } from '$lib/service/supabaseClient';

	let { data }: { data: PageData } = $props();

	onMount(async () => {
store.teams=await loadTeams();
store.spielplan=await loadSpielplan();


	});
</script>

<Sidebar />
<div class="flex flex-col items-left text-left">
	<div class="m-2 flex">
</div>
</div>
<div class="flex flex-col items-center text-left">
	<GesamtTabelle/>
</div>
