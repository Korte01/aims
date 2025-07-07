<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import { store } from '$lib/store/MainStore.svelte';
	import { onMount } from 'svelte';
    import type { PageData } from '../activateadmin/$types';
	import Sidebar from '../Sidebar.svelte';
	import { goto } from '$app/navigation';
	import { loadActiveRound, loadGames, setActiveRound, setVisible } from '$lib/service/supabaseAPI.svelte';

    let { data }: { data: PageData } = $props();
    let round=$state();
    function setShow(game:any) {
        setVisible(game.title,!game.visible);
        game.visible= !game.visible;
    }
    onMount(async () => {
        store.activeRound=await loadActiveRound();
        store.games=await loadGames();
        round=store.activeRound+1;
    localStorage.setItem("admin","true");
    
});

function save() {
    store.activeRound=round-1;
    setActiveRound(round);
goto("/punktetabelle");
}
</script>
<Sidebar/>
Aktive Runde:
<Input type="number" max=5 bind:value={round}/>
<div class="flex flex-col gap-1">
{#each  store.games as game }
<Button onclick={()=>setShow(game)} > {game.visible ? "👀 "+ game.title: "🫣  "+game.title }</Button>
{/each}
</div>
<Button onclick={save} class="fixed bottom-0 w-full bg-primary text-white font-bold text-lg py-8 rounded-xl shadow hover:bg-primary/90 transition">
    Save
</Button>
